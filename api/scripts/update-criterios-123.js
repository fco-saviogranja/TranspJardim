/**
 * update-criterios-123.js
 * 
 * Atualiza descrições dos critérios PNTP com base no relatório de auditoria 123.pdf
 * (aIA - Inteligência Artificial Assesi Ver. 2025.03 - Prefeitura Municipal de Jardim)
 * 
 * Uso:
 *   node api/scripts/update-criterios-123.js <url_base> <usuario> <senha>
 * 
 * Exemplo:
 *   node api/scripts/update-criterios-123.js https://www.transpjardim.com franciscodesenvolve "SuaSenha"
 */

const https = require('https');
const http = require('http');

const [, , BASE_URL, USER, PASS] = process.argv;

if (!BASE_URL || !USER || !PASS) {
  console.error('Uso: node update-criterios-123.js <url_base> <usuario> <senha>');
  process.exit(1);
}

// -------------------------------------------------------------------------
// Dados de atualização extraídos do relatório 123.pdf
// Cada entrada contém: numero (para localizar o critério pelo nome),
// descricao (texto explicativo da não-conformidade encontrada na auditoria)
// status: 'Vencido' para não-atendidos, mantemos existentes para os que atendem
// -------------------------------------------------------------------------
const ATUALIZACOES = [
  {
    numero: '2.1',
    descricao: 'AUDITORIA aIA 2025: Não atende. Secretarias do município não estão atualizadas no portal. Faltam informações sobre algumas secretarias como Secretaria de Agricultura, Serviços Rurais e Recursos Hídricos e Secretaria de Articulação Política. Portal: jardim.ce.gov.br/secretarias.php',
    status: 'Vencido'
  },
  {
    numero: '3.2',
    descricao: 'AUDITORIA aIA 2025: Não atende. Horários de atendimento dos órgãos municipais estão desatualizados no portal de transparência. Atualidade: Não atende ao critério de atualização.',
    status: 'Vencido'
  },
  {
    numero: '5.1',
    descricao: 'AUDITORIA aIA 2025: Não atende. Receitas do município não atualizadas dentro do prazo exigido (últimos 30 dias). Portal: jardim.ce.gov.br/receitas.php. Atualidade: Não atende ao critério de atualização dos dados nos últimos 30 dias.',
    status: 'Vencido'
  },
  {
    numero: '5.2',
    descricao: 'AUDITORIA aIA 2025: Não atende. Despesas do município não atualizadas dentro do prazo exigido (últimos 30 dias). Portal: jardim.ce.gov.br/despesas.php. Atualidade: Não atende ao critério de atualização dos dados nos últimos 30 dias.',
    status: 'Vencido'
  },
  {
    numero: '5.3',
    descricao: 'AUDITORIA aIA 2025: Não atende. Balanços e demonstrativos contábeis não atualizados. Série Histórica: Não atende. Portal: jardim.ce.gov.br/balancetes.php.',
    status: 'Vencido'
  },
  {
    numero: '6.1',
    descricao: 'AUDITORIA aIA 2025: Não atende. Empenhos não atualizados dentro do prazo exigido (últimos 30 dias). Atualidade: Não atende ao critério de atualização dos dados nos últimos 30 dias.',
    status: 'Vencido'
  },
  {
    numero: '6.2',
    descricao: 'AUDITORIA aIA 2025: Não atende. Pagamentos não atualizados dentro do prazo exigido (últimos 30 dias). Atualidade: Não atende ao critério de atualização dos dados nos últimos 30 dias.',
    status: 'Vencido'
  },
  {
    numero: '6.3',
    descricao: 'AUDITORIA aIA 2025: Não atende. Relação de fornecedores não atualizada. Atualidade: Não atende ao critério de atualização dos dados nos últimos 30 dias.',
    status: 'Vencido'
  },
  {
    numero: '6.4',
    descricao: 'AUDITORIA aIA 2025: Não atende. Restos a pagar não atualizados no portal de transparência. Atualidade: Não atende ao critério de atualização dos dados nos últimos 30 dias.',
    status: 'Vencido'
  },
  {
    numero: '7.1',
    descricao: 'AUDITORIA aIA 2025: Não atende. Licitações não atualizadas dentro do prazo exigido (últimos 30 dias). Atualidade: Não atende ao critério de atualização dos dados nos últimos 30 dias. Portal: jardim.ce.gov.br/licitacoes.php.',
    status: 'Vencido'
  },
  {
    numero: '8.5',
    descricao: 'AUDITORIA aIA 2025: Não atende. Contratos com dados desatualizados no portal de transparência. Atualidade: Não atende ao critério de atualização dos dados nos últimos 30 dias. Portal: jardim.ce.gov.br/contratos.php.',
    status: 'Vencido'
  },
  {
    numero: '8.7',
    descricao: 'AUDITORIA aIA 2025: Não atende. Aditivos contratuais com dados desatualizados no portal de transparência. Atualidade: Não atende ao critério de atualização dos dados nos últimos 30 dias.',
    status: 'Vencido'
  },
  {
    numero: '9.1',
    descricao: 'AUDITORIA aIA 2025: Não atende. Convênios recebidos com dados desatualizados no portal. Atualidade: Não atende ao critério de atualização dos dados nos últimos 30 dias.',
    status: 'Vencido'
  },
  {
    numero: '9.2',
    descricao: 'AUDITORIA aIA 2025: Não atende. Convênios concedidos com dados desatualizados ou sem registros disponíveis. Disponibilidade: Nenhum registro encontrado.',
    status: 'Vencido'
  },
  {
    numero: '9.3',
    descricao: 'AUDITORIA aIA 2025: Não atende. Fiscal de contrato não informado em mais de 100 contratos ativos. Módulo aLicitação - Contratos e aditivos. Exemplo de contratos sem fiscal informado (Nº Contrato / Contratado): diversos contratos de toda a administração municipal.',
    status: 'Vencido'
  },
  {
    numero: '10.1',
    descricao: 'AUDITORIA aIA 2025: Não atende. Obras públicas não atualizadas dentro do prazo exigido (últimos 30 dias). Atualidade: Não atende ao critério de atualização dos dados nos últimos 30 dias. Módulo aLicitação - Obras.',
    status: 'Vencido'
  },
  {
    numero: '10.4',
    descricao: 'AUDITORIA aIA 2025: Não atende. Nenhum registro de obras paralisadas encontrado no portal de transparência. Disponibilidade: Nenhum registro encontrado para obras paralisadas.',
    status: 'Vencido'
  },
  {
    numero: '11.2',
    descricao: 'AUDITORIA aIA 2025: Não atende. Relatório de Gestão Municipal (RGM) não divulgado no portal. Disponibilidade: Nenhum documento encontrado. Módulo aSiteGov - Documentos institucionais.',
    status: 'Vencido'
  },
  {
    numero: '11.3',
    descricao: 'AUDITORIA aIA 2025: Não atende. Parecer do Tribunal de Contas sobre as contas de 2009 e 2010 não disponibilizado no portal de transparência. Disponibilidade: Contas de 2009 e 2010 sem parecer publicado.',
    status: 'Vencido'
  },
  {
    numero: '11.4',
    descricao: 'AUDITORIA aIA 2025: Não atende. Relatório de Fiscalização e Gestão Fiscal (RFGF) não divulgado conforme exigência. Disponibilidade: Nenhum documento encontrado.',
    status: 'Vencido'
  },
  {
    numero: '11.7',
    descricao: 'AUDITORIA aIA 2025: Não atende. Plano estratégico municipal não disponibilizado no portal de transparência. Disponibilidade: Nenhum documento publicado. Módulo aSiteGov - Planejamento municipal.',
    status: 'Vencido'
  },
  {
    numero: '12.8',
    descricao: 'AUDITORIA aIA 2025: Não atende. Respostas sigilosas ao SIC (Serviço de Informação ao Cidadão) enviadas sem a devida justificativa legal. Critério de transparência ativa no SIC comprometido.',
    status: 'Vencido'
  },
  {
    numero: '12.9',
    descricao: 'AUDITORIA aIA 2025: Não atende. Prazo para respostas do SIC não atendido. Respostas com atraso e/ou sem justificativa formal de extensão de prazo.',
    status: 'Vencido'
  },
  {
    numero: '15.5',
    descricao: 'AUDITORIA aIA 2025: Não atende. Política de Governo Digital (LGPD e transformação digital) não regulamentada ou publicada no município. Disponibilidade: Nenhum ato normativo encontrado.',
    status: 'Vencido'
  },
  {
    numero: '16.2',
    descricao: 'AUDITORIA aIA 2025: Não atende. Renúncias fiscais (isenções, remissões, anistias) não publicadas no portal de transparência. Disponibilidade: Nenhum documento encontrado. Módulo aSiteGov - Documentos fiscais.',
    status: 'Vencido'
  },
  {
    numero: '16.3',
    descricao: 'AUDITORIA aIA 2025: Não atende. Demonstrativo de Renúncias de Receita sem dados atualizados no portal. Disponibilidade: Nenhum registro encontrado.',
    status: 'Vencido'
  },
  {
    numero: '16.4',
    descricao: 'AUDITORIA aIA 2025: Não atende. Beneficiários de renúncias fiscais não publicados conforme exigência legal. Disponibilidade: Nenhum registro ou documento encontrado.',
    status: 'Vencido'
  },
  {
    numero: '17.1',
    descricao: 'AUDITORIA aIA 2025: Não atende. Emendas parlamentares do exercício atual não atualizadas no portal de transparência. Atualidade: Não atende ao critério de atualização dos dados no último exercício.',
    status: 'Vencido'
  },
  {
    numero: '17.2',
    descricao: 'AUDITORIA aIA 2025: Não atende. Execução de emendas parlamentares não divulgada conforme exigência. Atualidade: Não atende ao critério de atualização dos dados no último exercício.',
    status: 'Vencido'
  },
  {
    numero: '18.2',
    descricao: 'AUDITORIA aIA 2025: Não atende. 15 Unidades Básicas de Saúde (UBS) sem profissionais de saúde cadastrados no portal. UBS sem profissionais: UBS I, UBS II, UBS III, UBS IV, UBS V, UBS VI, UBS VII, UBS VIII, UBS IX, UBS X, UBS XI, UBS XII, UBS XIII, Hospital Municipal de Jardim, CAPS (Centro de Atenção Psicossocial). Módulo aLC131 - Profissionais de Saúde.',
    status: 'Vencido'
  },
  {
    numero: '18.4',
    descricao: 'AUDITORIA aIA 2025: Não atende. Carta de serviço não informada para mais de 150 medicamentos do elenco municipal no aLC131 - Cadastro de medicamentos. Medicamentos incluem: Aciclovir, Ácido Acetilsalicílico, Ácido Fólico, Albendazol, Amiodarona, Amitriptilina, Amoxicilina, Anlodipino, Atenolol, Azitromicina, Brometo de Ipratrópio, Carbonato de Cálcio, Carbamazepina, Captopril, Ceftriaxona, entre muitos outros. Ver módulo aLC131.',
    status: 'Vencido'
  },
  {
    numero: '18.5',
    descricao: 'AUDITORIA aIA 2025: Não atende. Medicamentos sem vinculação de estoque às farmácias públicas. Problema identificado em dezenas de itens do elenco municipal. Exemplos: Acitretina, Ciprofibrato, Clomipramina, Donepezila, Haloperidol, Ipratrópio, entre outros. Módulo aLC - Cadastro de medicamentos e estoques.',
    status: 'Vencido'
  },
  {
    numero: '19.1',
    descricao: 'AUDITORIA aIA 2025: Não atende. Plano Municipal de Educação e/ou Relatório de Resultados não atualizados no último exercício. Atualidade: Não atende ao critério de atualização dos dados no último exercício. Módulo aSiteGov - Cadastro de planos municipais.',
    status: 'Vencido'
  },
];

