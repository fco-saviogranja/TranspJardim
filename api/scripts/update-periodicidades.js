/**
 * update-periodicidades.js
 * 
 * Atualiza a Periodicidade de cada critério PNTP de acordo com as exigências da
 * Cartilha PNTP 2025. Preserva todos os outros campos.
 *
 * Referências de prazo por categoria:
 *  - Mensal:        dados financeiros (receitas, despesas, empenhos, pagamentos,
 *                   contratos, licitações, convênios, obras, diárias, RH)
 *  - Bimestral:     RREO (Lei de Responsabilidade Fiscal - 2 meses)
 *  - Trimestral:    Demonstrações financeiras trimestrais
 *  - Quadrimestral: RGF - Relatório de Gestão Fiscal (Lei 101/2000 - 4 meses)
 *  - Semestral:     Estagiários, pesquisas de satisfação
 *  - Anual:         Legislação, planos, estrutura organizacional, relatórios anuais
 *
 * Uso:
 *   node api/scripts/update-periodicidades.js <url_base> <usuario> <senha>
 */

'use strict';

const https = require('https');
const http = require('http');

const [, , BASE_URL, USER, PASS] = process.argv;
if (!BASE_URL || !USER || !PASS) {
  console.error('Uso: node update-periodicidades.js <url_base> <usuario> <senha>');
  process.exit(1);
}

// Mapeamento: prefixo do número do critério → periodicidade correta
// Baseado na Cartilha PNTP 2025 e exigências da Lei de Acesso à Informação
const PERIODICIDADES = {
  // 1. Informações Prioritárias – existência do site/portal (verificação anual)
  '1.1': 'Anual',
  '1.2': 'Anual',
  '1.3': 'Anual',
  '1.4': 'Anual',

  // 2. Informações Institucionais
  '2.1': 'Mensal',        // estrutura organizacional – auditoria exige ≤30 dias
  '2.2': 'Anual',         // competências
  '2.3': 'Mensal',        // responsáveis pela gestão – muda com nomeações
  '2.4': 'Anual',         // endereços e telefones
  '2.5': 'Anual',         // horário de atendimento
  '2.6': 'Anual',         // atos normativos próprios
  '2.7': 'Anual',         // FAQs
  '2.8': 'Anual',         // redes sociais
  '2.9': 'Anual',         // Radar da Transparência

  // 3. Receita – atualização ≤30 dias exigida pelo TCE/PNTP
  '3.1': 'Mensal',
  '3.2': 'Mensal',
  '3.3': 'Anual',         // dívida ativa – publicação periódica anual

  // 4. Despesa – atualização ≤30 dias
  '4.1': 'Mensal',
  '4.2': 'Mensal',
  '4.3': 'Mensal',
  '4.4': 'Mensal',
  '4.5': 'Anual',         // patrocínios
  '4.6': 'Anual',         // contratos de publicidade

  // 5. Convênios – atualização ≤30 dias
  '5.1': 'Mensal',
  '5.2': 'Mensal',
  '5.3': 'Anual',         // acordos sem transferência financeira

  // 6. Recursos Humanos
  '6.1': 'Mensal',        // servidores/cargos – admissões e exonerações mensais
  '6.2': 'Mensal',        // remuneração – folha de pagamento mensal
  '6.3': 'Semestral',     // estagiários
  '6.4': 'Mensal',        // terceirizados
  '6.5': 'Anual',         // editais de concurso
  '6.6': 'Anual',         // aprovados em concurso

  // 7. Diárias e Passagens – mensal (afastamentos ocorrem continuamente)
  '7.1': 'Mensal',
  '7.2': 'Anual',         // tabela de valores de diárias

  // 8. Licitações – atualização ≤30 dias
  '8.1': 'Mensal',
  '8.2': 'Mensal',
  '8.3': 'Mensal',
  '8.4': 'Mensal',
  '8.5': 'Mensal',        // atas de adesão SRP
  '8.6': 'Anual',         // plano de contratações anual
  '8.7': 'Mensal',        // sancionados
  '8.8': 'Anual',         // regulamento interno

  // 9. Contratos – atualização ≤30 dias
  '9.1': 'Mensal',
  '9.2': 'Mensal',
  '9.3': 'Mensal',        // fiscais de contrato
  '9.4': 'Mensal',        // ordem cronológica de pagamentos

  // 10. Obras – atualização ≤30 dias
  '10.1': 'Mensal',
  '10.2': 'Mensal',
  '10.3': 'Mensal',
  '10.4': 'Mensal',

  // 11. Planejamento e Prestação de Contas
  '11.1':  'Anual',           // balanço geral do ano anterior
  '11.2':  'Anual',           // relatório de gestão/atividades
  '11.3':  'Anual',           // decisão TCE sobre contas
  '11.4':  'Anual',           // julgamento pelo Legislativo
  '11.5':  'Quadrimestral',   // RGF – Lei 101/2000, art. 55 (a cada 4 meses)
  '11.6':  'Bimestral',       // RREO – Lei 101/2000, art. 52 (a cada 2 meses)
  '11.7':  'Anual',           // plano estratégico institucional
  '11.8':  'Anual',           // PPA (vigência 4 anos, publicação anual)
  '11.9':  'Anual',           // LDO
  '11.10': 'Anual',           // LOA
  '11.11': 'Trimestral',      // demonstrações financeiras trimestrais
  '11.12': 'Anual',           // demonstrações com parecer de auditoria

  // 12. SIC / Acesso à Informação
  '12.1':  'Anual',
  '12.2':  'Anual',
  '12.3':  'Anual',
  '12.4':  'Anual',
  '12.5':  'Anual',
  '12.6':  'Anual',
  '12.7':  'Anual',           // relatório anual de pedidos
  '12.8':  'Mensal',          // lista de documentos sigilosos (auditoria ≤30 dias)
  '12.9':  'Anual',           // desclassificados nos últimos 12 meses

  // 13. Acessibilidade – verificação anual (estrutural do site)
  '13.1': 'Anual',
  '13.2': 'Anual',
  '13.3': 'Anual',
  '13.4': 'Anual',
  '13.5': 'Anual',

  // 14. Ouvidoria – anual (estrutural)
  '14.1': 'Anual',
  '14.2': 'Anual',
  '14.3': 'Anual',

  // 15. LGPD e Governo Digital
  '15.1': 'Anual',
  '15.2': 'Anual',
  '15.3': 'Anual',
  '15.4': 'Anual',
  '15.5': 'Anual',
  '15.6': 'Semestral',        // pesquisas de satisfação (ao menos 2x/ano)

  // 16. Renúncias de Receita – anual (demonstrativo fiscal)
  '16.1': 'Anual',
  '16.2': 'Anual',
  '16.3': 'Anual',
  '16.4': 'Anual',

  // 17. Emendas Parlamentares – mensal (execução orçamentária corrente)
  '17.1': 'Mensal',
  '17.2': 'Mensal',

  // 18. Saúde
  '18.1': 'Anual',            // plano e relatório de gestão em saúde
  '18.2': 'Mensal',           // profissionais nas UBS
  '18.3': 'Mensal',           // lista de espera de regulação
  '18.4': 'Mensal',           // lista de medicamentos/cartas de serviço
  '18.5': 'Mensal',           // estoques de farmácias públicas

  // 19. Educação
  '19.1': 'Anual',            // plano de educação e relatório
  '19.2': 'Mensal',           // lista de espera em creches
};

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

