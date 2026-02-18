const path = require('node:path');
const fs = require('node:fs');
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');
const { sendEmail } = require('./infra/email');

function wrap(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

function createApp({ store, auth, config, sqlInfo }) {
  const app = express();
  app.set('trust proxy', 1);

  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'data:', 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
  }));

  app.use(compression());

  if (config.nodeEnv !== 'test') {
    app.use(morgan('tiny'));
  }

  app.use(express.json({ limit: '1mb' }));
  app.use(auth.resolveAuth);

  app.get('/api/healthz', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.get('/api/auth/session', wrap(auth.sessionHandler));
  app.post('/api/auth/login', wrap(auth.loginHandler));
  app.post('/api/auth/logout', wrap(auth.logoutHandler));

  app.get('/api/runtime', auth.requireAdmin, (_req, res) => {
    res.status(200).json({
      authMode: config.authMode,
      storeMode: store.kind,
      sql: sqlInfo,
      nodeEnv: config.nodeEnv,
    });
  });

  app.get('/api/dashboard', auth.requireAuth, wrap(async (_req, res) => {
    const metricas = await store.getDashboardMetrics();
    res.status(200).json({
      metricas,
      ultimaAtualizacao: new Date().toISOString(),
    });
  }));

  app.get('/api/criterios', auth.requireAuth, wrap(async (_req, res) => {
    const items = await store.listCriterios();
    res.status(200).json({ items });
  }));

  app.post('/api/criterios', auth.requireAuth, wrap(async (req, res) => {
    const created = await store.createCriterio(req.body ?? {});
    res.status(201).json(created);
  }));

  app.put('/api/criterios/:id', auth.requireAuth, wrap(async (req, res) => {
    const updated = await store.updateCriterio(req.params.id, req.body ?? {});
    if (!updated) return res.status(404).json({ error: 'Critério não encontrado.' });
    return res.status(200).json(updated);
  }));

  app.delete('/api/criterios/:id', auth.requireAuth, wrap(async (req, res) => {
    const removed = await store.deleteCriterio(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Critério não encontrado.' });
    return res.status(204).send();
  }));

  app.get('/api/secretarias', auth.requireAuth, wrap(async (_req, res) => {
    const items = await store.listSecretarias();
    res.status(200).json({ items });
  }));

  app.post('/api/secretarias', auth.requireAuth, wrap(async (req, res) => {
    const created = await store.createSecretaria(req.body ?? {});
    res.status(201).json(created);
  }));

  app.put('/api/secretarias/:id', auth.requireAuth, wrap(async (req, res) => {
    const updated = await store.updateSecretaria(req.params.id, req.body ?? {});
    if (!updated) return res.status(404).json({ error: 'Secretaria não encontrada.' });
    return res.status(200).json(updated);
  }));

  app.delete('/api/secretarias/:id', auth.requireAuth, wrap(async (req, res) => {
    const removed = await store.deleteSecretaria(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Secretaria não encontrada.' });
    return res.status(204).send();
  }));

  app.get('/api/alertas', auth.requireAuth, wrap(async (_req, res) => {
    const items = await store.listAlertas();
    res.status(200).json({ items });
  }));

  // Alertas gerados automaticamente a partir dos critérios (vencidos / próximos 15 dias)
  app.get('/api/alertas/criterios', auth.requireAuth, wrap(async (_req, res) => {
    const items = await store.listAlertasCriterios();
    res.status(200).json({ items });
  }));

  // Gera alerta manual para um critério
  app.post('/api/alertas/criterios/gerar', auth.requireAuth, wrap(async (req, res) => {
    const { criterioId, cicloRef, prioridade } = req.body ?? {};
    if (!criterioId || !cicloRef || !prioridade) {
      return res.status(400).json({ error: 'criterioId, cicloRef e prioridade são obrigatórios.' });
    }
    const geradoPor = req.auth?.user?.name || req.auth?.user?.username || 'desconhecido';
    const result = await store.gerarAlertaManual({ criterioId, cicloRef, prioridade, geradoPor });
    return res.status(200).json(result);
  }));

  // Responsável informa situação de um alerta de critério
  app.patch('/api/alertas/criterios/situacao', auth.requireAuth, wrap(async (req, res) => {
    const { criterioId, cicloRef, situacao, observacao } = req.body ?? {};
    if (!criterioId || !cicloRef || !situacao) {
      return res.status(400).json({ error: 'criterioId, cicloRef e situacao são obrigatórios.' });
    }
    const atualizadoPor = req.auth?.user?.name || req.auth?.user?.username || 'desconhecido';
    const result = await store.upsertAlertaSituacao({ criterioId, cicloRef, situacao, observacao, atualizadoPor });
    return res.status(200).json(result);
  }));

  app.patch('/api/alertas/:id/read', auth.requireAuth, wrap(async (req, res) => {
    const updated = await store.markAlertaAsRead(req.params.id);
    if (!updated) return res.status(404).json({ error: 'Alerta não encontrado.' });
    return res.status(200).json(updated);
  }));

  // ── Regras de Alerta ─────────────────────────────────────
  app.get('/api/alerta-regras', auth.requireAdmin, wrap(async (_req, res) => {
    const items = await store.listAlertaRegras();
    res.status(200).json({ items });
  }));

  app.post('/api/alerta-regras', auth.requireAdmin, wrap(async (req, res) => {
    const created = await store.createAlertaRegra(req.body ?? {});
    res.status(201).json(created);
  }));

  app.put('/api/alerta-regras/:id', auth.requireAdmin, wrap(async (req, res) => {
    const updated = await store.updateAlertaRegra(req.params.id, req.body ?? {});
    if (!updated) return res.status(404).json({ error: 'Regra não encontrada.' });
    return res.status(200).json(updated);
  }));

  app.patch('/api/alerta-regras/:id/toggle', auth.requireAdmin, wrap(async (req, res) => {
    const ok = await store.toggleAlertaRegra(req.params.id, req.body?.ativo === true);
    if (!ok) return res.status(404).json({ error: 'Regra não encontrada.' });
    return res.status(200).json({ ok: true });
  }));

  app.delete('/api/alerta-regras/:id', auth.requireAdmin, wrap(async (req, res) => {
    const removed = await store.deleteAlertaRegra(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Regra não encontrada.' });
    return res.status(204).send();
  }));

  // ── Configuração de Alertas ──────────────────────────────
  app.get('/api/alerta-config', auth.requireAdmin, wrap(async (_req, res) => {
    const config = await store.getAlertaConfig();
    res.status(200).json(config);
  }));

  app.put('/api/alerta-config', auth.requireAdmin, wrap(async (req, res) => {
    const updated = await store.updateAlertaConfig(req.body ?? {});
    res.status(200).json(updated);
  }));

  app.get('/api/admin/overview', auth.requireAdmin, wrap(async (_req, res) => {
    const data = await store.getAdminOverview();
    res.status(200).json(data);
  }));

  // Endpoint restrito a admin: lista completa
  app.get('/api/usuarios', auth.requireAdmin, wrap(async (_req, res) => {
    const items = await store.listUsuarios();
    res.status(200).json({ items });
  }));

  // Endpoint autenticado (qualquer role): lista básica de usuários não-admin ativos (para selects)
  app.get('/api/usuarios/basico', auth.requireAuth, wrap(async (_req, res) => {
    const all = await store.listUsuarios();
    const items = all
      .filter((u) => u.isActive && String(u.role ?? '').toLowerCase() !== 'admin')
      .map((u) => ({ id: u.id, name: u.name || u.username, username: u.username }));
    res.status(200).json({ items });
  }));

  app.post('/api/usuarios', auth.requireAdmin, wrap(async (req, res) => {
    const created = await store.createUsuario(req.body ?? {});
    res.status(201).json(created);
  }));

  app.put('/api/usuarios/:id', auth.requireAdmin, wrap(async (req, res) => {
    if (req.auth?.user?.id === req.params.id && req.body?.isActive === false) {
      return res.status(400).json({ error: 'Você não pode desativar seu próprio usuário.' });
    }
    const updated = await store.updateUsuario(req.params.id, req.body ?? {});
    if (!updated) return res.status(404).json({ error: 'Usuário não encontrado.' });
    return res.status(200).json(updated);
  }));

  // Rota para o próprio usuário atualizar seu perfil (nome, telefone e foto)
  app.put('/api/perfil', auth.requireAuth, wrap(async (req, res) => {
    const id = req.auth?.user?.id;
    if (!id) return res.status(401).json({ error: 'Não autenticado.' });
    const { name, phone, avatarUrl } = req.body ?? {};
    const updated = await store.updatePerfil(id, { name, phone, avatarUrl });
    if (!updated) return res.status(404).json({ error: 'Usuário não encontrado.' });
    return res.status(200).json(updated);
  }));

  app.delete('/api/usuarios/:id', auth.requireAdmin, wrap(async (req, res) => {
    if (req.auth?.user?.id === req.params.id) {
      return res.status(400).json({ error: 'Você não pode excluir seu próprio usuário.' });
    }
    const removed = await store.deleteUsuario(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Usuário não encontrado.' });
    return res.status(204).send();
  }));

  app.get('/api/relatorios', auth.requireAuth, wrap(async (_req, res) => {
    const data = await store.listRelatorios();
    res.status(200).json(data);
  }));

  // ── E-mail ───────────────────────────────────────────────
  app.post('/api/alertas/enviar-email', auth.requireAdmin, wrap(async (req, res) => {
    const { to, subject, text, html } = req.body ?? {};
    const result = await sendEmail(config.smtp, { to, subject, text, html });
    res.status(200).json({ ok: true, ...result });
  }));

  app.all('/api/*', (_req, res) => {
    res.status(404).json({ error: 'Rota não encontrada.' });
  });

  const publicDir = path.join(__dirname, '..', 'public');

  // Avoid clients getting stuck on stale bundles: never cache the SPA entry.
  // Hashed assets can still be cached safely.
  app.use((req, res, next) => {
    if (req.method === 'GET' && (req.path === '/' || req.path === '/index.html')) {
      res.setHeader('Cache-Control', 'no-store');
    }
    next();
  });
  app.use(express.static(publicDir));

  app.get('*', (_req, res) => {
    const indexPath = path.join(publicDir, 'index.html');
    if (!fs.existsSync(indexPath)) {
      return res
        .status(404)
        .send('Front-end não encontrado. Rode o build do web (npm run build) para gerar api/public.');
    }
    res.setHeader('Cache-Control', 'no-store');
    return res.sendFile(indexPath);
  });

  app.use((err, _req, res, _next) => {
    const statusCode = Number(err?.statusCode ?? 500);
    const message = statusCode >= 500 ? 'Erro interno do servidor.' : err.message;
    if (statusCode >= 500) {
      console.error(err);
    }
    res.status(statusCode).json({ error: message });
  });

  return app;
}

module.exports = {
  createApp,
};
