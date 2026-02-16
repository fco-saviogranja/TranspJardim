# TranspJardim (Azure)

Sistema web do TranspJardim com:

- `web/`: SPA React (Vite + TypeScript)
- `api/`: Node/Express servindo o build do `web` e expondo `/api/*`
- Persistência em Azure SQL com criação automática de schema no startup

## Rodar local

### 1) Instalar dependências

```powershell
npm install
```

### 2) API (modo local)

```powershell
$env:AUTH_MODE="local"
npm run dev:api
```

API em: `http://localhost:8080/api/healthz`

No modo local, o backend cria um usuário admin de desenvolvimento.
Credenciais padrão: `admin` / senha definida por `LOCAL_AUTH_DEFAULT_PASSWORD` (default: `admin`).

### 3) Frontend (dev server)

```powershell
npm run dev
```

Front em: `http://localhost:5173`

## Build e execução integrada

```powershell
npm run build
npm start
```

Abre: `http://localhost:8080`

## Qualidade

```powershell
npm run lint
npm test
```

## Variáveis de ambiente

### Obrigatórias em produção

- `NODE_ENV=production`
- `AUTH_MODE=easy-auth`
- `AZURE_SQL_CONNECTION_STRING=<connection string completa>`
- `ADMIN_EMAILS=email1@dominio.com,email2@dominio.com`

### Opcionais

- `LOCAL_AUTH_USERS_JSON=[{"username":"admin","password":"***","name":"Admin","email":"admin@local","role":"admin"}]`
- `LOCAL_AUTH_DEFAULT_PASSWORD=admin` (somente desenvolvimento)
- `LOCAL_SESSION_TTL_HOURS=12`
- `FORCE_SQL_IN_PRODUCTION=true`

## Autenticação

O backend suporta dois modos:

- `AUTH_MODE=local`: login por usuário/senha (dev/homologação local)
- `AUTH_MODE=easy-auth`: autenticação delegada ao Azure App Service Authentication

Com Easy Auth, a tela de login redireciona para `/.auth/login/aad`.

## Azure App Service (Web App)

### Deploy via GitHub Actions (recomendado)

Workflow pronto em `.github/workflows/azure-webapp-deploy.yml`.

Configure os secrets no GitHub:

- `AZURE_WEBAPP_NAME`: nome do Web App
- `AZURE_WEBAPP_PUBLISH_PROFILE`: publish profile XML (Portal Azure -> Web App -> Get publish profile)

Pipeline executa:

1. `npm ci`
2. `npm run lint`
3. `npm test`
4. `npm run build`
5. Deploy da pasta `api/` no App Service

### Configuração do Web App

- Stack: Node.js 20+
- Startup command: `npm start`
- Application settings:
  - `NODE_ENV=production`
  - `AUTH_MODE=easy-auth`
  - `AZURE_SQL_CONNECTION_STRING=...`
  - `ADMIN_EMAILS=...`

### Easy Auth no Portal Azure

1. Web App -> Authentication -> Add identity provider -> Microsoft
2. Habilite `Require authentication`
3. Salve

Observações importantes:

- Garanta que o App Registration do Microsoft Entra ID tenha Redirect URIs como:
  - `https://www.transpjardim.com/.auth/login/aad/callback`
  - `https://<seu-app>.azurewebsites.net/.auth/login/aad/callback` (útil para teste)
- Smoke test após habilitar:
  - Acesse `https://www.transpjardim.com/api/auth/session` (deve retornar `mode: easy-auth`)
  - Clique em "Entrar com Microsoft" e confirme que a mesma rota retorna `authenticated: true`

## Banco de dados

No startup, o backend cria automaticamente (se não existirem):

- `Users`
- `Secretarias`
- `Criterios`
- `Alertas`

Também faz seed inicial de secretarias e critério base.

## Domínio e SSL

1. Web App -> Custom domains -> Add custom domain
2. Criar os registros DNS solicitados (TXT + CNAME)
3. Ativar certificado gerenciado
4. Fazer TLS/SSL binding do domínio

## Checklist de go-live

1. Easy Auth habilitado e validado
2. `AZURE_SQL_CONNECTION_STRING` configurada
3. `ADMIN_EMAILS` configurado com os administradores reais
4. Pipeline GitHub verde (`lint`, `test`, `build`, deploy)
5. Smoke test em produção:
   - `/api/healthz`
   - login corporativo
   - CRUD de secretarias e critérios
   - painel de administração e usuários