// Extrai o prefixo numérico do nome do critério (ex: "11.5. Divulga..." → "11.5")
function extrairNumero(nome) {
  const m = String(nome).match(/^(\d{1,2}\.\d{1,2})/);
  return m ? m[1] : null;
}

async function main() {
  console.log('🔑 Login...');
  const lr = await request('POST', '/api/auth/login', { username: USER, password: PASS });
  if (lr.status !== 200 || !lr.body.token) throw new Error(`Login falhou: ${JSON.stringify(lr.body)}`);
  const token = lr.body.token;
  console.log('✅ OK\n');

  const cr = await request('GET', '/api/criterios', null, token);
  const criterios = cr.body.items ?? cr.body ?? [];
  console.log(`${criterios.length} critérios encontrados\n`);

  let atualizados = 0, semMapa = 0, erros = 0;

  for (const c of criterios) {
    const num = extrairNumero(c.Nome || c.nome || '');
    if (!num) { semMapa++; continue; }

    const novaPeriodicidade = PERIODICIDADES[num];
    if (!novaPeriodicidade) {
      console.warn(`⚠️  ${num} — sem mapeamento definido`);
      semMapa++;
      continue;
    }

    const periodicidadeAtual = c.Periodicidade || c.periodicidade || '';
    if (periodicidadeAtual === novaPeriodicidade) {
      console.log(`⏭  ${num} — já é ${novaPeriodicidade}`);
      continue;
    }

    const id = c.Id || c.id;
    const res = await request('PUT', `/api/criterios/${id}`, {
      Nome:          c.Nome        || c.nome,
      Status:        c.Status      || c.status,
      Periodicidade: novaPeriodicidade,
      SecretariaId:  c.SecretariaId  || c.secretariaId,
      Responsavel:   c.Responsavel   || c.responsavel || '',
      Descricao:     c.Descricao     || c.descricao   || '',
    }, token);

    if (res.status === 200 || res.status === 204) {
      console.log(`✅ ${num} — ${periodicidadeAtual || '(vazio)'} → ${novaPeriodicidade}`);
      atualizados++;
    } else {
      console.error(`❌ ${num} — erro ${res.status}: ${JSON.stringify(res.body)}`);
      erros++;
    }
  }

  console.log('\n========================================');
  console.log(`✅ Atualizados: ${atualizados}`);
  console.log(`⏭  Já corretos: ${criterios.length - atualizados - semMapa - erros}`);
  console.log(`⚠️  Sem mapeamento: ${semMapa}`);
  console.log(`❌ Erros: ${erros}`);
  console.log('========================================');
}

main().catch((e) => { console.error('Erro fatal:', e.message); process.exit(1); });
