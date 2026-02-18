/**
 * Script de seed: Importa critérios PNTP 2025 para dbo.Criterios via sqlcmd
 * 
 * Uso:
 *   node api/scripts/seed-criterios-pntp.js
 * 
 * Requer a variável de ambiente AZURE_SQL_CONNECTION_STRING configurada,
 * ou executa diretamente o arquivo SQL via sqlcmd se disponível.
 */

'use strict';

const fs = require('fs');
const path = require('path');

// Tenta carregar a config de conexão do arquivo .env local ou variável de ambiente
const SQL_FILE = path.join(__dirname, '..', '..', 'documentos', 'seed_criterios.sql');

async function run() {
  // Verifica se o arquivo SQL existe
  if (!fs.existsSync(SQL_FILE)) {
    console.error('Arquivo SQL não encontrado:', SQL_FILE);
    console.error('Execute primeiro: py documentos/extrair_criterios.py');
    process.exit(1);
  }

  // Tenta usar a string de conexão para conectar diretamente
  let connectionString = process.env.AZURE_SQL_CONNECTION_STRING;
  
  if (!connectionString) {
    // Tenta ler do .env na raiz da api
    const envPath = path.join(__dirname, '..', '.env');
    if (fs.existsSync(envPath)) {
      const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
      for (const line of lines) {
        const m = line.match(/^AZURE_SQL_CONNECTION_STRING\s*=\s*(.+)$/);
        if (m) {
          connectionString = m[1].trim().replace(/^['"]|['"]$/g, '');
          break;
        }
      }
    }
  }

  if (!connectionString) {
    console.error('❌ AZURE_SQL_CONNECTION_STRING não encontrada.');
    console.error('');
    console.error('Para executar este seed, você tem 3 opções:');
    console.error('');
    console.error('OPÇÃO 1 - Via Kudu SSH (recomendado para produção):');
    console.error('  1. Acesse https://transpjardim.scm.azurewebsites.net/DebugConsole');
    console.error('  2. Execute: cd /home && sqlcmd -S <server> -d <db> -U <user> -P <pass> -i seed_criterios.sql');
    console.error('');
    console.error('OPÇÃO 2 - Via Azure Data Studio ou SSMS:');
    console.error('  Abra o arquivo e execute:', SQL_FILE);
    console.error('');
    console.error('OPÇÃO 3 - Defina a variável e reexecute:');
    console.error('  $env:AZURE_SQL_CONNECTION_STRING="Server=...;Database=...;User Id=...;Password=..."');
    console.error('  node api/scripts/seed-criterios-pntp.js');
    process.exit(1);
  }

  // Conecta via mssql e executa o SQL
  let sql;
  try {
    sql = require('mssql');
  } catch {
    console.error('❌ Pacote mssql não instalado. Execute: npm install mssql --prefix api');
    process.exit(1);
  }

  console.log('Conectando ao Azure SQL...');
  
  // Parse da connection string
  let config;
  try {
    // Tenta formato: Server=...;Database=...;User Id=...;Password=...;Encrypt=true
    const parts = {};
    for (const part of connectionString.split(';')) {
      const idx = part.indexOf('=');
      if (idx > 0) {
        const key = part.slice(0, idx).trim().toLowerCase();
        const val = part.slice(idx + 1).trim();
        parts[key] = val;
      }
    }
    config = {
      server: parts['server'] || parts['data source'],
      database: parts['database'] || parts['initial catalog'],
      user: parts['user id'] || parts['uid'],
      password: parts['password'] || parts['pwd'],
      options: {
        encrypt: true,
        trustServerCertificate: false,
      },
      connectionTimeout: 30000,
    };
    if (!config.server || !config.database) throw new Error('Server ou Database não encontrados na connection string');
  } catch (e) {
    console.error('❌ Erro ao parsear connection string:', e.message);
    console.error('Formato esperado: Server=xxx.database.windows.net;Database=xxx;User Id=xxx;Password=xxx;Encrypt=true');
    process.exit(1);
  }

  let pool;
  try {
    pool = await sql.connect(config);
    console.log('✅ Conectado ao banco de dados');
  } catch (e) {
    console.error('❌ Erro de conexão:', e.message);
    process.exit(1);
  }

  // Verifica se já há critérios
  const countResult = await pool.request().query('SELECT COUNT(1) AS total FROM dbo.Criterios');
  const total = Number(countResult.recordset[0]?.total ?? 0);
  console.log(`Critérios existentes na base: ${total}`);
  
  if (total > 0) {
    console.log('⚠️  Já existem critérios na base. O seed vai ADICIONAR novos critérios sem apagar os existentes.');
    console.log('   Se quiser limpar antes, execute: DELETE FROM dbo.Criterios;');
  }

  // Lê e executa o SQL
  const sqlContent = fs.readFileSync(SQL_FILE, 'utf-8');
  
  // Remove BEGIN TRANSACTION/COMMIT e executa INSERT por INSERT para melhor controle de erro
  const statements = sqlContent
    .split(';\n')
    .map(s => s.trim())
    .filter(s => s.startsWith('INSERT INTO'));

  console.log(`\nExecutando ${statements.length} inserções...`);
  
  let success = 0;
  let errors = 0;
  
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i] + ';';
    try {
      await pool.request().query(stmt);
      success++;
      if ((i + 1) % 20 === 0) {
        console.log(`  ${i + 1}/${statements.length} inserções concluídas...`);
      }
    } catch (e) {
      errors++;
      console.error(`  ❌ Erro no critério ${i + 1}: ${e.message.slice(0, 100)}`);
    }
  }

  await pool.close();
  
  console.log(`\n✅ Seed concluído: ${success} inserções com sucesso, ${errors} erros`);
  
  if (success > 0) {
    console.log(`\nAcesse https://www.transpjardim.com/criterios para verificar os critérios importados.`);
  }
}

run().catch(err => {
  console.error('Erro inesperado:', err);
  process.exit(1);
});
