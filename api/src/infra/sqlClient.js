const sql = require('mssql');

function getConnectionStringInfo(connectionString) {
  const cs = connectionString || process.env.AZURE_SQL_CONNECTION_STRING;
  if (!cs) return { configured: false };
  return {
    configured: true,
    length: cs.length,
  };
}

function createSqlClient(connectionString) {
  const cs = connectionString || process.env.AZURE_SQL_CONNECTION_STRING;
  let poolPromise = null;

  async function getPool() {
    if (!cs) {
      throw new Error('AZURE_SQL_CONNECTION_STRING não configurada.');
    }

    if (!poolPromise) {
      const pool = new sql.ConnectionPool(cs);
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
