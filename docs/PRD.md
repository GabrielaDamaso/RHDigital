# PRD — RH Digital

## 1. Visão geral

**RH Digital** é uma plataforma web acadêmica de Gestão de Pessoas, criada para centralizar serviços de RH e demonstrar um fluxo digital de solicitação e aprovação de férias.

O MVP funcional prioriza autenticação, solicitação de férias e aprovação das solicitações. As demais áreas do protótipo permanecem disponíveis como demonstração.

## 2. Objetivo do produto

Desenvolver uma aplicação web que centralize funcionalidades relacionadas à Gestão de Pessoas, proporcionando ao servidor uma experiência digital para consultar informações e solicitar serviços.

Fluxo principal do MVP:

**Login → Solicitação de férias → Análise pelo SGP → Aprovação/negação → Conclusão**

## 3. Objetivos do MVP

- Permitir login com e-mail e senha para usuários previamente cadastrados.
- Permitir solicitação de férias.
- Permitir consulta do histórico e status das solicitações.
- Permitir análise pelo SGP.
- Permitir aprovação ou negação de solicitações.
- Persistir dados funcionais em SQLite.
- Expor API REST separada do frontend.
- Implementar o frontend com React + Vite + TypeScript.

## 4. Escopo funcional

### 4.1 Autenticação

- Login com e-mail e senha.
- Validação das credenciais.
- Retorno de erro para credenciais inválidas.
- Manutenção de sessão autenticada.
- Logout.

### 4.2 Férias

- Consulta do saldo disponível.
- Seleção do período.
- Seleção da data de início.
- Revisão da solicitação.
- Confirmação da solicitação.
- Geração de protocolo.
- Consulta do histórico/status.

### 4.3 Aprovações

- Consulta de solicitações pendentes.
- Aprovação.
- Negação.
- Atualização do status.

## 5. Funcionalidades demonstrativas

Estas telas seguem o protótipo visual, mas não fazem parte do núcleo funcional do MVP:

- Dashboard.
- Contracheque.
- Licenças.
- Frequência.
- Servidores.
- Dados financeiros e indicadores.

Essas áreas podem utilizar arquivos mockados separados e não precisam ser persistidas no SQLite.

## 6. Fora de escopo

- Cadastro de novos usuários.
- Perfis, roles e permissões.
- Auditoria.
- Integrações institucionais reais.
- Integração com folha de pagamento.
- Integração com frequência.
- Notificações.
- Gestão completa de benefícios.
- Averbações.
- Teletrabalho.
- Banco de horas funcional.
- Regras avançadas de RH.
- Implementação específica de requisitos de LGPD.

## 7. Público e contextos de uso

### Servidor

Realiza login, consulta seu saldo e solicita férias.

### SGP

Consulta solicitações pendentes e realiza a decisão sobre elas.

**Observação:** o MVP não implementará controle real de roles/permissões. A distinção entre servidor e SGP existe como contexto de uso do fluxo.

## 8. Jornada principal

1. Usuário acessa o sistema.
2. Usuário informa e-mail e senha.
3. Sistema valida as credenciais.
4. Usuário acessa a aplicação.
5. Usuário acessa Férias.
6. Usuário seleciona o período e a data de início.
7. Sistema apresenta a revisão.
8. Usuário confirma.
9. Sistema persiste a solicitação.
10. Solicitação recebe status `PENDENTE` e protocolo.
11. SGP consulta as solicitações pendentes.
12. SGP aprova ou nega.
13. Sistema atualiza o status para `APROVADA` ou `NEGADA`.

## 9. Regras de negócio

### RN01 — Status

Status possíveis:

- `PENDENTE`
- `APROVADA`
- `NEGADA`

### RN02 — Fluxo

**Servidor → SGP → Concluído**

### RN03 — Protocolo

Toda solicitação deve possuir protocolo único.

### RN04 — Cálculo do período

No MVP funcional, será implementado apenas o primeiro período apresentado no protótipo: **30 dias**.

