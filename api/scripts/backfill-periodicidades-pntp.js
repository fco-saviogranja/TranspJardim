'use strict';

const { createSqlClient } = require('../src/infra/sqlClient');
const {
  inferPeriodicidadeFromNome,
  normalizePeriodicidade,
} = require('../src/domain/pntpRules');

const shouldApply = process.argv.includes('--apply');
const sqlClient = createSqlClient();

async function main() {
  if (!sqlClient.isConfigured) {
    throw new Error('AZURE_SQL_CONNECTION_STRING não configurada.');
  }

  const pool = await sqlClient.getPool();
  const result = await pool.request().query(`
    SELECT
      CAST(Id AS NVARCHAR(36)) AS id,
      Nome AS nome,
      Periodicidade AS periodicidade
    FROM dbo.Criterios
    ORDER BY Nome ASC;
  `);

  const criterios = result.recordset ?? [];
  const updates = [];
  let semPrefixoMapeado = 0;

  for (const criterio of criterios) {
    const periodicidadeInferida = inferPeriodicidadeFromNome(criterio.nome);
    if (!periodicidadeInferida) {
      semPrefixoMapeado += 1;
      continue;
    }

    const periodicidadeAtual = normalizePeriodicidade(criterio.periodicidade);
    if (periodicidadeAtual === periodicidadeInferida) {
      continue;
    }

    updates.push({
      id: criterio.id,
      nome: criterio.nome,
      atual: periodicidadeAtual,
      nova: periodicidadeInferida,
    });
  }

  console.log('========================================');
  console.log(`Critérios analisados: ${criterios.length}`);
  console.log(`Sem prefixo mapeado: ${semPrefixoMapeado}`);
  console.log(`Necessitam atualização: ${updates.length}`);

  if (updates.length > 0) {
    console.log('');
    console.log('Prévia (até 20 itens):');
    for (const item of updates.slice(0, 20)) {
      console.log(`- ${item.nome}: ${item.atual} -> ${item.nova}`);
    }
  }

  if (!shouldApply) {
    console.log('');
    console.log('Modo dry-run concluído.');
    console.log('Para aplicar no banco, execute:');
    console.log('node scripts/backfill-periodicidades-pntp.js --apply');
    return;
  }

  let updatedCount = 0;
  for (const item of updates) {
    await pool.request()
      .input('id', sqlClient.sql.UniqueIdentifier, item.id)
      .input('periodicidade', sqlClient.sql.NVarChar(30), item.nova)
      .query(`
        UPDATE dbo.Criterios
        SET Periodicidade = @periodicidade
        WHERE Id = @id;
      `);
    updatedCount += 1;
  }

  console.log('');
  console.log('Backfill concluído com sucesso.');
  console.log(`Registros atualizados: ${updatedCount}`);
}

main()
  .catch((error) => {
    console.error('Erro ao executar backfill:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sqlClient.closePool();
  });
