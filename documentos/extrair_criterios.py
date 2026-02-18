"""
Extrai critérios numerados do PDF da Cartilha PNTP 2025
e gera um script SQL de inserção para dbo.Criterios
"""
import re
import sys

try:
    import pdfplumber
except ImportError:
    print("Instalando pdfplumber...")
    import subprocess
    subprocess.run([sys.executable, "-m", "pip", "install", "pdfplumber", "-q"])
    import pdfplumber

PDF_PATH = r"C:\Users\Francisco\Documents\TranspJardim\TranspJardim\documentos\Cartilha - PNTP- 2025.pdf"
OUTPUT_SQL = r"C:\Users\Francisco\Documents\TranspJardim\TranspJardim\documentos\seed_criterios.sql"
OUTPUT_TXT = r"C:\Users\Francisco\Documents\TranspJardim\TranspJardim\documentos\criterios_extraidos.txt"

# Padrão: número como 1.1, 2.3, 10.5 etc. no início da linha
CRITERIO_HEADER = re.compile(r'^(\d{1,2}\.\d{1,2})\s+(.+)$')

def extrair_texto_pdf(path, max_pages=None):
    textos = []
    with pdfplumber.open(path) as pdf:
        total = len(pdf.pages)
        limit = min(total, max_pages) if max_pages else total
        print(f"PDF com {total} páginas. Extraindo até página {limit}...", flush=True)
        for i, page in enumerate(pdf.pages[:limit]):
            txt = page.extract_text()
            if txt:
                textos.append(f"=== PÁGINA {i+1} ===\n{txt}")
            if (i+1) % 20 == 0:
                print(f"  Processadas {i+1}/{limit} páginas...", flush=True)
    return "\n".join(textos)

def limpar_linha(linha):
    # Remove múltiplos espaços e caracteres de controle
    linha = re.sub(r'\s+', ' ', linha).strip()
    return linha

def limpar_nome_criterio(nome):
    """Remove número de página no fim do nome (ex: 'Possui sítio? 44' -> 'Possui sítio?')"""
    # Remove número de página no final (1-3 dígitos após espaço no final)
    nome = re.sub(r'\s+\d{1,3}\s*$', '', nome).strip()
    # Remove caracteres especiais desnecessários
    nome = re.sub(r'[➢►•▪]', '', nome).strip()
    return nome

def extrair_criterios(texto_completo):
    """
    Percorre o texto e extrai blocos de critérios numerados.
    Retorna lista de dicts: {numero, nome, descricao}
    
    Trata nomes multi-linha: quando a linha do critério não termina com ? ou ),
    a próxima linha não-vazia (que não seja novo critério) é concatenada ao nome.
    """
    criterios = []
    linhas = texto_completo.split('\n')
    
    criterio_atual = None
    descricao_lines = []
    nome_incompleto = False  # Flag: nome do critério atual ainda não terminou
    
    skip_patterns = [
        r'^Fundamentação:', r'^Classificação:', r'^Aplicável a:',
        r'^Disponibilidade:', r'^Atualidade:', r'^Série Histórica:',
        r'^Gravação de Relatórios:', r'^Filtro de Pesquisa:',
        r'^Figura \d+', r'^Tabela \d+',
        r'^➢', r'^►', r'^•', r'^-\s'
    ]
    
    for linha in linhas:
        linha_limpa = limpar_linha(linha)
        if not linha_limpa:
            continue
        
        # Ignora linhas de página
        if linha_limpa.startswith('=== PÁGINA'):
            continue
        
        m = CRITERIO_HEADER.match(linha_limpa)
        if m:
            # Salva critério anterior
            if criterio_atual:
                criterio_atual['descricao'] = ' '.join(descricao_lines).strip()
                criterios.append(criterio_atual)
            
            numero = m.group(1)
            nome_raw = m.group(2).strip()
            nome = limpar_nome_criterio(nome_raw)
            
            # Verifica se o nome está incompleto (não termina com ? ) . : ou número de página removido)
            nome_incompleto = not re.search(r'[?):.]$|\d{1,3}$', nome_raw)
            
            criterio_atual = {
                'numero': numero,
                'nome': nome,
                'descricao': ''
            }
            descricao_lines = []
        elif criterio_atual and nome_incompleto:
            # Próxima linha provavelmente é continuação do nome do critério
            # Só completa se não parecer início de nova seção
            if not any(re.match(p, linha_limpa, re.IGNORECASE) for p in skip_patterns):
                if not CRITERIO_HEADER.match(linha_limpa):
                    # Concatena ao nome, limpando número de página no final
                    continuacao = limpar_nome_criterio(linha_limpa)
                    criterio_atual['nome'] = (criterio_atual['nome'] + ' ' + continuacao).strip()
                    # Agora verifica se o nome completo termina com ?
                    nome_incompleto = not re.search(r'[?)\.]$', criterio_atual['nome'])
        elif criterio_atual:
            # Coleta linhas de descrição
            if not any(re.match(p, linha_limpa, re.IGNORECASE) for p in skip_patterns):
                if len(linha_limpa) > 10:
                    descricao_lines.append(linha_limpa)
                    if len(descricao_lines) >= 5:
                        pass  # Acumula até 5 linhas de contexto
    
    # Último critério
    if criterio_atual:
        criterio_atual['descricao'] = ' '.join(descricao_lines[:5]).strip()
        criterios.append(criterio_atual)
    
    # Limita nome a 500 chars e descricao a 800
    for c in criterios:
        c['nome'] = c['nome'][:500]
        c['descricao'] = c['descricao'][:800]
    
    return criterios

