# RH Digital

MVP acadêmico de uma plataforma digital para Gestão de Pessoas, com uma landing page pública e um portal de RH.

## Requisitos

- Node.js 20 ou superior
- npm 10 ou superior

## Instalação

Na raiz do projeto, instale as dependências de cada aplicação:

```bash
npm install --prefix backend
npm install --prefix frontend
```

Crie o arquivo de ambiente do backend a partir do exemplo. No PowerShell:

```powershell
Copy-Item backend/.env.example backend/.env
```

No macOS ou Linux:

```bash
cp backend/.env.example backend/.env
```

O frontend usa `http://localhost:3333/api` por padrão. Para apontar para outra API, crie `frontend/.env` com `VITE_API_URL`.

## Desenvolvimento

Na raiz do projeto, execute:

```bash
npm run dev
```

Esse comando inicia o backend e o frontend juntos. Encerre os dois processos com `Ctrl+C`.

- Landing page: <http://localhost:5173/>
- Portal de RH: <http://localhost:5173/portal>
- API: <http://localhost:3333/api>
- Health check: <http://localhost:3333/api/health>
- Swagger UI: <http://localhost:3333/api/docs>
- OpenAPI JSON: <http://localhost:3333/api/docs/openapi.json>

Também é possível iniciar cada parte separadamente com `npm run dev:backend` ou `npm run dev:frontend`.

## Primeiro acesso

No primeiro início, o backend cria o usuário de demonstração:

- E-mail: `gabriela@rhdigital.local`
- Senha: `123456`

Essas credenciais são para uso acadêmico.

## Estrutura

```text
backend/
  src/
    controllers/       # tratamento das requisições HTTP
    repositories/      # acesso ao SQLite
    routes/            # rotas da API
    services/          # regras de negócio
    types/             # tipos específicos dos módulos
frontend/
  src/
    pages/landingpage/ # página pública e estilos
    services/          # comunicação com a API
    types/             # tipos compartilhados da interface
landingpage/           # documentação da integração pública/contatos
scripts/dev.mjs        # inicia e encerra frontend e backend juntos
docs/                  # PRD e protótipo do sistema
```

A landing page e o CRUD de contatos fazem parte das aplicações principais. A página fica isolada em seu módulo no frontend; no backend, contatos têm rotas, controller, service, repository e tipos próprios. Ambos usam a API e a instância SQLite do projeto, sem um segundo servidor. A documentação específica está em [`landingpage/README.md`](landingpage/README.md).

## Comandos úteis

```bash
npm run build:backend
npm run build:frontend
```

Os mesmos comandos podem ser executados dentro de `backend` ou `frontend` com `npm run build`.

## API

A documentação interativa da API está disponível em `/api/docs` enquanto o backend estiver rodando. Use **Authorize** na interface para informar o JWT retornado por `POST /api/auth/login`; as rotas de férias e aprovações exigem esse token. As rotas de contatos são públicas.

- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/ferias`
- `POST /api/ferias`
- `GET /api/ferias/:id`
- `PATCH /api/ferias/:id`
- `DELETE /api/ferias/:id`
- `GET /api/aprovacoes`
- `PATCH /api/aprovacoes/:id`
- `GET /api/contatos`
- `GET /api/contatos/:id`
- `POST /api/contatos`
- `PATCH /api/contatos/:id`
- `DELETE /api/contatos/:id`

## Documentação

- [`docs/PRD.md`](docs/PRD.md): requisitos do produto.
- [`docs/sistema_rh-prototipo.html`](docs/sistema_rh-prototipo.html): protótipo visual.
- [`landingpage/README.md`](landingpage/README.md): integração da landing page e dos contatos.
