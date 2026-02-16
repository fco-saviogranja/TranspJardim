const { createMemoryStore } = require('./memoryStore');
const { createSqlStore } = require('./sqlStore');
const { createSqlClient } = require('../infra/sqlClient');

async function createStore(config) {
  const sqlClient = createSqlClient(config.sqlConnectionString);

  if (config.isProduction && config.forceSqlInProduction && !sqlClient.isConfigured) {
    throw new Error('Produção exige AZURE_SQL_CONNECTION_STRING configurada.');
  }

  if (!sqlClient.isConfigured) {
    return {
      mode: 'memory',
      store: await createMemoryStore({ localUsers: config.localUsers }),
      sqlInfo: sqlClient.getConnectionStringInfo(),
      close: async () => {},
    };
  }

  const sqlStore = await createSqlStore({ sqlClient, localUsers: config.localUsers });
  return {
    mode: 'sql',
    store: sqlStore,
    sqlInfo: sqlClient.getConnectionStringInfo(),
    close: sqlClient.closePool,
  };
}

module.exports = { createStore };