# Mapeamento de categorias (número principal) para secretarias
# Baseado no contexto do município (Executivo Municipal)
SECRETARIA_MAP = {
    # 1 - Informações Prioritárias -> CONTROLADORIA (transparência geral)
    '1': 'CONTROLADORIA',
    # 2 - Informações Institucionais -> Administração (SEMAD)
    '2': 'SEMAD',
    # 3 - Receita -> CONTROLADORIA (finanças)
    '3': 'CONTROLADORIA',
    # 4 - Despesa -> CONTROLADORIA
    '4': 'CONTROLADORIA',
    # 5 - Convênios -> CONTROLADORIA
    '5': 'CONTROLADORIA',
    # 6 - Recursos Humanos -> SEMAD
    '6': 'SEMAD',
    # 7 - Diárias e Passagens -> SEMAD
    '7': 'SEMAD',
    # 8 - Licitações e Contratos -> CONTROLADORIA
    '8': 'CONTROLADORIA',
    # 9 - Contratos -> CONTROLADORIA
    '9': 'CONTROLADORIA',
    # 10 - Obras -> SEMAD
    '10': 'SEMAD',
    # 11 - Planejamento/Orçamento -> CONTROLADORIA
    '11': 'CONTROLADORIA',
    # 12 - SIC / Acesso à Informação -> CONTROLADORIA
    '12': 'CONTROLADORIA',
    # 13 - Acessibilidade -> SEMAD
    '13': 'SEMAD',
    # 14 - Ouvidoria -> SEMAD
    '14': 'SEMAD',
    # 15 - LGPD e Governo Digital -> SEMAD
    '15': 'SEMAD',
    # 16 - Renúncias de Receita -> CONTROLADORIA
    '16': 'CONTROLADORIA',
    # 17 - Emendas Parlamentares -> CONTROLADORIA
    '17': 'CONTROLADORIA',
    # 18 - Saúde -> SESAU
    '18': 'SESAU',
    # 19 - Educação -> SEDUC
    '19': 'SEDUC',
}

def obter_secretaria(numero):
    cat = numero.split('.')[0]
    return SECRETARIA_MAP.get(cat, 'CONTROLADORIA')

def classificar_tipo(numero):
    """Retorna Essencial, Obrigatória ou Recomendada baseado em padrões conhecidos do PNTP"""
    # Critérios essenciais conhecidos (1.1, 1.2, e alguns financeiros)
    essenciais = {'1.1', '1.2', '3.1', '4.1', '8.1', '11.1'}
    if numero in essenciais:
        return 'Essencial'
    return 'Obrigatória'

