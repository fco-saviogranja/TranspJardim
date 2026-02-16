function parseCommaList(value) {
  if (!value) return [];
  return String(value)
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function normalizeLocalUsers(entries) {
  if (!Array.isArray(entries)) return [];
  return entries
    .map((entry, idx) => {
      if (!entry || typeof entry !== 'object') return null;
      const username = String(entry.username ?? '').trim().toLowerCase();
      const password = String(entry.password ?? '').trim();
      const role = String(entry.role ?? 'padrao').trim().toLowerCase();
      const name = String(entry.name ?? username).trim();
      const email = String(entry.email ?? `${username}@local`).trim().toLowerCase();
      const id = String(entry.id ?? `local-${idx + 1}`).trim();
      if (!username || !password || !name || !email) return null;
      return {
        id,
        username,
        password,
        role,
        name,
        email,
      };
    })
    .filter(Boolean);
}

function parseLocalUsers(nodeEnv) {
  if (process.env.LOCAL_AUTH_USERS_JSON) {
    try {
      const parsed = JSON.parse(process.env.LOCAL_AUTH_USERS_JSON);
      return normalizeLocalUsers(parsed);
    } catch (_err) {
      throw new Error('LOCAL_AUTH_USERS_JSON inválido. Use JSON array com username/password/name/email.');
    }
  }

  if (nodeEnv === 'production') return [];

  const devPassword = process.env.LOCAL_AUTH_DEFAULT_PASSWORD ?? 'admin';
  return normalizeLocalUsers([
    {
      id: 'local-admin-1',
      username: 'admin',
      password: devPassword,
      role: 'admin',
      name: 'Administrador Sistema',
      email: 'admin@jardim.ce.gov.br',
    },
  ]);
}

function createConfig() {
  const nodeEnv = String(process.env.NODE_ENV ?? 'development').toLowerCase();
  const isProduction = nodeEnv === 'production';
  const authMode = String(process.env.AUTH_MODE ?? (isProduction ? 'easy-auth' : 'local')).trim().toLowerCase();

  if (!['easy-auth', 'local'].includes(authMode)) {
    throw new Error(`AUTH_MODE inválido: ${authMode}. Use "easy-auth" ou "local".`);
  }

  const localUsers = parseLocalUsers(nodeEnv);
  if (authMode === 'local' && localUsers.length === 0) {
    throw new Error('AUTH_MODE=local exige usuários em LOCAL_AUTH_USERS_JSON (ou defaults em desenvolvimento).');
  }

  return {
    nodeEnv,
    isProduction,
    authMode,
    sqlConnectionString: process.env.AZURE_SQL_CONNECTION_STRING,
    adminEmails: parseCommaList(process.env.ADMIN_EMAILS),
    localUsers,
    localSessionTtlHours: Number.parseInt(process.env.LOCAL_SESSION_TTL_HOURS ?? '12', 10),
    forceSqlInProduction: String(process.env.FORCE_SQL_IN_PRODUCTION ?? 'true').toLowerCase() !== 'false',
  };
}

module.exports = { createConfig };
