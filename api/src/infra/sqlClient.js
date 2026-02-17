const sql = require('mssql');

function readSqlConnectionString(explicit) {
  return (
    explicit ||
    process.env.AZURE_SQL_CONNECTION_STRING ||
    process.env.SQLCONNSTR_AZURE_SQL_CONNECTION_STRING ||
    process.env.CUSTOMCONNSTR_AZURE_SQL_CONNECTION_STRING ||
    ''
  );
}

function getConnectionStringInfo(connectionString) {
  const cs = readSqlConnectionString(connectionString);
  if (!cs) return { configured: false };
  return {
    configured: true,
    length: cs.length,
  };
}

function createSqlClient(connectionString) {
  const cs = readSqlConnectionString(connectionString);
  let poolPromise = null;

  async function getPool() {
    if (!cs) {
      throw new Error('AZURE_SQL_CONNECTION_STRING não configurada.');
    }

    if (!poolPromise) {
      const pool = new sql.ConnectionPool(cs);

      // Azure SQL free tier pode estar dormindo — aumentar timeouts
      pool.config.connectionTimeout = 60000;  // 60s para conexão inicial
      pool.config.requestTimeout = 30000;      // 30s por query
      pool.config.pool = {
        ...(pool.config.pool || {}),
        max: 10,
        min: 0,
        acquireTimeoutMillis: 90000,   // 90s para adquirir conexão do pool
        createTimeoutMillis: 90000,    // 90s para criar nova conexão (tarn)
        idleTimeoutMillis: 30000,
      };

      poolPromise = pool.connect().catch((err) => {
        poolPromise = null;
        throw err;
      });
    }

    return poolPromise;
  }

  async function closePool() {
    if (!poolPromise) return;
    const pool = await poolPromise;
    await pool.close();
    poolPromise = null;
  }

  return {
    sql,
    getPool,
    closePool,
    isConfigured: Boolean(cs),
    getConnectionStringInfo: () => getConnectionStringInfo(cs),
  };
}

module.exports = {
  createSqlClient,
  getConnectionStringInfo,
};
