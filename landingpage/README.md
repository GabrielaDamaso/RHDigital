# Landing page e contatos

A landing page pública é servida pelo frontend principal na rota `/`. O formulário envia mensagens para a API e usa a mesma instância do backend e o mesmo banco SQLite do portal.

## Organização

- Página e estilos: `frontend/src/pages/landingpage/`
- Cliente HTTP e operações de contato: `frontend/src/services/api.ts`
- Tipos da interface: `frontend/src/types/contact.ts`
- API de contatos: `backend/src/routes/contactRoutes.ts`
- Controller, regras e persistência: `backend/src/controllers/contactController.ts`, `backend/src/services/contactService.ts` e `backend/src/repositories/contactRepository.ts`
- Tipos do backend: `backend/src/types/contact.ts`

O módulo da landing page fica separado das páginas do portal. O CRUD de contatos também fica separado por responsabilidade no backend; ele compartilha a infraestrutura existente de servidor e SQLite.

## Rotas de contato

- `GET /api/contatos` — lista mensagens
- `GET /api/contatos/:id` — consulta uma mensagem
- `POST /api/contatos` — cria uma mensagem
- `PATCH /api/contatos/:id` — atualiza uma mensagem
- `DELETE /api/contatos/:id` — exclui uma mensagem

Para instalar as dependências e iniciar frontend e backend juntos, siga as instruções do [README principal](../README.md).
