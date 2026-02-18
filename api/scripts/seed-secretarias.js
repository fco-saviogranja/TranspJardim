/**
 * seed-secretarias.js
 * Insere as secretarias do município de Jardim via API REST.
 * Pula secretarias cuja sigla já existe no sistema.
 *
 * Uso:
 *   node api/scripts/seed-secretarias.js <url_base> <usuario> <senha>
 */

'use strict';

const https = require('https');
const http = require('http');

const [, , BASE_URL, USER, PASS] = process.argv;
if (!BASE_URL || !USER || !PASS) {
  console.error('Uso: node seed-secretarias.js <url_base> <usuario> <senha>');
  process.exit(1);
}

const SECRETARIAS = [
  { nome: 'Gabinete do Prefeito',                                           sigla: 'GABINETE',       descricao: 'Gabinete do Prefeito Municipal' },
  { nome: 'Procuradoria Geral do Município',                                sigla: 'PGM',            descricao: 'Procuradoria Geral do Município de Jardim' },
  { nome: 'Controladoria Geral do Município',                               sigla: 'CONTROLADORIA',  descricao: 'Controladoria e Transparência Municipal' },
  { nome: 'Secretaria de Administração',                                    sigla: 'SEMAD',          descricao: 'Secretaria Municipal de Administração' },
  { nome: 'Secretaria de Agricultura, Serviços Rurais e Recursos Hídricos', sigla: 'SAGRH',          descricao: 'Secretaria de Agricultura, Serviços Rurais e Recursos Hídricos' },
  { nome: 'Secretaria de Articulação Política',                             sigla: 'ARTICULACAO',    descricao: 'Secretaria de Articulação Política' },
  { nome: 'Secretaria de Cultura, Turismo e Esporte',                       sigla: 'SECULT',         descricao: 'Secretaria de Cultura, Turismo e Esporte' },
  { nome: 'Secretaria de Educação',                                         sigla: 'SEDUC',          descricao: 'Secretaria Municipal de Educação' },
  { nome: 'Secretaria de Finanças',                                         sigla: 'SEFINANCAS',     descricao: 'Secretaria de Finanças e Tesouro Municipal' },
  { nome: 'Secretaria de Saúde',                                            sigla: 'SESAU',          descricao: 'Secretaria Municipal de Saúde' },
  { nome: 'Secretaria do Desenvolvimento Social e do Trabalho',             sigla: 'SEDES',          descricao: 'Secretaria do Desenvolvimento Social e do Trabalho' },
  { nome: 'Secretaria Municipal de Infraestrutura e Serviços Públicos',     sigla: 'SMISP',          descricao: 'Secretaria Municipal de Infraestrutura e Serviços Públicos' },
  { nome: 'Secretaria Municipal de Meio Ambiente e Desenvolvimento Sustentável', sigla: 'SEMADS',    descricao: 'Secretaria Municipal de Meio Ambiente e Desenvolvimento Sustentável' },
  { nome: 'Secretaria Municipal de Planejamento e Orçamento',               sigla: 'SMPO',           descricao: 'Secretaria Municipal de Planejamento e Orçamento' },
  { nome: 'Serviço Autônomo de Água e Esgoto de Jardim',                    sigla: 'SAAEJ',          descricao: 'Serviço Autônomo de Água e Esgoto de Jardim' },
];

function request(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const isHttps = url.protocol === 'https:';
    const lib = isHttps ? https : http;
    const payload = body ? JSON.stringify(body) : null;
    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
        ...(token ? { 'X-Auth-Token': token } : {}),
      },
      rejectUnauthorized: false,
    };
    const req = lib.request(options, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function main() {
  console.log('🔑 Login...');
  const lr = await request('POST', '/api/auth/login', { username: USER, password: PASS });
  if (lr.status !== 200 || !lr.body.token) throw new Error(`Login falhou: ${JSON.stringify(lr.body)}`);
  const token = lr.body.token;
  console.log('✅ OK\n');

  const sr = await request('GET', '/api/secretarias', null, token);
  const existentes = (sr.body.items ?? []).map((s) => s.sigla?.toUpperCase());
  console.log(`Secretarias já existentes: ${existentes.join(', ')}\n`);

  let inseridas = 0, puladas = 0, erros = 0;

  for (const sec of SECRETARIAS) {
    if (existentes.includes(sec.sigla.toUpperCase())) {
      console.log(`⏭  ${sec.sigla} — já existe (${sec.nome})`);
      puladas++;
      continue;
    }
    const res = await request('POST', '/api/secretarias', sec, token);
    if (res.status === 201 || res.status === 200) {
      console.log(`✅ ${sec.sigla} — inserida`);
      inseridas++;
    } else {
      console.error(`❌ ${sec.sigla} — erro ${res.status}: ${JSON.stringify(res.body)}`);
      erros++;
    }
  }

  console.log('\n========================================');
  console.log(`✅ Inseridas: ${inseridas}`);
  console.log(`⏭  Já existiam: ${puladas}`);
  console.log(`❌ Erros: ${erros}`);
  console.log('========================================');
}

main().catch((e) => { console.error('Erro fatal:', e.message); process.exit(1); });
