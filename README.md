# RH Digital

MVP acadêmico de uma plataforma digital para Gestão de Pessoas.

## Escopo atual

O primeiro incremento funcional contempla:

- login com usuário previamente cadastrado;
- solicitação de férias;
- consulta do histórico/status de férias;
- consulta de solicitações para aprovação;
- aprovação ou negação de férias;
- API REST separada do frontend;
- SQLite para persistência.

As demais telas do protótipo permanecem como demonstração e podem usar mocks.

## Stack

- Frontend: React + Vite + TypeScript
- Backend: Node.js + Express + TypeScript
- Banco: SQLite + better-sqlite3
- Autenticação: JWT
- Validação: Zod
- Qualidade: ESLint + Prettier

## Estrutura

```text
rh-digital/
├── backend/
├── frontend/
├── docs/
│   ├── PRD.md
│   └── sistema_rh-prototipo.html
├── package.json
└── README.md
```

## Requisitos

Node.js 20+ e npm 10+.

## Instalação

```bash
npm install
```

## Variáveis de ambiente

Copie `backend/.env.example` para `backend/.env`.

## Desenvolvimento

```bash
npm run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:3333`

## Usuário inicial

O backend cria um usuário de demonstração no primeiro start:

- E-mail: `gabriela@rhdigital.local`
- Senha: `123456`

Essas credenciais são apenas para o projeto acadêmico.

## API

- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/ferias`
- `POST /api/ferias`
- `GET /api/aprovacoes`
- `PATCH /api/aprovacoes/:id`

## Health check

`GET /api/health`

## Documentação

O PRD está em `docs/PRD.md`. O HTML original enviado para servir como referência visual está em `docs/sistema_rh-prototipo.html`.
