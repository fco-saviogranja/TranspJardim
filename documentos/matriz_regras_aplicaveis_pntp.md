# Matriz de Regras Aplicáveis — Cartilha PNTP 2025

Base: Cartilha PNTP 2025 + relatório de auditoria (123).
Objetivo: transformar exigências em regras operacionais do sistema de Critérios/Alertas.

## 1) Regras transversais (motor de conformidade)

| Regra | Como aplicar no sistema | Trigger de alerta | SLA/Prazo |
|---|---|---|---|
| Classificação de criticidade | Marcar critério como OBRIGATÓRIA ou RECOMENDADA | OBRIGATÓRIA não conforme => prioridade alta | Imediato |
| Atualidade de dados | Validar DataUltimaAtualizacao por critério | <= 15 dias para vencer => urgente; vencido => vencido | Conforme periodicidade |
| Periodicidade oficial por critério | Usar mapeamento PNTP (Mensal/Bimestral/Quadrimestral/Semestral/Anual) | Divergência de periodicidade ou atraso gera alerta | Conforme tabela da seção 3 |
| Disponibilidade mínima | Exigir presença de conteúdo obrigatório (sem “nenhum registro” quando exigido) | Falta de dado obrigatório => vencido | Imediato |
| Série histórica | Exigir ano-base mínimo quando aplicável (ex.: diárias 2024) | Ano mínimo ausente => vencido | Na auditoria/ciclo vigente |
| Responsabilização por secretaria | Critério vinculado a uma secretaria e responsável | Falta de responsável/secretaria => pendência crítica | Imediato |
| Fluxo de tratamento do alerta | Situações: pendente, em_producao, ok (com observação) | Alteração de status e trilha de auditoria | Durante tratamento |
| Escopo por usuário | Usuário padrão vê apenas critérios/alertas da própria secretaria | Acesso fora do escopo bloqueado | Contínuo |

## 2) Regras aplicáveis imediatas (32 não conformidades do relatório 123)

| Critério | Natureza | Regra aplicável | Campo/checagem no sistema | Trigger recomendado |
|---|---|---|---|---|
| 2.1 | OBRIGATÓRIA | Estrutura organizacional publicada e completa | evidência de secretarias/setores no portal | Falta de setores mínimos => vencido |
| 5.1 | OBRIGATÓRIA | Convênios recebidos atualizados | DataUltimaAtualizacao + metadados obrigatórios | > 30 dias sem atualização |
| 5.2 | OBRIGATÓRIA | Convênios transferidos atualizados | DataUltimaAtualizacao + beneficiário/objeto/valores | > 30 dias sem atualização |
| 5.3 | OBRIGATÓRIA | Acordos sem transferência com dados completos | partes/objeto/obrigações preenchidos | ausência de registros exigidos |
| 6.1 | OBRIGATÓRIA | Relação nominal de servidores atualizada | atualização de cadastro funcional | > 30 dias sem atualização |
| 6.2 | OBRIGATÓRIA | Remuneração nominal + tabela remuneratória | folha/tabela remuneratória publicada | > 30 dias sem atualização |
| 6.3 | RECOMENDADA | Lista de estagiários atualizada | cadastro de estagiários | > 180 dias sem atualização |
| 6.4 | RECOMENDADA | Lista de terceirizados disponível | cadastro de terceirizados | disponibilidade ausente |
| 7.1 | OBRIGATÓRIA | Diárias com série histórica mínima | dados do exercício anterior disponível | série histórica ausente |
| 8.5 | OBRIGATÓRIA | Atas de adesão SRP atualizadas | atas + data publicação | > 30 dias sem atualização |
| 8.7 | RECOMENDADA | Sancionados administrativamente publicados | lista de inidôneos/sancionados | disponibilidade ausente |
| 9.1 | OBRIGATÓRIA | Relação de contratos atualizada | contratos com resumo e vigência | > 30 dias sem atualização |
| 9.2 | OBRIGATÓRIA | Inteiro teor de contratos/aditivos | anexos/documentos completos | > 30 dias sem atualização |
| 9.3 | OBRIGATÓRIA | Fiscal de contrato identificado | campo FiscalContrato obrigatório | fiscal não informado |
| 10.1 | RECOMENDADA | Obras com status e percentual atualizados | obra/etapa/percentual/data | > 30 dias sem atualização |
| 10.4 | OBRIGATÓRIA | Obras paralisadas com motivo e previsão | motivo + responsável + previsão reinício | ausência de dados obrigatórios |
| 11.2 | OBRIGATÓRIA | Relatório de gestão/atividades publicado | documento anual vigente | não publicado no ciclo |
| 11.3 | OBRIGATÓRIA | Decisão do Tribunal de Contas publicada | documento de julgamento | não publicado no ciclo |
| 11.4 | OBRIGATÓRIA | Julgamento do Legislativo publicado | documento de resultado | não publicado no ciclo |
| 11.7 | RECOMENDADA | Plano estratégico institucional publicado | documento vigente | não publicado no ciclo |
| 12.8 | OBRIGATÓRIA | Lista de documentos sigilosos atualizada | lista com base legal e prazo | ausência/desatualização |
| 12.9 | OBRIGATÓRIA | Lista de desclassificados (12 meses) | registros últimos 12 meses | ausência de janela anual |
| 15.5 | RECOMENDADA | Normativa de Governo Digital publicada | regulamento + link público | não publicado |
| 16.2 | RECOMENDADA | Renúncia fiscal prevista/realizada divulgada | valores por espécie de benefício | não publicado no ciclo |
| 16.3 | RECOMENDADA | Beneficiários de desonerações identificados | relação nominal/objetiva | não publicado no ciclo |
| 16.4 | RECOMENDADA | Incentivos culturais/esportivos divulgados | projeto/beneficiário/valor | não publicado no ciclo |
| 17.1 | RECOMENDADA | Emendas recebidas identificadas | origem/tipo/número/autoria/valor | ausência/desatualização |
| 17.2 | RECOMENDADA | Execução de emendas pix demonstrada | execução orçamentária/financeira | ausência/desatualização |
| 18.2 | OBRIGATÓRIA | Serviços de saúde com horários/profissionais | unidades/profissionais/especialidades | ausência/desatualização |
| 19.1 | RECOMENDADA | Plano de educação + relatório de resultados | documentos do exercício | não publicado no ciclo |
| 18.4 | RECOMENDADA | Lista de medicamentos e forma de obtenção | lista e instruções públicas | ausência/desatualização |
| 18.5 | OBRIGATÓRIA | Estoque de medicamentos publicado | estoque por unidade/data | ausência/desatualização |

