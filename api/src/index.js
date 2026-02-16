const { createConfig } = require('./config');
const { createStore } = require('./data/createStore');
const { createAuth } = require('./auth');
const { createApp } = require('./app');

async function buildContext() {
  const config = createConfig();
  const storeResult = await createStore(config);
  const auth = createAuth({ config, store: storeResult.store });
  const app = createApp({
    store: storeResult.store,
    auth,
    config,
    sqlInfo: storeResult.sqlInfo,
  });

  return {
    app,
    close: storeResult.close,
    config,
    storeMode: storeResult.mode,
    sqlInfo: storeResult.sqlInfo,
  };
}

async function start() {
  const context = await buildContext();
  const port = Number.parseInt(process.env.PORT ?? '8080', 10);

  const server = context.app.listen(port, '0.0.0.0', () => {
    console.log(`API/Web listening on http://0.0.0.0:${port} (store=${context.storeMode}, auth=${context.config.authMode})`);
  });

  function shutdown(signal) {
    console.log(`Received ${signal}, shutting down...`);
    server.close(async () => {
      try {
        await context.close();
      } catch (err) {
        console.error('Error closing resources:', err);
      }
      process.exit(0);
    });
  }

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  return { server, context };
}

if (require.main === module) {
  start().catch((err) => {
    console.error('Falha ao iniciar servidor:', err);
    process.exit(1);
  });
}

module.exports = {
  buildContext,
  start,
};