// -------------------------------------------------------------------------
// Funções HTTP
// -------------------------------------------------------------------------
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
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function login() {
  const res = await request('POST', '/api/auth/login', { username: USER, password: PASS });
  if (res.status !== 200 || !res.body.token) {
    throw new Error(`Login falhou: ${JSON.stringify(res.body)}`);
  }
  return res.body.token;
}

async function getCriterios(token) {
  const res = await request('GET', '/api/criterios', null, token);
  if (res.status !== 200) throw new Error(`Erro ao buscar critérios: ${JSON.stringify(res.body)}`);
  // A API pode retornar array direto ou { items: [] }
  const data = res.body;
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.items)) return data.items;
  throw new Error(`Formato inesperado de critérios: ${JSON.stringify(data).slice(0, 100)}`);
}

async function updateCriterio(id, data, token) {
  const res = await request('PUT', `/api/criterios/${id}`, data, token);
  return res;
}

// -------------------------------------------------------------------------
// Main
// -------------------------------------------------------------------------
async function main() {
  console.log('🔑 Fazendo login...');
  const token = await login();
  console.log('✅ Login OK\n');

  console.log('📋 Buscando critérios existentes...');
  const criterios = await getCriterios(token);
  console.log(`   ${criterios.length} critérios encontrados\n`);

  let atualizados = 0;
  let naoEncontrados = 0;
  let erros = 0;

  for (const upd of ATUALIZACOES) {
    // Localiza o critério pelo início do nome que começa com o número (ex: "2.1 ")
    const criterio = criterios.find(c => {
      const nome = (c.Nome || c.nome || '').trim();
      return nome.startsWith(upd.numero + ' ') || nome.startsWith(upd.numero + '.');
    });

    if (!criterio) {
      console.warn(`⚠️  Critério ${upd.numero} não encontrado no sistema`);
      naoEncontrados++;
      continue;
    }

    const id = criterio.Id || criterio.id;
    const nomeAtual = criterio.Nome || criterio.nome;

    const payload = {
      Nome: nomeAtual,
      Status: upd.status,
      Descricao: upd.descricao,
      Periodicidade: criterio.Periodicidade || criterio.periodicidade || 'Mensal',
      SecretariaId: criterio.SecretariaId || criterio.secretariaId,
      Responsavel: criterio.Responsavel || criterio.responsavel || '',
    };

    const res = await updateCriterio(id, payload, token);

    if (res.status === 200 || res.status === 204) {
      console.log(`✅ ${upd.numero} atualizado | Status: ${upd.status}`);
      atualizados++;
    } else {
      console.error(`❌ Erro ao atualizar ${upd.numero}: HTTP ${res.status} - ${JSON.stringify(res.body)}`);
      erros++;
    }
  }

  console.log('\n========================================');
  console.log(`Resultado:`);
  console.log(`  ✅ Atualizados com sucesso: ${atualizados}`);
  console.log(`  ⚠️  Não encontrados no sistema: ${naoEncontrados}`);
  console.log(`  ❌ Erros: ${erros}`);
  console.log('========================================');
}

main().catch((err) => {
  console.error('Erro fatal:', err.message);
  process.exit(1);
});
