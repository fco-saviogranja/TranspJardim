const crypto = require('node:crypto');
const { verifyPassword } = require('./infra/password');

function decodeClientPrincipal(raw) {
  try {
    const decoded = Buffer.from(String(raw), 'base64').toString('utf8');
    return JSON.parse(decoded);
  } catch (_err) {
    return null;
  }
}

function claimValue(claims, candidates) {
  for (const key of candidates) {
    const found = claims.find((claim) => claim.typ === key);
    if (found?.val) return String(found.val);
  }
  return '';
}

function mapRole(rawRole, adminEmails, email) {
  const role = String(rawRole ?? '').trim().toLowerCase();
  if (role) return role;
  if (email && adminEmails.includes(String(email).toLowerCase())) return 'admin';
  return 'padrao';
}

function toPublicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    username: user.username,
    role: user.role,
    name: user.name,
    email: user.email,
    isActive: user.isActive,
  };
}

function createAuth({ config, store }) {
  // --- Tokens HMAC assinados (stateless — sobrevivem a reinicializações) ---
  // Formato: <base64url(payload)>.<hmac-sha256>
  // payload: { uid, exp } onde exp = Unix timestamp em segundos
  const TOKEN_SECRET = config.tokenSecret || 'transpjardim-default-secret-change-me';

  function signPayload(payload) {
    const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const sig = crypto.createHmac('sha256', TOKEN_SECRET).update(encoded).digest('base64url');
    return `${encoded}.${sig}`;
  }

  function verifyToken(raw) {
    if (!raw || typeof raw !== 'string') return null;
    const parts = raw.split('.');
    if (parts.length !== 2) return null;
    const [encoded, sig] = parts;
    const expected = crypto.createHmac('sha256', TOKEN_SECRET).update(encoded).digest('base64url');
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
    try {
      const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
      if (typeof payload.exp === 'number' && Date.now() / 1000 > payload.exp) return null;
      return payload;
    } catch {
      return null;
    }
  }

  function easyAuthEnabled() {
    return config.authMode === 'easy-auth' || config.authMode === 'hybrid';
  }

  function localAuthEnabled() {
    return config.authMode === 'local' || config.authMode === 'hybrid';
  }

  function issueToken(userId) {
    const exp = Math.floor(Date.now() / 1000) + config.localSessionTtlHours * 3600;
    return signPayload({ uid: userId, exp });
  }

  async function readLocalSession(req) {
    // Read from X-Auth-Token header (preferred — not intercepted by Easy Auth)
    // or fall back to Authorization: Bearer for backward compatibility.
    let raw = String(req.headers['x-auth-token'] ?? '').trim();
    if (!raw) {
      const authHeader = String(req.headers.authorization ?? '');
      raw = authHeader.startsWith('Bearer ') ? authHeader.slice('Bearer '.length).trim() : '';
    }
    if (!raw) return { authenticated: false, token: null, user: null };

    const payload = verifyToken(raw);
    if (!payload?.uid) return { authenticated: false, token: null, user: null };

    const user = await store.findUserById(payload.uid);
    if (!user || !user.isActive) return { authenticated: false, token: null, user: null };

    return { authenticated: true, token: raw, user: toPublicUser(user) };
  }

  async function readEasyAuthSession(req) {
    const rawPrincipal = req.headers['x-ms-client-principal'];
    if (!rawPrincipal) return { authenticated: false, user: null };

    const principal = decodeClientPrincipal(rawPrincipal);
    if (!principal || !Array.isArray(principal.claims)) {
      return { authenticated: false, user: null };
    }

    const claims = principal.claims;
    const email = claimValue(claims, [
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
      'preferred_username',
      'upn',
    ]).toLowerCase();

    const username =
      claimValue(claims, [
        'preferred_username',
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
      ])
        .split('@')[0]
        .toLowerCase() ||
      email.split('@')[0] ||
      'usuario';

    const name = claimValue(claims, [
      'name',
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
    ]) || username;

    const id =
      claimValue(claims, [
        'http://schemas.microsoft.com/identity/claims/objectidentifier',
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier',
        'sub',
      ]) ||
      crypto.randomUUID();

    const claimRole = claimValue(claims, [
      'roles',
      'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
    ]);

    const role = mapRole(claimRole, config.adminEmails, email);

    const persisted = await store.upsertUserFromIdentity({
      id,
      username,
      role,
      name,
      email,
      isActive: true,
    });

    return {
      authenticated: true,
      user: toPublicUser(persisted) || { id, username, role, name, email, isActive: true },
    };
  }

  async function resolveAuth(req, _res, next) {
    try {
      if (easyAuthEnabled()) {
        const session = await readEasyAuthSession(req);
        if (session.authenticated) {
          req.auth = {
            mode: config.authMode,
            provider: 'easy-auth',
            authenticated: true,
            user: session.user,
            token: null,
          };
          return next();
        }

        if (config.authMode === 'easy-auth') {
          req.auth = {
            mode: config.authMode,
            provider: null,
            authenticated: false,
            user: null,
            token: null,
          };
          return next();
        }
      }

      if (localAuthEnabled()) {
        const localSession = await readLocalSession(req);
        req.auth = {
          mode: config.authMode,
          provider: localSession.authenticated ? 'local' : null,
          authenticated: localSession.authenticated,
          user: localSession.user,
          token: localSession.token,
        };
        return next();
      }

      req.auth = {
        mode: config.authMode,
        provider: null,
        authenticated: false,
        user: null,
        token: null,
      };
      return next();
    } catch (err) {
      return next(err);
    }
  }

  function requireAuth(req, res, next) {
    if (req.auth?.authenticated) return next();
    return res.status(401).json({
      error: 'Não autenticado.',
      mode: config.authMode,
      loginUrl: easyAuthEnabled() ? '/.auth/login/aad?post_login_redirect_uri=/' : null,
    });
  }

  function requireAdmin(req, res, next) {
    if (!req.auth?.authenticated) {
      return res.status(401).json({ error: 'Não autenticado.' });
    }
    if (req.auth.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso restrito a administradores.' });
    }
    return next();
  }

  async function sessionHandler(req, res) {
    // When authenticated via Easy Auth, issue a local Bearer token so the
    // frontend can use it for all requests (POST, PUT, DELETE) without
    // depending on the Easy Auth session cookie (which Azure blocks on
    // non-GET requests).
    let token = req.auth?.token ?? null;
    if (req.auth?.authenticated && req.auth.provider === 'easy-auth' && req.auth.user?.id) {
      token = issueToken(req.auth.user.id);
    }

    return res.status(200).json({
      authenticated: Boolean(req.auth?.authenticated),
      mode: config.authMode,
      provider: req.auth?.provider ?? null,
      user: req.auth?.authenticated ? req.auth.user : null,
      token,
      loginUrl: easyAuthEnabled() ? '/.auth/login/aad?post_login_redirect_uri=/' : null,
      logoutUrl: req.auth?.provider === 'easy-auth' ? '/.auth/logout' : null,
    });
  }

  async function loginHandler(req, res) {
    if (!localAuthEnabled()) {
      return res.status(405).json({ error: 'Login por senha está desabilitado neste ambiente.' });
    }

    const identifier = String(req.body?.username ?? req.body?.email ?? '').trim().toLowerCase();
    const password = String(req.body?.password ?? '').trim();

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Usuário (ou email) e senha são obrigatórios.' });
    }

    const user = identifier.includes('@')
      ? await store.findUserByEmail(identifier)
      : await store.findUserByUsername(identifier);
    if (!user || !user.isActive || !user.passwordHash || !verifyPassword(password, user.passwordHash)) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const token = issueToken(user.id);
    return res.status(200).json({
      user: toPublicUser(user),
      token,
    });
  }

  async function logoutHandler(req, res) {
    // Clear local Bearer session if present
    let token = String(req.headers['x-auth-token'] ?? '').trim();
    if (!token) {
      const authHeader = String(req.headers.authorization ?? '');
      token = authHeader.startsWith('Bearer ') ? authHeader.slice('Bearer '.length).trim() : '';
    }
    if (token) localSessions.delete(token);

    // In hybrid/easy-auth mode, always return logoutUrl so the frontend
    // can redirect to /.auth/logout and clear the Easy Auth cookie.
    const logoutUrl = easyAuthEnabled() ? '/.auth/logout' : null;
    return res.status(200).json({ ok: true, logoutUrl });
  }

  return {
    resolveAuth,
    requireAuth,
    requireAdmin,
    sessionHandler,
    loginHandler,
    logoutHandler,
  };
}

module.exports = {
  createAuth,
};
