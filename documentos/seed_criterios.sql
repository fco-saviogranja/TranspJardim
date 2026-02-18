-- Script de seed: Critérios PNTP 2025
-- Gerado automaticamente a partir da Cartilha PNTP 2025
-- Secretarias referenciadas: CONTROLADORIA, SEMAD, SEDUC, SESAU

-- Inserir critérios vinculando às secretarias existentes
BEGIN TRANSACTION;

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'1.1. Possui sítio oficial próprio na internet?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 1.1'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'1.2. Possui portal da transparência próprio ou compartilhado na internet?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 1.2'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'1.3. O acesso ao portal transparência está visível na capa do site?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 1.3'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'1.4. O site e o portal de transparência contêm ferramenta de pesquisa de conteúdo que permita o acesso à informação?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'2. Informações Institucionais 48'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'2.1. Divulga a sua estrutura organizacional?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 2.1'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'2.2. Divulga competências e/ou atribuições?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 2.2'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'2.3. Identifica o nome dos atuais responsáveis pela gestão do Poder/Órgão?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 2.3'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'2.4. Divulga os endereços e telefones atuais do Poder ou órgão e e-mails institucionais?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 2.4'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'2.5. Divulga o horário de atendimento?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 2.5'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'2.6. Divulga os atos normativos próprios?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 2.6'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'2.7. Divulga as perguntas e respostas mais frequentes relacionadas às atividades desenvolvidas pelo Poder/Órgão?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 2.7'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'2.8. Participa em redes sociais e apresenta, no seu sítio institucional, link de acesso ao seu perfil?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 2.8'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'2.9. Inclui botão do Radar da Transparência Pública no site institucional ou portal transparência?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'3. Receita 57'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'3.1. Divulga as receitas do Poder ou órgão, evidenciando sua previsão e realização?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 3.1'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'3.2. Divulga a classificação orçamentária por natureza da receita (categoria econômica, origem, espécie)?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 3.2'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'3.3. Divulga a lista dos inscritos em dívida ativa, contendo, no mínimo, dados referentes ao nome do inscrito e o valor total da dívida?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'4. Despesa 65'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'4.1. Divulga o total das despesas empenhadas, liquidadas e pagas?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 4.1'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'4.2. Divulga as despesas por classificação orçamentária?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 4.2'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'4.3. Possibilita a consulta de empenhos com os detalhes do beneficiário do pagamento ou credor, o bem fornecido ou serviço prestado e a identificação do procedimento licitatório originário da des',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 4.3'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'4.4. Publica relação das despesas com aquisições de bens efetuadas pela instituição contendo: identificação do bem, preço unitário, quantidade, nome do fornecedor e valor total de cada aquisição?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 4.4'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'4.5. Publica informações sobre despesas de patrocínio?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 4.5'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'4.6. Publica informações detalhadas sobre a execução dos contratos de publicidade, com nomes dos fornecedores de serviços especializados e veículos, bem como informações sobre os totais de valore',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'5. Convênios e Transferências 73'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'5.1. Identifica as transferências recebidas a partir da celebração de convênios/acordos com indicação, no mínimo, do valor total previsto dos recursos envolvidos, do valor recebido, do objeto e d',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 5.1'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'5.2. Identifica as transferências realizadas a partir da celebração de convênios/acordos/ajustes, com indicação, no mínimo, do beneficiário, do objeto, do valor total previsto para repasse e do v',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 5.2'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'5.3. Identifica os acordos firmados que não envolvam transferência de recursos financeiros, identificando as partes, o objeto e as obrigações ajustadas?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'6. Recursos Humanos 80'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'6.1. Divulga a relação nominal dos servidores/autoridades/membros, seus cargos/funções, as respectivas lotações, as suas datas de admissão/exoneração/inativação e a carga horária do cargo/função ',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 6.1'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'6.2. Identifica a remuneração nominal de cada servidor/autoridade/Membro e a tabela com o padrão remuneratório dos cargos e funções?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 6.2'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'6.3. Divulga a lista de seus estagiários?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 6.3'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'6.4. Publica lista dos terceirizados que prestam serviços para o Poder ou órgão/entidades, contendo, em relação a cada um deles: nome completo, função ou atividade exercida e nome da empresa empr',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 6.4'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'6.5. Divulga a íntegra dos editais de concursos e seleções públicas realizados pelo Poder ou órgão para provimento de cargos e empregos públicos?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 6.5'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'6.6. Divulga informações sobre os demais atos dos concursos públicos e processos seletivos do Poder ou órgão, contendo no mínimo a lista de aprovados com as classificações e as nomeações?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'7. Diárias 94'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'7.1. Divulga o nome e o cargo/função do beneficiário, além do valor total recebido, número de diárias usufruídas por afastamento, período de afastamento, motivo do afastamento e local de destino?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 7.1'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'7.2. Divulga tabela ou relação que explicite os valores das diárias dentro do Estado, fora do Estado e fora do país, conforme legislação local?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'8. Licitações 97'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'8.1. Divulga a relação das licitações em ordem sequencial, informando o número e modalidade licitatória, o objeto, a data, o valor estimado/homologado e a situação?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 8.1'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'8.2. Divulga a íntegra dos editais de licitação?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 8.2'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'8.3. Divulga a íntegra dos demais documentos das fases interna e externa das licitações?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 8.3'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'8.4. Divulga a íntegra dos principais documentos dos processos de dispensa e inexigibilidade de licitação?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 8.4'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'8.5. Divulga a íntegra das Atas de Adesão – SRP?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 8.5'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'8.6. Divulga o plano de contratações anual (art. 12, VII, da Lei n. 14.133)?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 8.6'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'8.7. Divulga a relação dos licitantes e/ou contratados sancionados administrativamente pelo Poder ou órgão?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 8.7'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'8.8. Divulga regulamento interno de licitações e contratos?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'9. Contratos 109'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'9.1. Divulga a relação dos contratos celebrados em ordem sequencial, com o seu respectivo resumo, contendo, no mínimo, indicação do contratado(a), do valor, do objeto e da vigência, bem como dos ',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 9.1'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'9.2. Divulga o inteiro teor dos contratos e dos respectivos termos aditivos?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 9.2'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'9.3. Divulga a relação/lista dos fiscais de cada contrato vigente e encerrado?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 9.3'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'9.4. Divulga a ordem cronológica de seus pagamentos, bem como as justificativas que fundamentaram a eventual alteração dessa ordem?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'10. Obras 115'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'10.1. Divulga informações sobre as obras contendo o objeto, a situação atual, as datas de início e de conclusão da obra, empresa contratada e o percentual concluído?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 10.1'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'10.2. Divulga os quantitativos, os preços unitários e totais contratados?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 10.2'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'10.3. Divulga os quantitativos executados e os preços efetivamente pagos?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 10.3'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'10.4. Divulga relação das obras paralisadas contendo o motivo, o responsável pela inexecução temporária do objeto do contrato e a data prevista para o reinício da sua execução?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'11. Planejamento e Prestação de contas 121'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'11.1. Publica a Prestação de Contas do Ano Anterior (Balanço Geral)?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 11.1'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'11.2. Divulga o Relatório de Gestão ou Atividades?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 11.2'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'11.3. Divulga a íntegra da decisão da apreciação ou julgamento das contas pelo Tribunal de Contas?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 11.3'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'11.4. Divulga o resultado do julgamento das Contas do Chefe do Poder Executivo pelo Poder Legislativo?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 11.4'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'11.5. Divulga o Relatório de Gestão Fiscal (RGF)?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 11.5'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'11.6. Divulga o Relatório Resumido da Execução Orçamentária (RREO)?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 11.6'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'11.7. Divulga o plano estratégico institucional?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 11.7'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'11.8. Divulga a Lei do Plano Plurianual (PPA) e seus anexos?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 11.8'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'11.9. Divulga a Lei de Diretrizes Orçamentárias (LDO) e seus anexos?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 11.9'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'11.10. Divulga a Lei Orçamentária (LOA) e seus anexos?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 11.10'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'11.11. Divulga o Orçamento do Consórcio Público onde conste a estimativa da receita e a fixação da Despesa para 2025?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 11.11'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'11.12. Divulga as demonstrações financeiras trimestrais?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 11.12'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'11.13. Divulga as demonstrações financeiras (contábeis) acompanhadas dos pareceres do Conselho Fiscal e da auditoria independente?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 11.13'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'11.14. Pública o Orçamento de Investimentos da instituição que compõe a Lei Orçamentária Anual?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 11.14'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'11.15. Divulga as demonstrações contábeis auditadas em formato eletrônico editável?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 11.15'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'11.16. Divulga o relatório anual elaborado pelo Comitê de Auditoria Estatutário com informações sobre as atividades e os resultados e suas conclusões e recomendações?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 11.16'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'11.17. Divulga as atas das reuniões do Comitê de Auditoria Estatutário?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 11.17'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'11.18. Divulga as atas das reuniões do Comitê de Elegibilidade Estatutário ou Comitê de Pessoas, Elegibilidade, Sucessão e Remuneração a partir de 2022, na forma de sumário dos fatos ocorridos, i',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 11.18'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'11.19. Divulga anualmente relatório integrado ou de sustentabilidade?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'12. Serviço de Informação ao Cidadão - SIC 136'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'12.1. Existe o SIC no site e indica a unidade/setor responsável?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 12.1'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'12.2. Indica o endereço físico, o telefone e o e-mail da unidade responsável pelo SIC, além do horário de funcionamento?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 12.2'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'12.3. Há possibilidade de envio de pedidos de informação de forma eletrônica (e -SIC)?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 12.3'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'12.4. A solicitação por meio de eSic é simples, ou seja, sem a exigência de itens de identificação do requerente que dificultem ou impossibilitem o acesso à informação, tais como: envio de docume',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 12.4'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'12.5. Divulga nesta seção, instrumento normativo local que regulamente a Lei nº 12.527/2011 – LAI?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 12.5'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'12.6. Divulga, na seção relativa ao e-SIC, os prazos de resposta ao cidadão, incluindo o recursal, e as autoridades competentes para o exame dos pedidos, além do procedimento referente à realizaç',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 12.6'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'12.7. Divulga relatório anual estatístico contendo a quantidade de pedidos de acesso recebidos, atendidos, indeferidos, bem como informações genéricas sobre os solicitantes?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 12.7'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'12.8. Divulga lista de documentos classificados em cada grau de sigilo, contendo pelo menos o assunto sobre o qual versa a informação, a categoria na qual ela se encontra, o dispositivo legal que',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 12.8'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'12.9. Divulga lista das informações que tenham sido desclassificadas nos últimos',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'(doze) meses? 151 13. Acessibilidade 152'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'13.1. O site oficial e o portal de transparência contêm símbolo de acessibilidade em destaque?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 13.1'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'13.2. O site e o portal de transparência contêm exibição do “caminho” de páginas percorridas pelo usuário?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 13.2'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'13.3. O site e o portal de transparência contêm opção de alto contraste?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 13.3'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'13.4. O site e o portal de transparência contêm ferramenta de redimensionamento de texto?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 13.4'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'13.5. Contém mapa do site institucional?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'14. Ouvidorias 157'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'14.1. Há informações sobre o atendimento presencial pela Ouvidoria (Indicação de endereço físico e telefone, além do horário de funcionamento)?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'14.2. Há canal eletrônico de acesso/interação com a ouvidoria? 158'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'14.3. Divulga Carta de Serviços ao Usuário?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'15. Lei Geral de Proteção de Dados (LGPD) e Governo Digital 161'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'15.1. Identifica o encarregado/responsável pelo tratamento de dados pessoais e disponibiliza Canal de Comunicação (telefone e/ou e-mail)?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 15.1'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'15.2. Publica a sua Política de Privacidade e Proteção de Dados?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 15.2'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'15.3. Possibilita a demanda e o acesso a serviços públicos por meio digital, sem necessidade de solicitação presencial?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 15.3'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'15.4. Possibilita o acesso automatizado por sistemas externos em dados abertos (estruturados e legíveis por máquina), e a página contém as regras de utilização?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 15.4'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'15.5. Regulamenta a Lei Federal nº 14.129/2021 (Governo Digital) e divulga a normativa em seu portal?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 15.5'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'15.6. Realiza e divulga resultados de pesquisas de satisfação?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'16. Renúncias de Receitas 172'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'16.1. Divulga as desonerações tributárias concedidas e a fundamentação legal individualizada?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 16.1'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'16.2. Divulga informações sobre as renúncias de receitas, indicando o tipo ou espécie de benefício ou incentivo fiscal, a previsão do montante a ser renunciado e o valor renunciado?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 16.2'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'16.3. Identifica os beneficiários das desonerações tributárias (benefícios ou incentivos fiscais)?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 16.3'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'16.4. Divulga informações sobre projetos de incentivo à cultura (incluindo esportivos), identificando os projetos aprovados, o respectivo beneficiário e o valor aprovado?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'17. Emendas Parlamentares 176'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'17.1. Identifica as emendas parlamentares recebidas, contendo informações sobre a origem, a forma de repasse, o tipo de emenda, o número da emenda, a autoria, o valor previsto e realizado, o obje',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 17.1'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'17.2. Demonstra a execução orçamentária e financeira oriunda das “emendas pix”?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'18. Saúde 181'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'18.1. Divulga o plano de saúde, a programação anual e o relatório de gestão?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 18.1'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SESAU';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'18.2. Divulga informações relacionadas aos serviços de saúde, indicando os horários, os profissionais prestadores de serviços, as especialidades e local?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 18.2'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SESAU';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'18.3. Divulga a lista de espera de regulação para acesso às consultas, exames e serviços médicos ?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 18.3'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SESAU';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'18.4. Divulga lista dos medicamentos a serem fornecidos pelo SUS e informações de como obter medicamentos, incluindo os de alto custo?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 18.4'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SESAU';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'18.5. Divulga os estoques de medicamentos das farmácias públicas?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'19. Educação 188'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SESAU';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'19.1. Divulga o plano de educação e o respectivo relatório de resultados?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Critério PNTP 19.1'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEDUC';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'19.2. Divulga a lista de espera em creches públicas e os critérios de priorização de acesso a elas?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'20. Atividades Finalísticas – Poder Legislativo 192'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEDUC';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'1.1. Possui sítio oficial próprio na internet?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'8º, §2º, da Lei nº 12.527/2011 – LAI. Ministério Público, Defensoria, Consórcios Públicos, Estatais Dependentes e Independentes. Os Poderes e órgãos devem manter sítio oficial próprio na internet, contendo informações gerais sobre o Poder ou órgão. Na avaliação deste quesito, não são aceitos sítios compartilhados com outros Poderes ou órgãos. Este critério é prejudicial em relação a todos os demais: a inexistência de sítio oficial próprio impede a avaliação dos outros critérios previstos nesta cartilha. Nesse caso, a avaliação é considerada concluída, porém com o índice transparência 0,00% (nível “inexistente”). Em caso de página fora do ar e em permanecendo a situação após tentativas reiteradas e em dias alternados, o critério deve ser considerado como não atendido.'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'1.2. Possui portal da transparência próprio ou compartilhado na internet?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'8º, §2º, da Lei nº 12.527/2011 – LAI. Ministério Público, Defensoria, Consórcios Públicos, Estatais Dependentes e Independentes. Os Poderes e órgãos devem manter portal da transparência próprio ou compartilhado na internet. Isto é: o sítio eletrônico do Poder ou órgão deve possuir link, atalho ou outra forma de redirecionamento para página ou seção específica que apresenta conteúdo mínimo de informações sobre transparência ativa e passiva (“Portal da Transparência”, "Acesso à Informação", "Transparência" etc.). Na avaliação deste quesito, são aceitos portais da transparência compartilhados com outros Poderes ou órgãos, desde que, na página oficial do avaliado, exista o link de acesso que redirecione o usuário às informações correspondentes.'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'1.3. O acesso ao portal transparência está visível na capa do site?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Ministério Público, Defensoria, Consórcios Públicos, Estatais Dependentes e Independentes. O link, atalho ou outra forma de redirecionamento para página ou seção específica que apresenta conteúdo mínimo de informações sobre transparência ativa e passiva (“Portal da Transparência”, "Acesso à Informação", "Transparência" etc.) deve se encontrar na página inicial do sítio institucional do Poder ou órgão. O link de acesso necessita estar visível e disponível com um clique apenas.'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'1.4. O site e o portal de transparência contêm ferramenta de pesquisa de conteúdo que permita o acesso à informação?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Ministério Público, Defensoria, Consórcios Públicos, Estatais Dependentes e Independentes. Tanto o site oficial quanto o portal de transparência dos Poderes ou órgãos devem conter ferramenta de pesquisa geral que possibilite a busca de informações de maneira ágil. A pesquisa/busca deve sempre apresentar resultados para as palavras-chave mais frequentes informadas como parâmetros da pesquisa, mesmo que estas palavras não pertençam à terminologia oficial da Poder ou órgão. Os seus resultados precisam ser independentes do uso de letras maiúsculas, minúsculas, acentos, plural etc. Se houver erro no resultado da pesquisa ou se o campo não apresentar ocorrências quanto a termos corriqueiros, o item é considerado como não atendido. O quesito será considerado atendido apenas se a ferramenta estive'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'2.1. Divulga a sua estrutura organizacional?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Ministério Público, Defensoria, Consórcios Públicos, Estatais Dependentes e Independentes. No sítio, deve constar a estrutura organizacional do Poder ou órgão, demonstrada de forma textual ou gráfica, que apresente claramente a relação hierárquica entre as suas unidades (organograma), além das seguintes informações mínimas: suas unidades, como, por exemplo, o Gabinete do Chefe do Poder Executivo e as Secretarias. por exemplo, a composição da Mesa Diretora e unidades setoriais. exemplo, a identificação das Varas, Câmaras, Pleno. de suas estruturas, indicando as principais unidades (as administrativas, as de atuação e as de execução). Contas, contendo, por exemplo, a identificação dos serviços de instrução e auditoria, além do registro quanto aos órgãos julgadores. hierárquica dos departamen'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'2.2. Divulga competências e/ou atribuições?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'da Lei 13.460/2017. Ministério Público, Defensoria, Consórcios e Estatais Dependentes e Independentes. O registro das competências pode estar indicado em alguma legislação municipal, cujo acesso seja indicado diretamente no portal de transparência. Ou, ainda, é possível que as competências estejam descritas em página própria: Nota-se que basta a descrição das competências/atribuições de forma sintética para efeitos deste critério. Seja qual for a forma adotada, é fundamental que a informação esteja em local de fácil acesso, geralmente na mesma seção da "estrutura organizacional” e não apenas dentro da parte do portal relativa à “legislação”. Quanto ao conteúdo, devem ser exibidas as seguintes informações maior parte das Secretarias ou unidades administrativas equivalentes; considerando o r'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'2.3. Identifica o nome dos atuais responsáveis pela gestão do Poder/Órgão?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Ministério Público, Defensoria, Consórcios Públicos, Estatais Dependentes e Independentes. Neste item, o que deve estar disponibilizado é a informação referente aos responsáveis pelas unidades representadas no organograma. Muitas vezes, as evidências estarão dentro de menus específicos (por exemplo: menu “Secretarias” ou “Prefeitura”, no caso dos Executivos municipais). Quando avaliado o organograma, é importante analisar se já há a identificação completa dos responsáveis por cada Poder ou órgão, com a indicação dos nomes. Em caso positivo, é considerado como aceito. Por fim, em relação ao conteúdo, exigem-se as seguintes informações Governador, Prefeito, Ministro, Secretários e demais ocupantes de cargos de da Casa Legislativa, bem como dos Senadores, Deputados, Vereadores e ocupantes de '
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'2.4. Divulga os endereços e telefones atuais do Poder ou órgão e e-mails institucionais?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'VI, b, da Lei 13.460/2017. Ministério Público, Defensoria, Consórcios Públicos, Estatais Dependentes e Independentes. Essas informações costumam ser disponibilizadas dentro do portal da transparência por alguns Poderes e órgãos (por exemplo, em seção relativa a “links úteis”) ou fora deles por outros (por exemplo, no rodapé da página inicial do sítio institucional). Todas essas situações são aceitas para fins de atendimento ao critério. Quanto ao conteúdo, exigem-se as seguintes informações mínimas: unidades administrativas localizadas em outras estruturas físicas. Registro do número do telefone e do e-mail da sede do Executivo e das Secretarias ou unidades administrativas equivalentes localizadas em outras estruturas físicas; situa a Casa Legislativa. Registro do número do telefone e do e'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'2.5. Divulga o horário de atendimento?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'VI, b, da Lei 13.460/2017. Ministério Público, Defensoria, Consórcios Públicos, Estatais Dependentes e Independentes. Aqui também as informações costumam ser disponibilizadas tanto dentro como fora do portal da transparência, sendo aceitas ambas as formas. Quanto ao conteúdo: administrativas; Legislativa; das demais unidades judiciárias; Procuradoria Geral e das demais unidades; Defensoria Pública e seus Núcleos; sede do Tribunal de Contas e suas unidades regionais, se houver. como de filiais, subunidades ou outras unidades descentralizadas com atuação administrativa e, quando houver, de unidades descentralizadas. O horário de funcionamento do Poder ou órgão não se confunde com o horário de atendimento do Serviço de Atendimento ao Cidadão ou da'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'2.6. Divulga os atos normativos próprios?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'6°, inciso I; 7º, incisos II, V e VI e 8º da Lei nº 12.527/2011 – LAI. Ministério Público, Defensoria, Consórcios Públicos e Estatais Dependentes e Independentes. Deve constar no site institucional ou no portal da transparência, os atos normativos expedidos diretamente pelo Poder ou Órgão, de acordo com sua competência, como, por exemplo, portarias, resoluções, instruções, decretos (Poder Executivo) etc. Considera-se que as informações estão atualizadas quando as mais recentes datarem de, no máximo, 30 dias da data em que for realizada a Considera-se que existe histórico de informações quando os dados disponibilizados referirem-se, pelo menos, a 3 anos que antecedem ao da Instrumento que permite inserir ou escolher texto, filtrando ou direcionando as opções de dados dentro do conjunto espe'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'2.7. Divulga as perguntas e respostas mais frequentes relacionadas às atividades desenvolvidas pelo Poder/Órgão?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Ministério Público, Consórcios Públicos, Estatais Dependentes e Independentes. No portal, deve existir uma seção específica que apresente perguntas e respostas relacionadas às atividades e aos serviços desenvolvidos pelo Poder ou órgão. A indicação no site pode vir com a terminologia FAQ (Frequently Asked Questions) ou como “Perguntas Frequentes”, podendo estar inserida no portal de transparência ou no site geral do Poder ou órgão. Caso exista o FAQ, porém, sem quaisquer questões frequentes, a resposta ao item deve ser NEGATIVA, conforme ilustrado na imagem a seguir: Caso a seção só tenha perguntas e respostas fixas e básicas do tipo “o que é portal de transparência?” “para que serve?” culminará no não atendimento deste critério.'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'2.8. Participa em redes sociais e apresenta, no seu sítio institucional, link de acesso ao seu perfil?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Ministério Público, Consórcios Públicos e Estatais Dependentes e Independentes. O Poder ou órgão pode possuir conta em redes sociais, como por exemplo: Facebook, WhatsApp (algumas ouvidorias possuem), Instagram, Twitter, TikTok. Nesse caso, é considerado boa prática a divulgação de seus links de acesso na página principal do seu site institucional.'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'2.9. Inclui botão do Radar da Transparência Pública no site institucional ou portal transparência?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Lei nº 12.527/2011 – LAI. Ministério Público, Defensoria, Consórcios Públicos e Estatais Dependentes e Independentes. Recomenda-se que o acesso ao Radar da Transparência Pública tenha seu acesso facilitado por meio dos sites institucionais dos Poderes e órgãos, tendo em vista sua importância como instrumento de disseminação das informações produzidas e/ou custodiadas pelo Poder Público. Assim, para atendimento ao critério, deve ser disponibilizado link com o título “Radar da Transparência Pública” que remeta o usuário ao sistema Radar (https://radardatransparencia.atricon.org.br). Para download do banner do Radar, acessar o hotsite indicado.'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'3.1. Divulga as receitas do Poder ou órgão, evidenciando sua previsão e realização?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'art. 8º, II, do Decreto nº 10.540/20. Ministério Público, Defensoria, Consórcios Públicos e Estatais Dependentes. Devem ser disponibilizadas informações pormenorizadas quanto à receita ou duodécimos do poder/órgão, compreendendo, no mínimo, dados e valores relativos a: Para os Poderes Legislativos, Judiciário, Ministérios Públicos, Tribunais de Contas, Defensorias, Consórcios Públicos e Estatais, considerar o valor dos repasses previstos e recebidos, além de outras receitas que porventura As informações exigidas (receita prevista e realizada) devem estar disponibilizadas em arquivo ou página única, para facilitar a visualização e a comparabilidade. A simples publicação do Relatório de Gestão Fiscal – RGF não é suficiente para fins de atendimento a este quesito. Do mesmo modo, a disponibili'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'3.2. Divulga a classificação orçamentária por natureza da receita (categoria econômica, origem, espécie)?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Divulga a classificação orçamentária da receita realizada no mínimo por: categoria econômica, origem, espécie e desdobramento. Exemplo: 111250 (1- Receitas Correntes; 1 - Impostos, Taxas e Contrib. Melhoria; 1 - Imposto; 2 - Impostos sobre o patrimônio; 50 - IPTU). desdobramento. Para os fins da avaliação realizada neste programa, o critério será considerado não atendido caso as informações apresentem um intervalo de atualização superior a 30 dias corridos anteriores à data da avaliação. Considera-se que existe histórico de informações quando os dados disponibilizados referirem-se, pelo menos, a 3 anos que antecedem ao da Possibilidade de gravar toda a base de dados e não apenas registros individualizados em pelo menos um formato editável (em extensões do tipo txt, csv, odt, calc, rtf, jso'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'3.3. Divulga a lista dos inscritos em dívida ativa, contendo, no mínimo, dados referentes ao nome do inscrito e o valor total da dívida?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Divulga a lista dos inscritos em dívida ativa, contendo, no mínimo, dados referentes ao nome do inscrito e o valor total da dívida. Importante reforçar que não é ilegal a divulgação do nome do devedor. O art. 198, §3º do Código Tributário Nacional, expressamente prevê que “não é vedada a divulgação de informações relativas a: [...] II – inscrições na Dívida Ativa da Fazenda Pública”, não restando dúvidas, portanto, de que retira tais informações do rol de informações protegidas por sigilo fiscal. As informações de uma Certidão de Dívida Ativa CDA — com exceção das informações pessoais como CPF, endereços, telefones, que devem ser protegidos — não violam a intimidade, a honra e a imagem do sujeito passivo, nos termos da Lei Geral de Proteção de Dados. Corrobora esse entendimento a prática e'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'4.1. Divulga o total das despesas empenhadas, liquidadas e pagas?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'inciso I, do Decreto nº 10.540/20. Ministério Público, Defensoria, Consórcios Públicos e Estatais Dependentes. Devem ser disponibilizadas as seguintes informações quanto à despesa do Poder ou do órgão: vir consolidada ou ser resultante da soma do detalhamento da despesa). As informações exigidas (empenho, liquidação e pagamento) devem estar disponibilizadas em arquivo ou página única, para facilitar a visualização e a comparabilidade. Para os fins da avaliação realizada neste programa, o critério será considerado não atendido caso as informações apresentem um intervalo de atualização superior a 30 dias corridos anteriores à data da avaliação. Essa definição de atualidade considerada no âmbito do PNTP não se confunde com a “atualização em tempo real”, definida nos termos do inciso IX do art'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'4.2. Divulga as despesas por classificação orçamentária?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'inciso I, do Decreto nº 10.540/20. Ministério Público, Defensoria, Consórcios Públicos e Estatais Dependentes. Devem ser disponibilizadas as seguintes informações quanto à despesa do Poder ou do órgão: função, a subfunção, a natureza da despesa (categoria econômica, grupo, elemento de despesa) e a fonte dos recursos. Para os fins da avaliação realizada neste programa, o critério será considerado não atendido caso as informações apresentem um intervalo de atualização superior a 30 dias corridos anteriores à data da avaliação. Essa definição de atualidade considerada no âmbito do PNTP não se confunde com a “atualização em tempo real”, definida nos termos do inciso IX do art. 2º do Decreto nº 10.540, de 5 de novembro de 2020, que estabelece o prazo de divulgação no primeiro dia útil subsequen'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'4.3. Possibilita a consulta de empenhos com os detalhes do beneficiário do pagamento ou credor, o bem fornecido ou serviço prestado e a identificação do procedimento licitatório originário da des',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'"h", do Decreto nº 10.540/2020. Ministério Público, Defensoria, Consórcios Públicos e Estatais Dependentes. Divulga a lista dos empenhos, bem como possibilita o acesso individualizado ao detalhamento de cada um, com as seguintes informações (ou dispensa e inexigibilidade) originário da despesa. Exemplo: Pregão Eletrônico nº 10/2025. Em caso de contratação direta, informar o número da dispensa ou inexigibilidade (ou a fundamentação no caso de despesas de pequena monta, assim consideradas aquelas em que legislação dispensar a licitação em razão de pequeno valor). Não é suficiente a disponibilização das licitações em outra área do portal para atendimento deste critério. O que se busca aqui é, a partir da consulta da despesa, conhecer o procedimento licitatório que a originou. Ressalte-se que '
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'4.4. Publica relação das despesas com aquisições de bens efetuadas pela instituição contendo: identificação do bem, preço unitário, quantidade, nome do fornecedor e valor total de cada aquisição?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'7º, II e VI, c/c art. 8º, caput e § 1º, III-IV e § 2º da Lei 12.527/2011 (LAI); Art. 48 da Lei 13.303/2016. Estatais Independentes: Arts. 3º, III, 6º, I, e 8º, §2º, da Lei nº 12.527/2011(LAI). Divulga a publicação das relações das despesas com aquisições de bens efetuadas pela instituição contendo: identificação do bem, preço unitário, quantidade, nome do fornecedor e valor total de cada aquisição. Para os fins da avaliação realizada neste programa, o critério será considerado não atendido caso as informações apresentem um intervalo superior a um semestre. Considera-se que existe histórico de informações quando os dados disponibilizados referirem-se, pelo menos, a 3 anos que antecedem a pesquisa. Possibilidade de gravar um conjunto de informações selecionadas em pelo menos um formato editá'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'4.5. Publica informações sobre despesas de patrocínio?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'caput e § 1º, III-IV e § 2º da Lei 12.527/2011 (LAI); Art. 93 da Lei 13.303/2016 Divulga informações sobre despesas de patrocínio. Para os fins da avaliação realizada neste programa, o critério será considerado não atendido caso as informações apresentem um intervalo superior a um semestre. Considera-se que existe histórico de informações quando os dados disponibilizados referirem-se, pelo menos, a 3 anos que antecedem a pesquisa. Possibilidade de gravar um conjunto de informações selecionadas em pelo menos um formato editável (em extensões do tipo txt, csv, odt, calc, rtf, json e outros). Instrumento que permite inserir ou escolher texto, filtrando ou direcionando as opções de dados dentro do conjunto específico de informações.'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'4.6. Publica informações detalhadas sobre a execução dos contratos de publicidade, com nomes dos fornecedores de serviços especializados e veículos, bem como informações sobre os totais de valore',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'caput e § 1º, III-IV e § 2º da Lei 12.527/2011 (LAI); Art. 93 da Lei 13.303/2016; Art. 10 da Lei 12.232/2010. Divulgação das informações detalhadas sobre a execução dos contratos de publicidade, com nomes dos fornecedores de serviços especializados e veículos, bem como informações sobre os totais de valores pagos para cada tipo de serviço e meio de divulgação. Para os fins da avaliação realizada neste programa, o critério será considerado não atendido caso as informações apresentem um intervalo superior a um semestre. Considera-se que existe histórico de informações quando os dados disponibilizados referirem-se, pelo menos, a 3 anos que antecedem a pesquisa. Possibilidade de gravar um conjunto de informações selecionadas em pelo menos um formato editável (em extensões do tipo txt, csv, odt'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'5.1. Identifica as transferências recebidas a partir da celebração de convênios/acordos com indicação, no mínimo, do valor total previsto dos recursos envolvidos, do valor recebido, do objeto e d',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Ministério Público, Defensoria, Consórcios Públicos e Estatais Dependentes e Independentes. Devem ser disponibilizadas informações pormenorizadas quanto às transferências voluntárias (convênios, termos, ajustes e/ou instrumentos congêneres) recebidas de outro Poder ou órgão público ou privado, compreendendo, no mínimo, dados e valores relativos ao: -Número/ano do convênio/termo ou ajuste (ou instrumento equivalente); Considera-se que as informações estão atualizadas quando as mais recentes datarem no máximo há 30 dias do dia em que está sendo realizada a Considera-se que existe histórico de informações quando os dados disponibilizados referirem-se, pelo menos, a 3 anos que antecedem ao da Possibilidade de gravar um conjunto de informações selecionadas em pelo menos um formato editável (em '
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'5.2. Identifica as transferências realizadas a partir da celebração de convênios/acordos/ajustes, com indicação, no mínimo, do beneficiário, do objeto, do valor total previsto para repasse e do v',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'art. 8º, inciso I, "f" do Decreto nº 10.540/20. — e para as Estatais: art.7º, § 3º, inciso III , do Decreto 7.724/2012 e arts. 13 e 22 da Portaria Interministerial CGU/MPOG 140/2006 Ministério Público, Defensoria, Consórcios Públicos e Estatais Dependentes e Independentes. Devem ser disponibilizadas informações pormenorizadas quanto aos repasses e transferências de recursos de natureza voluntária realizadas pelo poder/órgão a outro poder/órgão/pessoa física ou jurídica (convênios, termos, ajustes e/ou instrumentos congêneres). Aqui devem ser informados todos os tipos de repasses financeiros que não tenham natureza contratual a exemplo de convênios, auxílios, subvenções sociais, recursos para projetos culturais etc., compreendendo, no mínimo, dados e valores relativos ao: -Número/ano do con'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'5.3. Identifica os acordos firmados que não envolvam transferência de recursos financeiros, identificando as partes, o objeto e as obrigações ajustadas?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'12.527/2011 – LAI. Ministério Público, Defensoria, Consórcios Públicos e Estatais Dependentes e Independentes. Devem ser disponibilizadas informações pormenorizadas quanto aos Ajustes, Acordos, Termos de Parceria, Convênios e outros Instrumentos congêneres que o Poder ou Órgão tenha aderido, firmado ou seja signatário, que não envolvam transferência ou recebimento de recursos financeiros, compreendendo, no mínimo, dados relativos a: -Número/ano do convênio/termo ou ajuste (ou instrumento equivalente); As informações devem estar organizadas de forma clara e destacada, garantindo fácil acesso e compreensão pelo usuário. Assim, os dados essenciais devem ser apresentados de maneira objetiva e intuitiva, sem a necessidade de consultar o inteiro teor do instrumento. Considera-se que as informaçõ'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'6.1. Divulga a relação nominal dos servidores/autoridades/membros, seus cargos/funções, as respectivas lotações, as suas datas de admissão/exoneração/inativação e a carga horária do cargo/função ',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'moralidade) e 39, § 6º, da CF; arts. 3º, incisos I, II, III, IV e V, e 8º da Lei nº 12.527/2011 – LAI. Ministério Público, Defensoria, Consórcio Públicos e Estatais Dependentes e Independentes. As seguintes informações devem ser apresentadas em uma tabela para garantir a transparência e o cumprimento dos critérios de divulgação: Membros dos Poderes ou órgãos; Todas essas informações devem estar disponíveis no portal para que o critério seja considerado “atendido”. Considera-se que as informações estão atualizadas quando as mais recentes datarem de, no máximo, 30 dias da data em que for realizada a Considera-se que existe histórico de informações quando os dados disponibilizados referirem-se, pelo menos, a 3 anos que antecedem ao da Possibilidade de gravar um conjunto de informações selecio'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'6.2. Identifica a remuneração nominal de cada servidor/autoridade/Membro e a tabela com o padrão remuneratório dos cargos e funções?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'moralidade) e 39, § 6º, da CF; arts. 3º, incisos I, II, III, IV e V, e 8º da Lei nº 12.527/2011 – LAI e Recurso Extraordinário com Agravo nº 652777 (STF - Leading Case - Tema 0483), e para as Estatais: arts. 3º, incisos I, II, III, IV e V, e 8º da Lei nº 12.527/2011 - LAI; Decreto 7.724/2012. Ministério Público, Defensoria, Consórcios Públicos e Estatais Dependentes e Independentes. A identificação da remuneração nominal deve permitir a consulta livre dos valores recebidos por servidores, autoridades e membros dos Poderes e órgãos a título de contraprestação pelos serviços prestados, incluindo eventuais parcelas indenizatórias (ou seja, os valores constantes no contracheque). As informações devem ser apresentadas de forma nominal, ou seja, vinculadas à situação específica de cada servidor,'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'6.3. Divulga a lista de seus estagiários?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'moralidade) e 39, § 6º, da CF; arts. 3º, incisos I, II, III, IV e V, e 8º da Lei nº 12.527/2011 – LAI. Ministério Público, Defensoria, Consórcios Públicos, Estatais Dependentes e Independentes. Deve constar a lista com o nome completo dos estudantes que mantêm contrato de estágio com o Poder ou órgão, indicando, pelo menos, a data de contratação e término do contrato. Caso não tenham ocorrido fatos geradores relacionados à contratação de estagiários, essa situação deve ser informada de forma explícita para garantir melhor compreensão por quem consulta a informação. Além disso, é necessário especificar os exercícios em que não houve contratação, assegurando que a ausência de dados seja claramente justificada. Não basta, portanto, a criação de um link ou seção específica sem qualquer conteúd'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'6.4. Publica lista dos terceirizados que prestam serviços para o Poder ou órgão/entidades, contendo, em relação a cada um deles: nome completo, função ou atividade exercida e nome da empresa empr',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'com art. 7º, II e VI, combinado com art. 8º, caput e § 1º, III e § 2º da Lei 12.527/2011 – LAI. Ministério Público, Defensoria, Consórcios Públicos e Estatais Dependentes e Independentes. Devem ser divulgados os nomes completos dos trabalhadores de empresas terceirizadas que prestam serviços para o Poder ou órgão, identificando-se as funções ou as atividades desenvolvidas por cada um deles e o nome/razão social da empregadora. É recomendável o uso de seção própria ou a seção “servidores”, “pessoal” ou similar. É compatível também o uso de link que redirecione para o download de arquivo contendo a relação em formato de lista, seja em arquivo .pdf ou .xls. Caso não tenham ocorrido fatos geradores relacionados à contratação de terceirizados, essa situação deve ser informada de forma explícita'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'6.5. Divulga a íntegra dos editais de concursos e seleções públicas realizados pelo Poder ou órgão para provimento de cargos e empregos públicos?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'com art. 7º, II e VI, combinado com art. 8º, caput e § 1º, IV (por analogia) e § 2º da Lei 12.527/2011 – LAI, e, para Consórcio: Art. 14 da LEI Nº 11.107/2005 Ministério Público, Defensoria, Consórcios Públicos e Estatais Dependentes e Independentes. Devem ser publicadas, na seção correspondente, as íntegras dos editais de concursos e seleções públicas realizados pelo Poder ou órgão para provimento de cargos e empregos públicos. As informações serão consideradas atualizadas quando as mais recentes tiverem sido registradas em, no máximo, um ano a partir da data da consulta. Para garantir a clareza e a acessibilidade dos dados, é essencial que a não ocorrência de determinados eventos, como concursos públicos, seja expressamente informada. Recomenda-se que essa atualização seja contínua, incl'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'6.6. Divulga informações sobre os demais atos dos concursos públicos e processos seletivos do Poder ou órgão, contendo no mínimo a lista de aprovados com as classificações e as nomeações?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'com art. 7º, II e VI, combinado com art. 8º, caput e § 1º, IV (por analogia) e § 2º da Lei 12.527/2011 – LAI. Ministério Público, Defensoria, Consórcios Públicos e Estatais Dependentes e Independentes. Para além dos editais, o Poder ou órgão deve garantir ao usuário o acesso a informações detalhadas sobre os demais atos dos concursos públicos. No mínimo, deve estar disponível a lista de aprovados com as respectivas classificações. Essas informações podem ser divulgadas na forma de planilha para facilitar a consulta dos dados pelos usuários ou estar hospedadas no site da empresa contratada para executar o concurso ou processo seletivo. Nesse caso, é imprescindível que haja um link de acesso no portal do Poder Público, direcionando o usuário a tais dados. Considera-se que as informações estã'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'7.1. Divulga o nome e o cargo/função do beneficiário, além do valor total recebido, número de diárias usufruídas por afastamento, período de afastamento, motivo do afastamento e local de destino?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'III, IV e V, 7º, incisos VI, e 8º da Lei nº 12.527/2011 - LAI, art. 37, "caput", da CF (princípio da publicidade) e art. 8º, inciso I, "e" do Decreto nº 10.540/20, e para estatais: art.7º, § 3º, inciso VI, do Decreto 7.724/2012 e arts. 15 e 22 da Portaria Interministerial CGU/MPOG 140/2006. Ministério Público, Defensoria, Consórcios Públicos e Estatais Dependentes e Independentes. Devem ser disponibilizadas as seguintes informações: É necessário que essas informações sejam apresentadas de forma destacada na seção específica, não bastando que se encontrem apenas no detalhamento das despesas da seção de despesas. Assim como ocorre em relação aos demais critérios, a eventual inexistência de pagamento de diárias deve ser identificada no portal na seção correspondente. Considera-se que as infor'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'7.2. Divulga tabela ou relação que explicite os valores das diárias dentro do Estado, fora do Estado e fora do país, conforme legislação local?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'III, IV e V, 7º, incisos VI, e 8º da Lei nº 12.527/2011 - LAI, art. 37, "caput", da CF (princípio da publicidade) e art. 8º, inciso I, "e" do Decreto nº 10.540/20. Ministério Público, Defensoria, Consórcios Públicos e Estatais Dependentes e Independentes. É necessário que seja disponibilizada tabela ou relação que explicite os valores das diárias dentro do Estado, fora do Estado e fora do país, conforme legislação local. Caso não haja previsão legal para a concessão de diárias internacionais, é necessário informar expressamente no portal. Geralmente está prevista em Lei ou Resolução, sendo aceita a tabela existente na normativa. No entanto, somente será considerado atendido o critério quando as informações sobre diárias estiverem publicadas em seção específica de diárias no portal. Conside'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'8.1. Divulga a relação das licitações em ordem sequencial, informando o número e modalidade licitatória, o objeto, a data, o valor estimado/homologado e a situação?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'– Estatais: e art. 34, da Lei 13.303/2016; art. 7º, § 3º, inciso V, do Decreto 7.724/2012 e arts. 10, 11 e 22 da Portaria Interministerial CGU/MPOG 140/2006. Ministério Público, Defensoria, Consórcios Públicos e Estatais Dependentes e Independentes Deve ser publicada, preferencialmente, em formato de tabela estruturada em HTML, a listagem das licitações em andamento e encerradas no exercício, obedecendo uma ordem numérica sequencial, com a indicação, no mínimo: revogada, fracassada, deserta, suspensa, reaberta, retificada etc). Os processos de dispensas (exceção das compras diretas de pequeno valor) e inexigibilidades devem constar desta relação também. Caso não tenham sido realizadas licitações, essa informação deve constar expressamente no Considera-se que as informações estão atualizada'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'8.2. Divulga a íntegra dos editais de licitação?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'c/c art. 25, § 3º, da Lei 14.133/2021. – Nas Estatais: c/c art. 39, da Lei 13.303/2016. Ministério Público, Defensoria, Consórcios Públicos e Estatais Dependentes e Independentes. Na seção relativa às licitações, deve ser possível acessar a íntegra dos editais dos certames em andamento e dos encerrados. Considera-se que as informações estão atualizadas quando as mais recentes datarem de, no máximo 30 dias da data em que for realizada a Considera-se que existe histórico de informações quando os dados disponibilizados referirem-se, pelo menos, a 3 anos que antecedem ao da Instrumento que permite inserir ou escolher texto, filtrando ou direcionando as opções de dados dentro do conjunto específico de informações aqui identificadas.'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'8.3. Divulga a íntegra dos demais documentos das fases interna e externa das licitações?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'c/c art. 25, § 3º, da Lei 14.133/2022. Nas Estatais: c/c art. 39, da Lei 13.303/2016. Ministério Público, Defensoria, Consórcios Públicos, Estatais Dependentes e Independentes. Na seção relativa às licitações, deve ser possível acessar a íntegra dos principais documentos das fases interna e externa do processo licitatórios, a detalhes o objeto da licitação; outro, a exemplo do TR); As informações devem ser disponibilizadas em documento(s) com reconhecimento ótico de caracteres (OCR), permitindo a pesquisa e a seleção de texto (por exemplo, um PDF pesquisável). Isso garante acessibilidade, facilidade de consulta e maior transparência na divulgação dos dados). Considera-se que as informações estão atualizadas quando as mais recentes datarem de, no máximo 30 dias da data em que for realizada '
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'8.4. Divulga a íntegra dos principais documentos dos processos de dispensa e inexigibilidade de licitação?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'art. 72, parágrafo único, da Lei nº 14.133/2021. e para as estatais: c/c art. 39, da Lei 13.303/2016 Ministério Público, Defensoria, Consórcios Públicos, Estatais Dependentes e Independentes. Na seção relativa às licitações, deve ser possível acessar os seguintes documentos dos processos de dispensa e inexigibilidade de licitação: detalhes o objeto da contratação; -Caracterização da situação emergencial, calamitosa ou de grave e iminente risco à segurança pública que justifique a dispensa, quando for o caso; As exigências acima não se aplicam nas hipóteses de dispensas de pequeno valor para obras, serviços ou compras (art. 24, I e II da Lei nº 8.666/93 e art. 72, parágrafo único, da Lei nº 14.133/2021). A divulgação pode ser feita mediante a disponibilização de links para documentos extern'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'8.5. Divulga a íntegra das Atas de Adesão – SRP?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'art. 11, III, do Decreto nº 7.892/2013 e art. 18, §4º, do Decreto nº 11.462/2023. Ministério Público, Defensoria, Consórcios Públicos e Estatais Dependentes e Independentes. Na seção relativa às licitações e/ou contratos, deve ser possível acessar a íntegra das atas de adesão de registros de preços. Considera-se que as informações estão atualizadas quando as mais recentes datarem de, no máximo 30 dias da data em que for realizada a Considera-se que existe histórico de informações quando os dados disponibilizados referirem-se, pelo menos, a 3 anos que antecedem ao da Instrumento que permite inserir ou escolher texto, filtrando ou direcionando as opções de dados dentro do conjunto específico de informações aqui identificadas.'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'8.6. Divulga o plano de contratações anual (art. 12, VII, da Lei n. 14.133)?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Ministério Público, Defensoria e Consórcios Públicos. Na seção relativa às licitações e/ou contratos, deve ser possível consultar os planos de contratações anuais a que se refere o artigo 12, inciso VII, da Lei nº 14.133/2021, segundo o qual “a partir de documentos de formalização de demandas, os órgãos responsáveis pelo planejamento de cada ente federativo poderão, na forma de regulamento, elaborar plano de contratações anual, com o objetivo de racionalizar as contratações dos órgãos e Poderes ou órgãos sob sua competência, garantir o alinhamento com o seu planejamento estratégico e subsidiar a elaboração das respectivas leis orçamentárias”. A inclusão de uma declaração informando a não elaboração ou inexistência do Plano de Contratações Anual (PAC) não é suficiente para o cumprimento des'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'8.7. Divulga a relação dos licitantes e/ou contratados sancionados administrativamente pelo Poder ou órgão?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Art. 83 da Lei 13.303/2016 c/c art. 161 da Lei 14.133/2021; arts. 12 e 22 da Portaria Interministerial CGU/MPOG 140/2006. Ministério Público, Defensoria, Consórcios Públicos e Estatais Dependentes e Independentes. Exige-se a divulgação dos nomes dos licitantes e/ou contratados sancionados administrativamente pelo Poder ou órgão (hipóteses dos incisos III e IV do art. 156 da Lei nº 14.133/2021). Considera-se que as informações estão atualizadas quando as mais recentes datarem de, no máximo 30 dias da data em que for realizada a Considera-se que existe histórico de informações quando os dados disponibilizados referirem-se, pelo menos, a 3 anos que antecedem ao da Possibilidade de gravar um conjunto de informações selecionadas em pelo menos um formato editável (em extensões do tipo txt, csv, '
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'8.8. Divulga regulamento interno de licitações e contratos?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'8º, caput e § 2º da Lei 12.527/2011 (LAI); Art. 40 da Lei 13.303/2016. Exige-se a divulgação do regulamento interno de licitações e contratos compatível com o disposto na Lei das Estatais (Lei 13.303/2016). 9. Contratos'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'9.1. Divulga a relação dos contratos celebrados em ordem sequencial, com o seu respectivo resumo, contendo, no mínimo, indicação do contratado(a), do valor, do objeto e da vigência, bem como dos ',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'– LAI, e para as estatais: e arts. 39 e 48 da Lei nº 13.303/2016 Ministério Público, Defensoria, Consórcio Públicos e Estatais Dependentes e Independentes. Exige-se a divulgação dos contratos celebrados em seção específica, com o seu respectivo resumo, contendo, no mínimo, indicação do contratado(a), do valor, do objeto e da vigência e, se houver, dos aditivos decorrentes dos referidos contratos. Considera-se que as informações estão atualizadas quando as mais recentes datarem de, no máximo 30 dias da data em que for realizada a Considera-se que existe histórico de informações quando os dados disponibilizados referirem-se, pelo menos, a 3 anos que antecedem ao da Possibilidade de gravar a relação dos contratos em pelo menos um formato editável (em extensões do tipo txt, csv, odt, calc, rtf'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'9.2. Divulga o inteiro teor dos contratos e dos respectivos termos aditivos?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'– LAI, e para as estatais: e arts. 39 e 51 da Lei 13.303/2016 Ministério Público, Defensoria, Consórcios Públicos e Estatais Dependentes e Independentes. Devem ser publicadas as íntegras dos contratos e, se houver, de seus termos aditivos. Considera-se que as informações estão atualizadas quando as mais recentes datarem de, no máximo 30 dias da data em que for realizada a Considera-se que existe histórico de informações quando os dados disponibilizados referirem-se, pelo menos, a 3 anos que antecedem ao da Instrumento que permite inserir ou escolher texto, filtrando ou direcionando as opções de dados dentro do conjunto específico de informações aqui identificadas.'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'9.3. Divulga a relação/lista dos fiscais de cada contrato vigente e encerrado?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Ministério Público, Defensoria, Consórcios Públicos e Estatais Dependentes e Independentes. Deve ser publicada uma relação dos nomes dos fiscais de contrato, incluindo os vigentes e os encerrados, com a indicação dos ajustes (contratos) pelos quais são responsáveis. Considera-se que as informações estão atualizadas quando as mais recentes datarem de, no máximo 30 dias da data em que for realizada a Considera-se que existe histórico de informações quando os dados disponibilizados referirem-se, pelo menos, a 3 anos que antecedem ao da Possibilidade de gravar a relação dos fiscais em pelo menos um formato editável (em extensões do tipo txt, csv, odt, calc, rtf, json e outros). Instrumento que permite inserir ou escolher texto, filtrando ou direcionando as opções de dados dentro do conjunto es'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'9.4. Divulga a ordem cronológica de seus pagamentos, bem como as justificativas que fundamentaram a eventual alteração dessa ordem?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Ministério Público, Defensoria e Consórcios Públicos. Em seção específica no portal, devem ser listados os créditos com a respectiva ordem cronológica de pagamentos. É necessário que existam informações mínimas sobre o crédito (por exemplo: data de vencimento, data de pagamento, credor, valor do pagamento). O vencimento refere-se à data a partir da qual o credor tem o direito legal de exigir o pagamento. Embora a regulamentação local possa definir essa data especificamente, na ausência de tal definição, considera-se como data de vencimento aquela da liquidação ou da emissão da nota fiscal. A ordem de pagamento deve observar a fonte dos recursos e abranger, no mínimo, seguir quatro categorias contratuais: insumos etc.); para realizar atividades como limpeza, segurança, tecnologia etc.); Em '
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'10.1. Divulga informações sobre as obras contendo o objeto, a situação atual, as datas de início e de conclusão da obra, empresa contratada e o percentual concluído?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Ministério Público, Defensoria e Consórcios Públicos. As informações sobre obras devem ser disponibilizadas de forma estruturada em seção específica do portal, garantindo fácil acesso e compreensão. Para isso, recomenda-se que os dados sejam apresentados em tabela, contendo, no mínimo, os seguintes campos: concluída, entre outras); (em caso de execução direta, informar essa situação); Caso não existam obras em execução ou concluídas, informar expressamente no portal, garantindo total transparência. Considera-se que as informações estão atualizadas quando as mais recentes datarem de, no máximo 30 dias da data em que for realizada a Possibilidade de gravar as informações em pelo menos um formato editável (em extensões do tipo txt, csv, odt, calc, rtf, json e outros). Instrumento que permite '
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'10.2. Divulga os quantitativos, os preços unitários e totais contratados?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Lei 14.133/2021. Estatais Dependentes e Estatais Independentes: art. 39, da Lei 13.303/2016. Ministério Público, Defensoria, Consórcios Públicos e Estatais Dependentes e Independentes. Na mesma seção específica sobre obras no portal, devem ser divulgados: serviço contratado, que compõe a obra; dos quantitativos pelos preços unitários. É o valor total licitado ou contratado. Em casos de execução direta da obra, são os valores que compõem o orçamento da obra. É necessário que a eventual inexistência de obras seja identificada no Considera-se que as informações estejam atualizadas quando disponibilizadas em até 25 dias úteis após a assinatura do contrato. Possibilidade de gravar as informações em pelo menos um formato editável (em extensões do tipo txt, csv, odt, calc, rtf, json e outros). Co'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'10.3. Divulga os quantitativos executados e os preços efetivamente pagos?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Lei 14.133/2021. Ministério Público, Defensoria e Consórcios. Na mesma seção específica sobre obras no portal, ao selecionar determinada obra, deve ser possível acessar os quantitativos (itens) já executados bem como os preços efetivamente praticados, relativamente às obras cujos contratos tenham se encerrado. É necessário que a eventual inexistência de obras seja identificada no Considera-se que as informações estejam atualizadas quando disponibilizadas em até 45 dias úteis após a conclusão do contrato de obras. Possibilidade de gravar as informações em pelo menos um formato editável (em extensões do tipo txt, csv, odt, calc, rtf, json e outros). Considera-se atendido igualmente se apresentar documentos em formato PDF com reconhecimento ótico de caracteres (OCR), permitindo a pesquisa e a'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'10.4. Divulga relação das obras paralisadas contendo o motivo, o responsável pela inexecução temporária do objeto do contrato e a data prevista para o reinício da sua execução?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'§ 6º, da Lei nº 14.133/2021. Ministério Público, Defensoria e Consórcios. Na mesma seção específica sobre obras no portal, deve ser divulgada uma relação das obras paralisadas, contendo o motivo da interrupção e eventual informação sobre o responsável pela inexecução contratual e a previsão do reinício da obra. É necessário que a eventual inexistência de obras seja assim identificada no site. Da mesma forma, em não havendo obras paralisadas, esse dado deve ser igualmente identificado. No caso de obras paralisadas por motivo judicial, recomenda-se informar o número do processo judicial e a data da decisão que determinou a paralisação. Considera-se que as informações estejam atualizadas quando disponibilizadas em até 45 dias úteis após a conclusão do contrato de obras. Possibilidade de grava'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'11.1. Publica a Prestação de Contas do Ano Anterior (Balanço Geral)?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Ministério Público, Defensoria e Consórcios. Deve ser divulgado o Balanço Geral do Poder ou Órgão, compreendendo, no mínimo, os demonstrativos contábeis: Ainda que as informações sejam disponibilizadas em formato fechado (por exemplo, pdf), para que se tenha como atendido o critério, as informações devem constar em documento "pesquisável" (por exemplo, “pdf pesquisável”). Considera-se que as informações estejam atualizadas quando os demonstrativos contábeis se referirem ao último exercício exigível. Os prazos são definidos geralmente nas Constituições Estaduais ou Lei Orgânicas Municipais, por isso não é possível uma padronização. Mas de uma forma geral, os balanços devem ser publicados até o mês de abril do ano seguinte a que se Considera-se que existe histórico de informações quando os b'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'11.2. Divulga o Relatório de Gestão ou Atividades?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Ministério Público, Defensoria e Consórcios. Deverá ser feita a divulgação do relatório de gestão ou atividades elaborado pelo chefe do Poder ou órgão a respeito de sua gestão no exercício anterior, abrangendo os principais resultados sejam nas áreas finalísticas e/ou de gestão. Geralmente são divulgados os resultados consolidados ou por área/setores. Ainda que as informações sejam disponibilizadas em formato não editável (por exemplo, pdf), para que se tenha como atendido o critério, as informações devem constar em documento "pesquisável" (por exemplo, “pdf pesquisável”). Considera-se que as informações estão atualizadas quando o relatório de gestão ou atividade se referir ao último exercício encerrado. Considera-se que existe histórico de informações quando estiverem disponíveis os relat'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'11.3. Divulga a íntegra da decisão da apreciação ou julgamento das contas pelo Tribunal de Contas?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Ministério Público, Defensoria, Consórcios e Estatais Dependentes e Independentes. Deverá ser feita a divulgação do resultado da apreciação ou julgamento das contas do Poder/Órgão pelo Tribunal de Contas. No caso de Tribunais de Contas que não tiver suas contas apreciadas pela própria Corte, atende ao critério o portal que divulgar a última manifestação opinativa a respeito do tema. Para atendimento ao critério, não basta a divulgação da conclusão do Acórdão ou Parecer emitido pelo Tribunal de Contas. É necessário que haja a disponibilização do documento na íntegra. Caso o documento esteja hospedado no sítio institucional do Tribunal de Contas, é admissível a disponibilização de um link direto que leve o usuário exatamente ao local onde a informação ou o documento possa ser acessado. Consi'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'11.4. Divulga o resultado do julgamento das Contas do Chefe do Poder Executivo pelo Poder Legislativo?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'O resultado do julgamento das contas do Chefe do Poder Executivo pelo Poder Legislativo deve ser divulgado em seção específica. Deve ser disponibilizada a íntegra do ato oficial que formalizou a decisão do Poder Legislativo na sessão de julgamento, como resolução, decreto legislativo ou instrumento equivalente. Caso o documento esteja hospedado no Portal do Legislativo, é admissível a disponibilização de um link direto que leve o usuário exatamente ao local onde a informação ou o documento pode ser acessado. É fundamental destacar a distinção entre as etapas do processo de prestação de contas. O Tribunal de Contas exerce uma função técnica e fiscalizatória, analisando a regularidade da gestão orçamentária, financeira e patrimonial, verificando a conformidade com as normas legais e princípi'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'11.5. Divulga o Relatório de Gestão Fiscal (RGF)?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'inclui-se a Portaria STN nº. 274/16, art. 14, IV Ministério Público, Defensoria e Consórcios Públicos. Deve ser divulgado o Relatório de Gestão Fiscal - LRF em seção específica no portal do poder ou órgão. Em alguns portais da transparência, o RGF pode estar contido junto com as informações contábeis. Em outros, o RGF pode ser localizado na aba “publicações” ou “demonstrativos fiscais”. Considera-se que as informações estejam atualizadas quando o relatório do último quadrimestre exigível estiver disponível - prazo legal: até 30 dias após o encerramento do quadrimestre. Municípios com até 50 mil habitantes têm a opção de divulgar semestralmente (nesse caso, o prazo legal seria de até 30 dias após o encerramento do semestre). Instrumento que permite inserir ou escolher texto, filtrando ou di'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'11.6. Divulga o Relatório Resumido da Execução Orçamentária (RREO)?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Portaria STN nº. 274/16, art. 14, IV Deve ser divulgado o Relatório Resumida da Execução Orçamentária - LRF em seção específica no portal do poder ou órgão. Considera-se que as informações estejam atualizadas quando o relatório do último bimestre exigível estiver disponível - prazo legal: até 30 dias após o encerramento do bimestre. Considera-se que existe histórico de informações quando os dados disponibilizados referirem-se, pelo menos, a 3 anos que antecedem ao da Instrumento que permite inserir ou escolher texto, filtrando ou direcionando as opções de dados dentro do conjunto específico de informações aqui identificadas.'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'11.7. Divulga o plano estratégico institucional?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'combinado com art. 8º, § 1º, V, da Lei 12.527/2011. Para estatal independentes: Art. 7º, § 3º, II, do Decreto 7.724/2012 Ministério Público, Defensoria, Consórcios e Estatais Dependentes e Independentes. Destaque-se que o Plano Estratégico difere do Plano Plurianual (PPA), pois define a visão de longo prazo de um Poder ou órgão. É imprescindível que no Plano Estratégico estejam contemplados seus objetivos estratégicos, indicadores e as respectivas metas, as quais permitem medir o seu grau de atendimento. O Plano Estratégico serve como um guia para orientar a atuação da instituição, garantindo que suas ações estejam alinhadas com suas prioridades e valores. Esse plano não se restringe a aspectos orçamentários e pode ter um horizonte maior do que o Plano Plurianual, sendo atualizado conforme'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'11.8. Divulga a Lei do Plano Plurianual (PPA) e seus anexos?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'É necessário que estejam publicados no portal, em seção específica, a íntegra do PPA vigente e seus anexos. Não será considerado cumprido o critério se a Lei estiver apenas na área ou menu que contenha todas as legislações, necessitando a procura pelo usuário. O PPA é um instrumento de planejamento governamental com foco na gestão de recursos públicos. Ele estabelece os programas, ações e metas para um período de quatro anos, definindo como os recursos serão aplicados para viabilizar as políticas públicas e os investimentos do governo. Diferente do Plano Estratégico, o PPA tem um caráter legal e obrigatório, sendo elaborado pelo Poder Executivo e submetido à aprovação do Legislativo.'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'11.9. Divulga a Lei de Diretrizes Orçamentárias (LDO) e seus anexos?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'É necessário que estejam publicados no portal, em seção específica, a íntegra da LDO e seus anexos do exercício vigente. Não será considerado cumprido o critério se a Lei estiver apenas na área ou menu que contenha todas as legislações, necessitando a procura pelo usuário.'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'11.10. Divulga a Lei Orçamentária (LOA) e seus anexos?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'É necessário que esteja publicada no portal, em seção específica, a íntegra da LOA do exercício vigente. Não será considerado cumprido o critério se a Lei estiver apenas na área ou menu que contenha todas as legislações, necessitando a procura pelo usuário.'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'11.11. Divulga o Orçamento do Consórcio Público onde conste a estimativa da receita e a fixação da despesa para o exercício atual?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'274/16, art 2, II, Art 6 e art. 14, IV. Exige-se a divulgação do Orçamento do Consórcio Público onde conste a estimativa da receita e a fixação da despesa para o exercício atual. Considera-se que as informações estejam atualizadas quando for divulgado o orçamento referente ao exercício atual. Considera-se que existe histórico de informações quando os dados disponibilizados referirem-se, pelo menos, a 3 anos que antecedem ao da Possibilidade de gravar as informações em pelo menos um formato editável (em extensões do tipo txt, csv, odt, calc, rtf, json e outros), dentro de um conjunto específico de informações.'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'11.12. Divulga as demonstrações financeiras trimestrais?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'8º, caput e § 2º da Lei 12.527/2011 (LAI); Divulga as demonstrações financeiras trimestrais. Considera-se que as informações estão atualizadas quando disponibilizadas do último trimestre. Considera-se que existe histórico de informações quando os dados disponibilizados referirem-se, pelo menos, a 3 anos que antecedem a pesquisa. Possibilidade de gravar as informações em pelo menos um formato editável (em extensões do tipo txt, csv, odt, calc, rtf, json e outros), dentro de um conjunto específico de informações.'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'11.13. Divulga as demonstrações financeiras (contábeis) acompanhadas dos pareceres do Conselho Fiscal e da auditoria independente?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'8º, caput e § 2º da Lei 12.527/2011 (LAI). Divulga as demonstrações financeiras (contábeis) acompanhadas dos pareceres do Conselho Fiscal e da auditoria independente. Considera-se que as informações estão atualizadas quando as mais recentes se referem ao ano anterior. Considera-se que existe histórico de informações quando os dados disponibilizados referirem-se, pelo menos, a 3 anos que antecedem a pesquisa. Possibilidade de gravar as informações em pelo menos um formato editável (em extensões do tipo txt, csv, odt, calc, rtf, json e outros), dentro de um conjunto específico de informações.'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'11.14. Pública o Orçamento de Investimentos da instituição que compõe a Lei Orçamentária Anual?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'8º, caput e § 1º, III e V, e § 2º da Lei 12.527/2011 (LAI); Art. 7º, § 3º, II-IV, do Decreto 7.724/2012; Divulga a publicação do Orçamento de Investimentos da instituição que compõe a Lei Orçamentária Anual. Considera-se que as informações estão atualizadas quando as mais recentes se referem ao ano anterior. Considera-se que existe histórico de informações quando os dados disponibilizados referirem-se, pelo menos, a 3 anos que antecedem a pesquisa. Possibilidade de gravar as informações em pelo menos um formato editável (em extensões do tipo txt, csv, odt, calc, rtf, json e outros), dentro de um conjunto específico de informações.'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'11.15. Divulga as demonstrações contábeis auditadas em formato eletrônico editável?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'8º, caput e § 2º da Lei 12.527/2011 (LAI); Art. 46, § 1º, do Decreto Devem ser divulgas as demonstrações contábeis auditadas em formato eletrônico editável. Considera-se que as informações estão atualizadas quando as mais recentes se referem ao ano anterior. Considera-se que existe histórico de informações quando os dados disponibilizados referirem-se, pelo menos, a 3 anos que antecedem a pesquisa. Possibilidade de gravar as informações em pelo menos um formato editável (em extensões do tipo txt, csv, odt, calc, rtf, json e outros), dentro de um conjunto específico de informações.'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'11.16. Divulga o relatório anual elaborado pelo Comitê de Auditoria Estatutário com informações sobre as atividades e os resultados e suas conclusões e recomendações?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'8º, caput e § 2º da Lei 12.527/2011 (LAI); Art. 24, § 1º, VII, da Lei 13.303/2016 Devem ser divulgados os relatórios anuais elaborados pelo Comitê de Auditoria Estatutário com informações sobre as atividades e os resultados e suas conclusões e recomendações. Considera-se que as informações estão atualizadas quando as mais recentes tiverem sido registradas em, no máximo, um ano a partir da data da Considera-se que existe histórico de informações quando os dados disponibilizados referirem-se, pelo menos, a 3 anos que antecedem a pesquisa.'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'11.17. Divulga as atas das reuniões do Comitê de Auditoria Estatutário?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'art. 7º, II, V e VI, combinado com art. 8º, caput e § 2º da Lei 12.527/2011 (LAI); Art. 24, § 4º da Lei 13.303/2016 Devem ser divulgas as atas das reuniões do Comitê de Auditoria Estatutário. Considera-se que as informações estão atualizadas quando as mais recentes forem estarem registradas em no máximo 60 dias da data da consulta. Considera-se que existe histórico de informações quando os dados disponibilizados referirem-se, pelo menos, a 3 anos que antecedem a pesquisa.'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'11.18. Divulga as atas das reuniões do Comitê de Elegibilidade Estatutário ou Comitê de Pessoas, Elegibilidade, Sucessão e Remuneração a partir de 2022, na forma de sumário dos fatos ocorridos, i',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'8º, caput e § 2º da Lei 12.527/2011 (LAI); Art. 24, § 4º da Lei 13.303/2016 Divulga as atas das reuniões do Comitê de Elegibilidade Estatutário ou Comitê de Pessoas, Elegibilidade, Sucessão e Remuneração a partir de 2022, na forma de sumário dos fatos ocorridos, inclusive das dissidências e protestos. Considera-se que as informações estão atualizadas quando as mais recentes forem estarem registradas em no máximo 60 dias da data da consulta. Considera-se que existe histórico de informações quando os dados disponibilizados referirem-se, pelo menos, a 3 anos que antecedem a pesquisa.'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'11.19. Divulga anualmente relatório integrado ou de sustentabilidade?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'8º, caput e § 2º da Lei 12.527/2011 (LAI); Art. 8º, IX, e § 4º da Lei 13.303/2016. Deve ser divulgado anualmente o relatório integrado ou de sustentabilidade. Considera-se que as informações estão atualizadas quando as mais recentes tiverem sido registradas em, no máximo, um ano a partir da data da Considera-se que existe histórico de informações quando os dados disponibilizados referirem-se, pelo menos, a 3 anos que antecedem a pesquisa. 12. Serviço de Informação ao Cidadão - SIC Os portais institucionais devem conter orientações sobre os canais – físicos ou eletrônicos – que o cidadão poderá utilizar para solicitação de informações junto ao Poder ou órgão. O órgão deve apresentar possibilidade de acompanhamento posterior da solicitação.'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'12.1. Existe o SIC no site e indica a unidade/setor responsável?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Ministério Público, Defensoria, Consórcios e Estatais Dependentes e Independentes. Para facilitar os pedidos de acesso à informação a serem realizados presencialmente (SIC físico), o Poder ou órgão deverá informar, em seu portal, qual é a unidade responsável pelo SIC dentro de sua estrutura organizacional.'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'12.2. Indica o endereço físico, o telefone e o e-mail da unidade responsável pelo SIC, além do horário de funcionamento?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'VI, b, da Lei nº 13.460/2017. Ministério Público, Defensoria, Consórcios e Estatais Dependentes e Independentes. Para facilitar os pedidos de acesso à informação a serem realizados presencialmente (SIC físico), o Poder ou órgão deverá informar, em seu portal:'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'12.3. Há possibilidade de envio de pedidos de informação de forma eletrônica (e -SIC)?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Ministério Público, Defensoria, Consórcios e Estatais Dependentes e Independentes. Os portais institucionais devem disponibilizar canal eletrônico para solicitação de informação pela internet (requerimento eletrônico). Quanto ao pedido pela internet, é necessária a disponibilização de um formulário específico para esse fim. Caso o Poder ou o órgão disponibilize o formulário dentro da seção da Ouvidoria, deverá ser possível selecionar especificamente a opção “Pedido de Acesso à Informação”. O formulário deve conter os seguintes campos: A identificação do solicitante não pode ser condicionada a exigências, ainda que acessórias, que possam inviabilizar o pedido, tais como: envio de documentos, assinatura reconhecida, declaração de responsabilidade ou maioridade etc. É vedado condicionar a pre'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'12.4. A solicitação por meio de eSic é simples, ou seja, sem a exigência de itens de identificação do requerente que dificultem ou impossibilitem o acesso à informação, tais como: envio de docume',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Ministério Público, Defensoria, Consórcios e Estatais Dependentes e Independentes. É vedada a exigência de itens de identificação do requerente que dificultem ou impossibilitem o acesso à informação, tais como: envio de documentos, assinatura reconhecida, declaração de responsabilidade, maioridade.'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'12.5. Divulga nesta seção, instrumento normativo local que regulamente a Lei nº 12.527/2011 – LAI?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Ministério Público, Defensoria, Consórcios e Estatais Dependentes e Independentes. Deve ser disponibilizado, no portal institucional dos poderes avaliados, o ato normativo local (legal ou infralegal) que regulamente a Lei nº 12.527/2011 – LAI. O link ou o texto do instrumento normativo deverá encontrar-se em local visível, identificado e associado às informações relativas à Transparência e/ou à Dica: para saber como elaborar o ato normativo local, consulte o Guia Técnico de Regulamentação da LAI em Municípios da CGU – https://issuu.com/marcossantosdasilva/docs/guia_checklist. Veja também o curso à distância “Regulamentação da LAI nos Municípios”, disponibilizado de forma gratuita no Portal Único de Escolas de Governo – https://escolavirtual.gov.br/curso/.'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'12.6. Divulga, na seção relativa ao e-SIC, os prazos de resposta ao cidadão, incluindo o recursal, e as autoridades competentes para o exame dos pedidos, além do procedimento referente à realizaç',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Ministério Público, Defensoria, Consórcios e Estatais Dependentes e Independentes. Devem ser disponibilizados, na seção relativa ao e-SIC de forma destacada, os prazos de resposta ao cidadão, incluindo o recursal, e as autoridades competentes para o exame dos pedidos, além do procedimento referente à realização do pedido e eventual recurso.'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'12.7. Divulga relatório anual estatístico contendo a quantidade de pedidos de acesso recebidos, atendidos, indeferidos, bem como informações genéricas sobre os solicitantes?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Ministério Público, Defensoria, Consórcios e Estatais Dependentes e Independentes. Nos portais, deve ser publicado um relatório anual estatístico contendo a quantidade de pedidos de acesso a informações recebidos, atendidos e indeferidos, além de informações genéricas sobre os solicitantes. Caso essas informações sejam apresentadas de forma gráfica, o item poderá ser considerado atendido, desde que todos os dados exigidos estejam contemplados de maneira clara e acessível. Como informações genéricas sobre os solicitantes exemplificamos que podem ser incluídos dados como categoria do solicitante (cidadão, empresa, organização da sociedade civil, servidor público etc.), idade, sexo, dentre outros, sempre respeitando o sigilo e a proteção de dados pessoais. Considera-se que as informações estã'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'12.8. Divulga lista de documentos classificados em cada grau de sigilo, contendo pelo menos o assunto sobre o qual versa a informação, a categoria na qual ela se encontra, o dispositivo legal que',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Ministério Público, Defensoria, Consórcios e Estatais Dependentes e Independentes. O art. 24 da Lei 12.527/2011 estabelece os critérios para classificação de informações em poder dos órgãos e entidades públicas quanto ao seu grau de sigilo, classificando-os em três níveis: ultrassecreto, secreto e reservado. Ultrassecreto: Refere-se a informações cuja divulgação pode causar dano muito grave à segurança da sociedade e do Estado. O prazo máximo de restrição de acesso à informação é de 25 anos (art. 24, §1º, I). Secreto: Envolve informações cuja divulgação pode causar dano significativo à segurança da sociedade e do Estado, tendo como prazo máximo 15 anos (art. 24 §1º, II). Reservado: Diz respeito a informações cuja divulgação pode causar dano à segurança da sociedade e do Estado, com restriç'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'12.9. Divulga lista das informações que tenham sido desclassificadas nos últimos 12 (doze) meses?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Ministério Público, Defensoria, Consórcios e Estatais Dependentes e Independentes Ao solicitar o rol de “informações que tenham sido desclassificadas”, o critério indaga se o poder ou órgão detinha informações antes classificadas como sigilosas/secretas e que passaram a ficar disponíveis em razão do decurso do prazo. Na eventualidade de ausência de informações classificadas ou desclassificadas nos últimos 12 meses, os Poderes e órgãos devem informar explicitamente em sua página/seção de transparência que não existe conteúdo a ser publicado. Considera-se que as informações estejam atualizadas quando as mais recentes datarem, pelo menos, do ano anterior ao da pesquisa (regra de atualização anual). Considera-se que existe histórico de informações quando os dados disponibilizados referirem-se,'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'13.1. O site oficial e o portal de transparência contêm símbolo de acessibilidade em destaque?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Ministério Público, Defensoria, Consórcios e Estatais Dependentes e Independentes. O símbolo de acessibilidade deve estar em destaque, conforme exemplos'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'13.2. O site e o portal de transparência contêm exibição do “caminho” de páginas percorridas pelo usuário?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'art. 63, "caput" e § 1º, da Lei nº 13.146/15, Art. 3º, incisos XIX, da Lei 14.129/2022. Ministério Público, Defensoria, Consórcios e Estatais Dependentes e Independentes. Deve exibir o “caminho” de páginas percorridas pelo usuário, conforme exemplo abaixo:'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'13.3. O site e o portal de transparência contêm opção de alto contraste?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'da Lei nº 13.146/2015 e art. 3º, XIX, da Lei nº 14.129/2022. Ministério Público, Defensoria, Consórcios e Estatais Dependentes e Independentes. A opção de alto contraste inverte o plano de cores dominante no site e possibilita que pessoas com baixa visão possam visualizar o conteúdo.'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'13.4. O site e o portal de transparência contêm ferramenta de redimensionamento de texto?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'da Lei nº 13.146/2015 e art. 3º, XIX, da Lei nº 14.129/2022. Ministério Público, Defensoria, Consórcios e Estatais Dependentes e Independentes. O redimensionamento de texto ou o zoom de página permite aos usuários que aumentem o tamanho do conteúdo da página.'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'13.5. Contém mapa do site institucional?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'da Lei nº 13.146/2015 e art. 3º, XIX, da Lei nº 14.129/2022. Ministério Público, Defensoria, Consórcios e Estatais Dependentes e Independentes. Considerando que as informações do portal da transparência já se encontram, em regra, sistematizadas, é necessário que ao menos o site institucional conte com um mapa, o que geralmente é encontrado na parte inferior de sua página principal. 14. Ouvidorias'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'14.1. Há informações sobre o atendimento presencial pela Ouvidoria (Indicação de endereço físico e telefone, além do horário de funcionamento)?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'arts. 6º, VI, b, 7º, § 2º, VI, e 10, § 4º, da Lei nº 13.460/2017 c/c arts. 24, I, a, e 27, II, da Lei 14.129/2021. Ministério Público, Defensoria, Consórcios e Estatais Dependentes e Independentes. Canal para receber, analisar e responder as manifestações encaminhadas pelos usuários de serviços. Para facilitar o acesso ao espaço físico da Ouvidoria, o Poder ou órgão deverá informar, em seu portal, o endereço, o telefone e o horário de funcionamento da unidade. 14.2. Há canal eletrônico de acesso/interação com a ouvidoria? LAI c/c Art. 10, § 4º, da Lei nº 13.460/2017 c/c Art. 27, IV, da Lei nº 14.129/2021. Ministério Público, Defensoria, Consórcios e Estatais Dependentes e Independentes. Divulga canal eletrônico para receber SUGESTÃO, ELOGIO, SOLICITAÇÃO (que não é o pedido de acesso à info'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'14.3. Divulga Carta de Serviços ao Usuário?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Ministério Público, Defensoria, Consórcios e Estatais Dependentes e Independentes. Divulga e mantém atualizada “Carta de Serviços ao Usuário” com informações sobre os serviços prestados, as formas de acesso a esses serviços e os compromissos e padrões de qualidade de atendimento ao público: -Requisitos, documentos, formas e informações necessárias para acessar o serviço; -Locais e formas para o usuário apresentar eventual manifestação sobre a prestação do serviço. 15. Lei Geral de Proteção de Dados (LGPD) e Governo Digital'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'15.1. Identifica o encarregado/responsável pelo tratamento de dados pessoais e disponibiliza Canal de Comunicação (telefone e/ou e-mail)?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'(Lei 13.709/ 2018) + Art. 3º, incisos XVII, da Lei 14.129/2022. Ministério Público, Defensoria, Consórcios e Estatais Dependentes e Independentes. Conforme exigência expressa da LGPD, deve ser divulgado o nome do encarregado/responsável pelo tratamento de dados pessoais e disponibilizado o Canal de Comunicação (telefone e/ou e-mail) com esse servidor.'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'15.2. Publica a sua Política de Privacidade e Proteção de Dados?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'incisos XVII, da Lei 14.129/2022. Ministério Público, Defensoria, Consórcios e Estatais Dependentes e Independentes. Da mesma forma, em atendimento à LGPD, publica a Política de Privacidade e Proteção de Dados adotada pelo Poder ou órgão.'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'15.3. Possibilita a demanda e o acesso a serviços públicos por meio digital, sem necessidade de solicitação presencial?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'para empresas estatais, art. 8º, inciso I do Decreto 7.724/2012 Ministério Público, Defensoria, Consórcios e Estatais Dependentes e Independentes. Os serviços públicos digitais permitem que cidadãos solicitem e acessem diversos atendimentos e procedimentos administrativos de forma online, sem a necessidade de comparecimento presencial. Eles se diferenciam do e-SIC (Sistema Eletrônico do Serviço de Informação ao Cidadão), cuja finalidade é viabilizar pedidos de acesso a informações públicas, conforme a Lei de Acesso à Informação (LAI). Enquanto o e-SIC se concentra na transparência e no direito à informação, os serviços digitais têm como objetivo facilitar o atendimento direto ao cidadão em suas demandas administrativas e operacionais. Podem-se citar os seguintes exemplos: de medicamentos, '
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'15.4. Possibilita o acesso automatizado por sistemas externos em dados abertos (estruturados e legíveis por máquina), e a página contém as regras de utilização?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'XXV e 24, V da Lei 14.129/2021. e, para empresas estatais, art. 8º, incisos III-V do Decreto 7.724/2012 Ministério Público, Defensoria, Consórcios e Estatais Dependentes e Independentes. Os dados divulgados nos portais públicos (transparência ativa) devem ser legíveis por máquina e em formato aberto. A página deverá conter também as regras com seções detalhadas e exemplos. Neste ciclo, é considerado atendido esse critério quando o Poder ou Órgão tiver pelo menos um caso de dados legível por máquina.'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'15.5. Regulamenta a Lei Federal nº 14.129/2021 (Governo Digital) e divulga a normativa em seu portal?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Ministério Público, Defensoria, Consórcios e Estatais Dependentes e Independentes. A regulamentação da Lei Federal nº 14.129/2021 (Governo Digital) deve estar disponível em local de fácil acesso. A Lei nº 14.129/2021 estabelece regras para a transformação digital na administração pública, facilitando o uso de tecnologia para melhorar os serviços oferecidos ao cidadão. Ela incentiva a digitalização de processos, o compartilhamento seguro de dados entre órgãos públicos e a oferta de serviços online mais ágeis e acessíveis. Além disso, a lei prevê a transparência no uso de informações e a proteção de dados. Cada Poder ou órgão é responsável por regulamentar a Lei nº 14.129/2021, estabelecendo normas e diretrizes específicas para a implementação do Governo Digital conforme suas necessidades, f'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'15.6. Realiza e divulga resultados de pesquisas de satisfação?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'inciso IV, e 24, inciso II, da Lei 14.129/2021. Ministério Público, Defensoria, Consórcios e Estatais Dependentes e Independentes. Devem ser divulgados os resultados de pesquisas de satisfação aplicadas regularmente, como anualmente, semestralmente ou após cada interação relevante, para assegurar a efetiva participação dos usuários na avaliação dos serviços públicos, identificar lacunas e deficiências, e reorientar a prestação dos serviços. São exemplos de pesquisas de satisfação aquelas realizadas junto aos usuários das ouvidorias, as aplicadas ao término de cursos e treinamentos, e as conduzidas após o atendimento em unidades de serviço. MATRIZ ESPECÍFICA: PODER EXECUTIVO 16. Renúncias de Receitas'
FROM dbo.Secretarias s
WHERE s.Sigla = N'SEMAD';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'16.1. Divulga as desonerações tributárias concedidas e a fundamentação legal individualizada?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'art. 198, §3º, III, do Código Tributário Nacional. Neste critério, exige-se a especificação de todas as espécies de desonerações tributárias ou benefícios fiscais disponíveis aos contribuintes bem como as suas respectivas fundamentações legais que autorizaram. São exemplos de desonerações que resultem em renúncia de receita: anistia, remissão, subsídio, crédito presumido, isenções, alteração de alíquota ou modificação de base de cálculo.'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'16.2. Divulga os valores da renúncia fiscal prevista e realizada, por tipo ou espécie de benefício ou incentivo fiscal?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'inciso II, da LC nº 101/00 e art. 8º, II, do Decreto nº 10.540/20. Devem ser divulgados os valores previstos e os efetivamente renunciados em determinado período, identificando os montantes por espécie/tipo de benefício ou incentivo. Considera-se atualizada a informação quando os dados mais recentes se referirem ao ano anterior ao da consulta. Considera-se que existe histórico de informações quando os dados disponibilizados referirem-se, pelo menos, a 3 anos que antecedem ao da Possibilidade de gravar as informações em pelo menos um formato editável (em extensões do tipo txt, csv, odt, calc, rtf, json e outros). Para este critério, também se sugere a possibilidade de acesso automatizado por sistemas externos em formatos estruturados e legíveis por máquina. Exige-se para atendimento deste c'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'16.3. Identifica os beneficiários das desonerações tributárias (benefícios ou incentivos fiscais)?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'LC nº 101/00 e art. 8º, II, do Decreto nº 10.540/20. Devem ser divulgados os valores totais renunciados por beneficiários (nome e CNPJ); Considera-se atualizada a informação quando os dados mais recentes se referirem ao ano anterior ao da consulta. Considera-se que existe histórico de informações quando os dados disponibilizados referirem-se, pelo menos, a 3 anos que antecedem ao da Possibilidade de gravar as informações em pelo menos um formato editável (em extensões do tipo txt, csv, odt, calc, rtf, json e outros), dentro de um conjunto específico de informações. Para este critério, também se sugere a possibilidade de acesso automatizado por sistemas externos em formatos estruturados e legíveis por máquina. Exige-se para atendimento deste critério no mínimo filtro por exercício e benefic'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'16.4. Divulga informações sobre projetos de incentivo à cultura (incluindo esportivos), identificando os projetos aprovados, o respectivo beneficiário e o valor aprovado?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'inciso II, da LC nº 101/00 e art. 8º, II, do Decreto nº 10.540/20. Exige-se para o atendimento deste critério as seguintes informações relativos aos projetos culturais e esportivos aprovados e concedidos: Música nos bairros etc) Os exemplos mais recorrentes de renúncias fiscais são os das leis de incentivo à cultura e ao esporte, podendo ser federal, estadual ou municipal. No caso da União, a mais consagrada é a Lei Federal de Incentivo à Cultura, também conhecida por Lei Rouanet. Além das leis de incentivo, existem os fundos de apoio ao esporte ou à cultura. Devem ser disponibilizadas as informações tanto dos projetos financiados com recursos de benefícios tributários (captação junto a empresas) e os financiados e concedidos diretamente com recursos do orçamento do Ente. Considera-se atua'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'17.1. Identifica as emendas parlamentares recebidas, contendo informações sobre a origem, a forma de repasse, o tipo de emenda, o número da emenda, a autoria, o valor previsto e realizado, o obje',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'Interministerial ME/SEGOV nº 6.411/2021, art. 19; Nota Recomendatória Atricon nº 01/2022; Acórdão nº 518/2023 - TCU-Plenário. Exige-se para o atendimento a divulgação das seguintes informações das emendas recebidas pela entidade avaliada em seção própria do portal: convênio etc); Os Poderes Executivos Estaduais deverão demonstrar as emendas parlamentares de origem federal de que são beneficiários. Em relação às Prefeituras Municipais, deverão demonstrar as emendas parlamentares de origem federal e estadual de que são beneficiários. Em caso de não ocorrência de emendas de determinada origem, deve ser divulgada a informação, de forma explícita. Exemplo de declaração de um município que tenha recebido apenas emendas federais: “no exercício de 2024 não foram recebidos repasses financeiros via '
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'17.2. Demonstra a execução orçamentária e financeira oriunda das “emendas pix”?',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'105/2019), Portaria Interministerial ME/SEGOV nº 6.411/2021, art. 19; Nota Recomendatória Atricon nº 01/2022; Acórdão nº 518/2023 - TCU-Plenário, Portaria Conjunta MF/MPO/MGI/SRI-PR nº 1, de 1º de abril de 2024 Devem ser divulgadas em seção própria do portal transparência'
FROM dbo.Secretarias s
WHERE s.Sigla = N'CONTROLADORIA';

COMMIT;
-- Total: 199 critérios inseridos