## 3) Tabela de periodicidade oficial (para cálculo automático de vencimento)

| Prefixo do critério | Periodicidade |
|---|---|
| 1.1 a 1.4 | Anual |
| 2.1 | Mensal |
| 2.2, 2.4 a 2.9 | Anual |
| 2.3 | Mensal |
| 3.1, 3.2 | Mensal |
| 3.3 | Anual |
| 4.1 a 4.4 | Mensal |
| 4.5, 4.6 | Anual |
| 5.1, 5.2 | Mensal |
| 5.3 | Anual |
| 6.1, 6.2, 6.4 | Mensal |
| 6.3 | Semestral |
| 6.5, 6.6 | Anual |
| 7.1 | Mensal |
| 7.2 | Anual |
| 8.1 a 8.5, 8.7 | Mensal |
| 8.6, 8.8 | Anual |
| 9.1 a 9.4 | Mensal |
| 10.1 a 10.4 | Mensal |
| 11.1, 11.2, 11.3, 11.4, 11.7, 11.8, 11.9, 11.10, 11.12 | Anual |
| 11.5 | Quadrimestral |
| 11.6 | Bimestral |
| 11.11 | Trimestral |
| 12.1 a 12.7 | Anual |
| 12.8 | Mensal |
| 12.9 | Anual |
| 13.1 a 13.5 | Anual |
| 14.1 a 14.3 | Anual |
| 15.1 a 15.5 | Anual |
| 15.6 | Semestral |
| 16.1 a 16.4 | Anual |
| 17.1, 17.2 | Mensal |
| 18.1 | Anual |
| 18.2, 18.3, 18.4, 18.5 | Mensal |
| 19.1 | Anual |
| 19.2 | Mensal |

## 4) Ordem prática de implantação (rápida)

1. Aplicar periodicidade oficial em todos os critérios.
2. Marcar criticidade (OBRIGATÓRIA/RECOMENDADA).
3. Ligar gatilho de alerta por atraso e por ausência de disponibilidade.
4. Priorizar saneamento dos 32 critérios já apontados na auditoria.
5. Exigir responsável e secretaria para 100% dos critérios ativos.
6. Fechar alerta apenas com evidência (link/documento/observação).

## 5) Fontes do repositório

- documentos/criterios_extraidos.txt
- documentos/123_texto.txt
- api/scripts/update-periodicidades.js
- api/scripts/update-criterios-123.js