def escape_sql(s):
    return s.replace("'", "''") if s else ''

def gerar_sql(criterios):
    linhas_sql = []
    linhas_sql.append("-- Script de seed: Critérios PNTP 2025")
    linhas_sql.append("-- Gerado automaticamente a partir da Cartilha PNTP 2025")
    linhas_sql.append("-- Secretarias referenciadas: CONTROLADORIA, SEMAD, SEDUC, SESAU")
    linhas_sql.append("")
    linhas_sql.append("-- Inserir critérios vinculando às secretarias existentes")
    linhas_sql.append("BEGIN TRANSACTION;")
    linhas_sql.append("")

    for c in criterios:
        # Limita nome a 190 chars para caber em NVARCHAR(200) com o prefixo X.Y.
        nome_prefixado = f"{c['numero']}. {c['nome']}"
        nome_prefixado = nome_prefixado[:195]  # segurança
        nome = escape_sql(nome_prefixado)
        
        descricao_raw = c['descricao'][:800] if c['descricao'] else f"Critério PNTP {c['numero']}"
        if not descricao_raw.strip() or len(descricao_raw.strip()) < 5:
            descricao_raw = f"Critério PNTP {c['numero']} — {c['nome'][:100]}"
        descricao = escape_sql(descricao_raw)
        secretaria = obter_secretaria(c['numero'])
        
        # Usa Pascal Case conforme a tabela dbo.Criterios (Nome, Status, etc.)
        # CreatedAt e UpdatedAt têm DEFAULT SYSUTCDATETIME() na tabela
        # Busca secretaria pela Sigla (ex: 'CONTROLADORIA', 'SEMAD', etc.)
        sql = f"""INSERT INTO dbo.Criterios (Nome, Status, Periodicidade, SecretariaId, Responsavel, Descricao)
SELECT 
    N'{nome}',
    'Pendente',
    'Anual',
    s.Id,
    NULL,
    N'{descricao}'
FROM dbo.Secretarias s
WHERE s.Sigla = N'{secretaria}';"""
        linhas_sql.append(sql)
        linhas_sql.append("")
    
    linhas_sql.append("COMMIT;")
    linhas_sql.append(f"-- Total: {len(criterios)} critérios inseridos")
    return "\n".join(linhas_sql)

if __name__ == '__main__':
    print("Extraindo texto do PDF...", flush=True)
    # Extrai primeiras 180 páginas (contém os critérios 1-19 do Executivo Municipal)
    texto = extrair_texto_pdf(PDF_PATH, max_pages=180)
    
    print(f"\nTexto extraído: {len(texto)} caracteres", flush=True)
    
    print("Identificando critérios numerados...", flush=True)
    criterios_todos = extrair_criterios(texto)
    
    # Filtra apenas categorias 1-19 (Executivo Municipal)
    # Categorias 20+ são para Legislativo, Judiciário, TC, MP, etc.
    criterios = [c for c in criterios_todos if int(c['numero'].split('.')[0]) <= 19]
    
    print(f"Encontrados {len(criterios_todos)} critérios total, {len(criterios)} para Executivo Municipal (1-19)", flush=True)
    
    # Salva texto dos critérios extraídos para revisão
    with open(OUTPUT_TXT, 'w', encoding='utf-8') as f:
        for c in criterios:
            f.write(f"[{c['numero']}] {c['nome']}\n")
            f.write(f"  Secretaria: {obter_secretaria(c['numero'])}\n")
            f.write(f"  Desc: {c['descricao'][:200]}\n\n")
    
    print(f"Lista de critérios salva em: {OUTPUT_TXT}", flush=True)
    
    # Gera SQL
    sql_content = gerar_sql(criterios)
    with open(OUTPUT_SQL, 'w', encoding='utf-8') as f:
        f.write(sql_content)
    
    print(f"Script SQL salvo em: {OUTPUT_SQL}", flush=True)
    print("\nPrimeiros 10 critérios encontrados:")
    for c in criterios[:10]:
        print(f"  [{c['numero']}] {c['nome'][:80]}")
