/**
 * Seed script: importa critérios PNTP 2025 via API REST
 * 
 * Uso:
 *   node api/scripts/seed-via-api.js <url_base> <username> <password>
 * 
 * Exemplo:
 *   node api/scripts/seed-via-api.js https://www.transpjardim.com franciscodesenvolve SuaSenha123
 */

'use strict';

const https = require('https');
const http = require('http');

// Critérios PNTP 2025 - Executivo Municipal (categorias 1-19)
// Gerado a partir da Cartilha PNTP 2025
const CRITERIOS = [
  // 1. Informações Prioritárias
  { nome: "1.1. Possui sítio oficial próprio na internet?", secretaria: "CONTROLADORIA" },
  { nome: "1.2. Possui portal da transparência próprio ou compartilhado na internet?", secretaria: "CONTROLADORIA" },
  { nome: "1.3. O acesso ao portal da transparência está visível na capa do site?", secretaria: "CONTROLADORIA" },
  { nome: "1.4. O site e o portal de transparência contêm ferramenta de pesquisa de conteúdo que permita o acesso à informação?", secretaria: "CONTROLADORIA" },

  // 2. Informações Institucionais
  { nome: "2.1. Divulga a sua estrutura organizacional?", secretaria: "SEMAD" },
  { nome: "2.2. Divulga competências e/ou atribuições?", secretaria: "SEMAD" },
  { nome: "2.3. Identifica o nome dos atuais responsáveis pela gestão do Poder/Órgão?", secretaria: "SEMAD" },
  { nome: "2.4. Divulga os endereços e telefones atuais do Poder ou órgão e e-mails institucionais?", secretaria: "SEMAD" },
  { nome: "2.5. Divulga o horário de atendimento?", secretaria: "SEMAD" },
  { nome: "2.6. Divulga os atos normativos próprios?", secretaria: "SEMAD" },
  { nome: "2.7. Divulga as perguntas e respostas mais frequentes relacionadas às atividades desenvolvidas pelo Poder/Órgão?", secretaria: "SEMAD" },
  { nome: "2.8. Participa em redes sociais e apresenta, no seu sítio institucional, link de acesso ao seu perfil?", secretaria: "SEMAD" },
  { nome: "2.9. Inclui botão do Radar da Transparência Pública no site institucional ou portal de transparência?", secretaria: "SEMAD" },

  // 3. Receita
  { nome: "3.1. Divulga as receitas do Poder ou órgão, evidenciando sua previsão e realização?", secretaria: "CONTROLADORIA" },
  { nome: "3.2. Divulga a classificação orçamentária por natureza da receita (categoria econômica, origem, espécie)?", secretaria: "CONTROLADORIA" },
  { nome: "3.3. Divulga a lista dos inscritos em dívida ativa, contendo, no mínimo, dados referentes ao nome do inscrito e o valor total da dívida?", secretaria: "CONTROLADORIA" },

  // 4. Despesa
  { nome: "4.1. Divulga o total das despesas empenhadas, liquidadas e pagas?", secretaria: "CONTROLADORIA" },
  { nome: "4.2. Divulga as despesas por classificação orçamentária?", secretaria: "CONTROLADORIA" },
  { nome: "4.3. Possibilita a consulta de empenhos com os detalhes do beneficiário do pagamento ou credor, o bem fornecido ou serviço prestado e a identificação do procedimento licitatório?", secretaria: "CONTROLADORIA" },
  { nome: "4.4. Publica relação das despesas com aquisições de bens efetuadas pela instituição contendo: identificação do bem, preço unitário, quantidade, nome do fornecedor e valor total?", secretaria: "CONTROLADORIA" },
  { nome: "4.5. Publica informações sobre despesas de patrocínio?", secretaria: "CONTROLADORIA" },
  { nome: "4.6. Publica informações detalhadas sobre a execução dos contratos de publicidade, com nomes dos fornecedores de serviços especializados e veículos e valores pagos?", secretaria: "CONTROLADORIA" },

  // 5. Convênios
  { nome: "5.1. Identifica as transferências recebidas a partir da celebração de convênios/acordos com indicação do valor total previsto, do valor recebido, do objeto e da origem?", secretaria: "CONTROLADORIA" },
  { nome: "5.2. Identifica as transferências realizadas a partir da celebração de convênios/acordos/ajustes, com indicação do beneficiário, do objeto, do valor total previsto para repasse e do valor concedido?", secretaria: "CONTROLADORIA" },
  { nome: "5.3. Identifica os acordos firmados que não envolvam transferência de recursos financeiros, identificando as partes, o objeto e as obrigações ajustadas?", secretaria: "CONTROLADORIA" },

  // 6. Recursos Humanos
  { nome: "6.1. Divulga a relação nominal dos servidores/autoridades/membros, seus cargos/funções, as respectivas lotações, as suas datas de admissão/exoneração/inativação e a carga horária?", secretaria: "SEMAD" },
  { nome: "6.2. Identifica a remuneração nominal de cada servidor/autoridade/Membro e a tabela com o padrão remuneratório dos cargos e funções?", secretaria: "SEMAD" },
  { nome: "6.3. Divulga a lista de seus estagiários?", secretaria: "SEMAD" },
  { nome: "6.4. Publica lista dos terceirizados que prestam serviços para o Poder ou órgão/entidades, contendo: nome completo, função ou atividade exercida e nome da empresa empregadora?", secretaria: "SEMAD" },
  { nome: "6.5. Divulga a íntegra dos editais de concursos e seleções públicas realizados pelo Poder ou órgão para provimento de cargos e empregos públicos?", secretaria: "SEMAD" },
  { nome: "6.6. Divulga informações sobre os demais atos dos concursos públicos e processos seletivos do Poder ou órgão, contendo no mínimo a lista de aprovados com as classificações e as nomeações?", secretaria: "SEMAD" },

  // 7. Diárias e Passagens
  { nome: "7.1. Divulga o nome e o cargo/função do beneficiário, além do valor total recebido, número de diárias usufruídas por afastamento, período de afastamento, motivo do afastamento e local de destino?", secretaria: "SEMAD" },
  { nome: "7.2. Divulga tabela ou relação que explicite os valores das diárias dentro do Estado, fora do Estado e fora do país, conforme legislação local?", secretaria: "SEMAD" },

  // 8. Licitações
  { nome: "8.1. Divulga a relação das licitações em ordem sequencial, informando o número e modalidade licitatória, o objeto, a data, o valor estimado/homologado e a situação?", secretaria: "CONTROLADORIA" },
  { nome: "8.2. Divulga a íntegra dos editais de licitação?", secretaria: "CONTROLADORIA" },
  { nome: "8.3. Divulga a íntegra dos demais documentos das fases interna e externa das licitações?", secretaria: "CONTROLADORIA" },
  { nome: "8.4. Divulga a íntegra dos principais documentos dos processos de dispensa e inexigibilidade de licitação?", secretaria: "CONTROLADORIA" },
  { nome: "8.5. Divulga a íntegra das Atas de Adesão – SRP?", secretaria: "CONTROLADORIA" },
  { nome: "8.6. Divulga o plano de contratações anual (art. 12, VII, da Lei n. 14.133)?", secretaria: "CONTROLADORIA" },
  { nome: "8.7. Divulga a relação dos licitantes e/ou contratados sancionados administrativamente pelo Poder ou órgão?", secretaria: "CONTROLADORIA" },
  { nome: "8.8. Divulga regulamento interno de licitações e contratos?", secretaria: "CONTROLADORIA" },

  // 9. Contratos
  { nome: "9.1. Divulga a relação dos contratos celebrados em ordem sequencial, com o respectivo resumo, contendo, no mínimo, indicação do contratado(a), do valor, do objeto e da vigência, bem como dos aditivos?", secretaria: "CONTROLADORIA" },
  { nome: "9.2. Divulga o inteiro teor dos contratos e dos respectivos termos aditivos?", secretaria: "CONTROLADORIA" },
  { nome: "9.3. Divulga a relação/lista dos fiscais de cada contrato vigente e encerrado?", secretaria: "CONTROLADORIA" },
  { nome: "9.4. Divulga a ordem cronológica de seus pagamentos, bem como as justificativas que fundamentaram a eventual alteração dessa ordem?", secretaria: "CONTROLADORIA" },

  // 10. Obras
  { nome: "10.1. Divulga informações sobre as obras contendo o objeto, a situação atual, as datas de início e de conclusão da obra, empresa contratada e o percentual concluído?", secretaria: "SEMAD" },
  { nome: "10.2. Divulga os quantitativos, os preços unitários e totais contratados?", secretaria: "SEMAD" },
  { nome: "10.3. Divulga os quantitativos executados e os preços efetivamente pagos?", secretaria: "SEMAD" },
  { nome: "10.4. Divulga relação das obras paralisadas contendo o motivo, o responsável pela inexecução temporária do objeto do contrato e a data prevista para o reinício da sua execução?", secretaria: "SEMAD" },

  // 11. Planejamento e Prestação de Contas
  { nome: "11.1. Publica a Prestação de Contas do Ano Anterior (Balanço Geral)?", secretaria: "CONTROLADORIA" },
  { nome: "11.2. Divulga o Relatório de Gestão ou Atividades?", secretaria: "CONTROLADORIA" },
  { nome: "11.3. Divulga a íntegra da decisão da apreciação ou julgamento das contas pelo Tribunal de Contas?", secretaria: "CONTROLADORIA" },
  { nome: "11.4. Divulga o resultado do julgamento das Contas do Chefe do Poder Executivo pelo Poder Legislativo?", secretaria: "CONTROLADORIA" },
  { nome: "11.5. Divulga o Relatório de Gestão Fiscal (RGF)?", secretaria: "CONTROLADORIA" },
  { nome: "11.6. Divulga o Relatório Resumido da Execução Orçamentária (RREO)?", secretaria: "CONTROLADORIA" },
  { nome: "11.7. Divulga o plano estratégico institucional?", secretaria: "CONTROLADORIA" },
  { nome: "11.8. Divulga a Lei do Plano Plurianual (PPA) e seus anexos?", secretaria: "CONTROLADORIA" },
  { nome: "11.9. Divulga a Lei de Diretrizes Orçamentárias (LDO) e seus anexos?", secretaria: "CONTROLADORIA" },
  { nome: "11.10. Divulga a Lei Orçamentária (LOA) e seus anexos?", secretaria: "CONTROLADORIA" },
  { nome: "11.11. Divulga as demonstrações financeiras trimestrais?", secretaria: "CONTROLADORIA" },
  { nome: "11.12. Divulga as demonstrações financeiras (contábeis) acompanhadas dos pareceres e da auditoria?", secretaria: "CONTROLADORIA" },

  // 12. SIC / Acesso à Informação
  { nome: "12.1. Existe o SIC no site e indica a unidade/setor responsável?", secretaria: "CONTROLADORIA" },
  { nome: "12.2. Indica o endereço físico, o telefone e o e-mail da unidade responsável pelo SIC, além do horário de funcionamento?", secretaria: "CONTROLADORIA" },
  { nome: "12.3. Há possibilidade de envio de pedidos de informação de forma eletrônica (e-SIC)?", secretaria: "CONTROLADORIA" },
  { nome: "12.4. A solicitação por meio de e-SIC é simples, ou seja, sem a exigência de itens de identificação do requerente que dificultem ou impossibilitem o acesso à informação?", secretaria: "CONTROLADORIA" },
  { nome: "12.5. Divulga nesta seção instrumento normativo local que regulamente a Lei nº 12.527/2011 – LAI?", secretaria: "CONTROLADORIA" },
  { nome: "12.6. Divulga, na seção relativa ao e-SIC, os prazos de resposta ao cidadão, incluindo o recursal, e as autoridades competentes para o exame dos pedidos?", secretaria: "CONTROLADORIA" },
  { nome: "12.7. Divulga relatório anual estatístico contendo a quantidade de pedidos de acesso recebidos, atendidos, indeferidos, bem como informações genéricas sobre os solicitantes?", secretaria: "CONTROLADORIA" },
  { nome: "12.8. Divulga lista de documentos classificados em cada grau de sigilo, contendo pelo menos o assunto, a categoria, o dispositivo legal que fundamenta a classificação e o prazo?", secretaria: "CONTROLADORIA" },
  { nome: "12.9. Divulga lista das informações que tenham sido desclassificadas nos últimos 12 meses?", secretaria: "CONTROLADORIA" },

  // 13. Acessibilidade
  { nome: "13.1. O site oficial e o portal de transparência contêm símbolo de acessibilidade em destaque?", secretaria: "SEMAD" },
  { nome: "13.2. O site e o portal de transparência contêm exibição do 'caminho' de páginas percorridas pelo usuário?", secretaria: "SEMAD" },
  { nome: "13.3. O site e o portal de transparência contêm opção de alto contraste?", secretaria: "SEMAD" },
  { nome: "13.4. O site e o portal de transparência contêm ferramenta de redimensionamento de fonte?", secretaria: "SEMAD" },
  { nome: "13.5. Contém mapa do site institucional?", secretaria: "SEMAD" },

  // 14. Ouvidoria
  { nome: "14.1. Há informações sobre o atendimento presencial pela Ouvidoria (indicação de endereço físico e telefone, além do horário de funcionamento)?", secretaria: "SEMAD" },
  { nome: "14.2. Há canal eletrônico de acesso/interação com a ouvidoria?", secretaria: "SEMAD" },
  { nome: "14.3. Divulga Carta de Serviços ao Usuário?", secretaria: "SEMAD" },

  // 15. LGPD e Governo Digital
  { nome: "15.1. Identifica o encarregado/responsável pelo tratamento de dados pessoais e disponibiliza Canal de Comunicação (telefone e/ou e-mail)?", secretaria: "SEMAD" },
  { nome: "15.2. Publica a sua Política de Privacidade e Proteção de Dados?", secretaria: "SEMAD" },
  { nome: "15.3. Possibilita a demanda e o acesso a serviços públicos por meio digital, sem necessidade de solicitação presencial?", secretaria: "SEMAD" },
  { nome: "15.4. Possibilita o acesso automatizado por sistemas externos em dados abertos (estruturados e legíveis por máquina), e a página contém as regras de utilização?", secretaria: "SEMAD" },
  { nome: "15.5. Regulamenta a Lei Federal nº 14.129/2021 (Governo Digital) e divulga a normativa em seu portal?", secretaria: "SEMAD" },
  { nome: "15.6. Realiza e divulga resultados de pesquisas de satisfação?", secretaria: "SEMAD" },

  // 16. Renúncias de Receita
  { nome: "16.1. Divulga as desonerações tributárias concedidas e a fundamentação legal individualizada?", secretaria: "CONTROLADORIA" },
  { nome: "16.2. Divulga informações sobre as renúncias de receitas, indicando o tipo ou espécie de benefício ou incentivo fiscal, a previsão do montante a ser renunciado e o valor renunciado?", secretaria: "CONTROLADORIA" },
  { nome: "16.3. Identifica os beneficiários das desonerações tributárias (benefícios ou incentivos fiscais)?", secretaria: "CONTROLADORIA" },
  { nome: "16.4. Divulga informações sobre projetos de incentivo à cultura (incluindo esportivos), identificando os projetos aprovados, o respectivo beneficiário e o valor aprovado?", secretaria: "CONTROLADORIA" },

  // 17. Emendas Parlamentares
  { nome: "17.1. Identifica as emendas parlamentares recebidas, com origem, forma de repasse, tipo, número, autoria, valor previsto e realizado, objeto e função de governo?", secretaria: "CONTROLADORIA" },
  { nome: "17.2. Demonstra a execução orçamentária e financeira oriunda das 'emendas pix'?", secretaria: "CONTROLADORIA" },

  // 18. Saúde
  { nome: "18.1. Divulga o plano de saúde, a programação anual e o relatório de gestão?", secretaria: "SESAU" },
  { nome: "18.2. Divulga informações relacionadas aos serviços de saúde, indicando os horários, os profissionais prestadores de serviços, as especialidades e local?", secretaria: "SESAU" },
  { nome: "18.3. Divulga a lista de espera de regulação para acesso às consultas, exames e serviços médicos?", secretaria: "SESAU" },
  { nome: "18.4. Divulga lista dos medicamentos a serem fornecidos pelo SUS e informações de como obter medicamentos, incluindo os de alto custo?", secretaria: "SESAU" },
  { nome: "18.5. Divulga os estoques de medicamentos das farmácias públicas?", secretaria: "SESAU" },

  // 19. Educação
  { nome: "19.1. Divulga o plano de educação e o respectivo relatório de resultados?", secretaria: "SEDUC" },
  { nome: "19.2. Divulga a lista de espera em creches públicas e os critérios de priorização de acesso a elas?", secretaria: "SEDUC" },
];