O backend calcula a data final a partir da data de início, considerando 30 dias corridos.

## 10. Modelo de dados inicial

### Usuário

| Campo | Tipo | Descrição |
|---|---|---|
| id | INTEGER | Identificador |
| name | TEXT | Nome |
| email | TEXT | E-mail de login |
| password_hash | TEXT | Senha armazenada em hash |
| created_at | TEXT | Data de criação |

### Solicitação de férias

| Campo | Tipo | Descrição |
|---|---|---|
| id | INTEGER | Identificador |
| user_id | INTEGER | Usuário solicitante |
| protocol | TEXT | Protocolo único |
| type | TEXT | Tipo do período |
| start_date | TEXT | Data inicial |
| end_date | TEXT | Data final |
| status | TEXT | Status da solicitação |
| requested_at | TEXT | Data da solicitação |

## 11. Arquitetura

```text
┌─────────────────────────────┐
│          Frontend           │
│ React + Vite + TypeScript   │
└──────────────┬──────────────┘
               │ HTTP / REST
               ▼
┌─────────────────────────────┐
│           Backend           │
│      Node.js + Express      │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│           SQLite            │
└─────────────────────────────┘
```

## 12. Contrato inicial da API

### POST `/api/auth/login`

Request:

```json
{
  "email": "usuario@email.com",
  "senha": "123456"
}
```

Response:

```json
{
  "token": "token-de-autenticacao",
  "usuario": {
    "id": 1,
    "nome": "Josiane Fatima de Souza",
    "email": "usuario@email.com"
  }
}
```

### GET `/api/auth/me`

Retorna o usuário autenticado.

### GET `/api/ferias`

Retorna as solicitações do usuário autenticado.

### POST `/api/ferias`

Request:

```json
{
  "type": "30_dias",
  "startDate": "2026-06-01"
}
```

Response:

```json
{
  "id": 1,
  "protocol": "FER-2026-000001",
  "type": "30_dias",
  "startDate": "2026-06-01",
  "endDate": "2026-06-30",
  "status": "PENDENTE"
}
```

### GET `/api/aprovacoes`

Retorna as solicitações pendentes.

### PATCH `/api/aprovacoes/:id`

Request:

```json
{
  "status": "APROVADA"
}
```

ou

```json
{
  "status": "NEGADA"
}
```

## 13. Mock data

As funcionalidades demonstrativas devem manter seus dados em arquivos separados, por exemplo:

```text
frontend/src/mocks/
├── contracheques.ts
├── frequencia.ts
├── licencas.ts
└── servidores.ts
```

## 14. Estrutura inicial do projeto

```text
rh-digital/
├── backend/
│   └── src/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       ├── services/
│       ├── repositories/
│       └── database/
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── types/
│       ├── mocks/
│       └── hooks/
├── docs/
│   ├── PRD.md
│   └── sistema_rh-prototipo.html
├── package.json
└── README.md
```

## 15. Critérios de aceite do MVP

- [ ] Frontend React + Vite + TypeScript configurado.
- [ ] Backend Node.js + Express + TypeScript configurado.
- [ ] Frontend e backend separados.
- [ ] API REST funcionando.
- [ ] SQLite configurado.
- [ ] Usuário previamente cadastrado consegue fazer login.
- [ ] Login inválido retorna erro.
- [ ] Usuário consegue criar solicitação de férias.
- [ ] Solicitação é persistida no SQLite.
- [ ] Solicitação recebe protocolo.
- [ ] Solicitação inicia como `PENDENTE`.
- [ ] Solicitação aparece em Aprovações.
- [ ] Solicitação pode ser aprovada ou negada.
- [ ] Status é atualizado.
- [ ] Histórico exibe a solicitação.
- [ ] Telas demonstrativas continuam acessíveis.

## 16. Evolução futura

Podem ser adicionados posteriormente controle de perfis, permissões, integrações, notificações, benefícios, frequência integrada, auditoria, relatórios e outros processos de RH. Esses itens não fazem parte do MVP atual.
