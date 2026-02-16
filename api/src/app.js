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
        styleSrc: ["'self'", "'unsafe-inline'"],
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

  app.patch('/api/alertas/:id/read', auth.requireAuth, wrap(async (req, res) => {
    const updated = await store.markAlertaAsRead(req.params.id);
    if (!updated) return res.status(404).json({ error: 'Alerta não encontrado.' });
    return res.status(200).json(updated);
  }));

  app.get('/api/admin/overview', auth.requireAdmin, wrap(async (_req, res) => {
    const data = await store.getAdminOverview();
    res.status(200).json(data);
  }));

  app.get('/api/usuarios', auth.requireAdmin, wrap(async (_req, res) => {
    const items = await store.listUsuarios();
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
  app.use(express.static(publicDir));

  app.get('*', (_req, res) => {
    const indexPath = path.join(publicDir, 'index.html');
    if (!fs.existsSync(indexPath)) {
      return res
        .status(404)
        .send('Front-end não encontrado. Rode o build do web (npm run build) para gerar api/public.');
    }
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