const BASE_URL = process.argv[2] || 'https://www.transpjardim.com';
const USERNAME = process.argv[3] || '';
const PASSWORD = process.argv[4] || '';

if (!USERNAME || !PASSWORD) {
  console.error('Uso: node seed-via-api.js <url_base> <username> <password>');
  console.error('Exemplo: node api/scripts/seed-via-api.js https://www.transpjardim.com franciscodesenvolve SuaSenha123');
  process.exit(1);
}

function request(method, url, body, token) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const lib = parsed.protocol === 'https:' ? https : http;
    const bodyStr = body ? JSON.stringify(body) : null;
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'X-Auth-Token': token } : {}),
      ...(bodyStr ? { 'Content-Length': Buffer.byteLength(bodyStr) } : {}),
    };

    const req = lib.request(
      { hostname: parsed.hostname, port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80), path: parsed.pathname, method, headers },
      (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          resolve({ status: res.statusCode, headers: res.headers, body: data });
        });
      }
    );
    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

async function main() {
  // 1. Login
  console.log(`Autenticando em ${BASE_URL}...`);
  const loginRes = await request('POST', `${BASE_URL}/api/auth/login`, { username: USERNAME, password: PASSWORD });
  
  if (loginRes.status !== 200) {
    console.error(`❌ Login falhou (${loginRes.status}):`, loginRes.body.slice(0, 200));
    process.exit(1);
  }

  const loginData = JSON.parse(loginRes.body);
  const token = loginData.token;
  if (!token) {
    console.error('❌ Token não retornado pelo servidor. Resposta:', loginRes.body.slice(0, 200));
    process.exit(1);
  }
  console.log('✅ Login realizado com sucesso');

  // 2. Busca secretarias para mapear sigla -> id
  const secRes = await request('GET', `${BASE_URL}/api/secretarias`, null, token);
  if (secRes.status !== 200) {
    console.error(`❌ Erro ao buscar secretarias (${secRes.status})`);
    process.exit(1);
  }
  
  const { items: secretarias } = JSON.parse(secRes.body);
  const siglaToId = {};
  for (const s of secretarias) {
    siglaToId[s.sigla] = s.id;
  }
  console.log(`Secretarias encontradas: ${secretarias.map(s => s.sigla).join(', ')}`);

  // 3. Verifica critérios existentes
  const criteriosRes = await request('GET', `${BASE_URL}/api/criterios`, null, token);
  const { items: existentes } = JSON.parse(criteriosRes.body);
  console.log(`Critérios já existentes: ${existentes.length}`);
  
  if (existentes.length > 0) {
    console.log('⚠️  Já existem critérios. O seed adiciona novos sem deletar os existentes.');
    // Verifica se já há critérios PNTP para evitar duplicatas
    const nomesExistentes = new Set(existentes.map(c => c.nome));
    const jaSeedados = CRITERIOS.filter(c => nomesExistentes.has(c.nome));
    if (jaSeedados.length > 0) {
      console.log(`⚠️  ${jaSeedados.length} critérios PNTP já foram importados. Pulando duplicatas...`);
    }
  }

  // 4. Insere critérios
  let success = 0;
  let skipped = 0;
  let errors = 0;
  const nomesExistentes = new Set(existentes.map(c => c.nome));

  for (let i = 0; i < CRITERIOS.length; i++) {
    const c = CRITERIOS[i];
    
    if (nomesExistentes.has(c.nome)) {
      skipped++;
      continue;
    }

    const secretariaId = siglaToId[c.secretaria] || null;
    const payload = {
      nome: c.nome,
      status: 'Pendente',
      periodicidade: 'Anual',
      secretariaId,
      responsavel: null,
      descricao: `Critério PNTP 2025 — ${c.nome.split('.')[0]}.${c.nome.split('.')[1]?.split(' ')[0] || ''}`,
    };

    const res = await request('POST', `${BASE_URL}/api/criterios`, payload, token);
    
    if (res.status === 201) {
      success++;
      if ((i + 1) % 10 === 0 || i === CRITERIOS.length - 1) {
        console.log(`  [${i + 1}/${CRITERIOS.length}] ${success} inseridos...`);
      }
    } else {
      errors++;
      console.error(`  ❌ Erro no critério ${c.nome.slice(0, 60)}: HTTP ${res.status} - ${res.body.slice(0, 100)}`);
    }
    
    // Pequena pausa para não sobrecarregar
    await new Promise(r => setTimeout(r, 100));
  }

  console.log(`\n✅ Seed concluído!`);
  console.log(`   Inseridos: ${success}`);
  console.log(`   Pulados (já existiam): ${skipped}`);
  console.log(`   Erros: ${errors}`);
  console.log(`\nAcesse ${BASE_URL}/criterios para verificar os critérios importados.`);
}

main().catch(err => {
  console.error('Erro inesperado:', err);
  process.exit(1);
});
