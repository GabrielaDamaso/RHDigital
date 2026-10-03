export const openApiDocument = {
  openapi: '3.1.0',
  info: {
    title: 'RH Digital API',
    version: '1.0.0',
    description:
      'API do RH Digital. As operações de férias e aprovações exigem um token JWT. O CRUD público de contatos não exige autenticação.',
  },
  servers: [{ url: 'http://localhost:3333', description: 'Servidor local (ajuste conforme PORT)' }],
  tags: [
    { name: 'Health', description: 'Estado da API' },
    { name: 'Autenticação', description: 'Login e usuário autenticado' },
    { name: 'Férias', description: 'Solicitações de férias do usuário autenticado' },
    { name: 'Aprovações', description: 'Consulta e decisão de solicitações pendentes' },
    { name: 'Contatos', description: 'Mensagens enviadas pelo formulário público' },
  ],
  paths: {
    '/api/health': {
      get: {
        tags: ['Health'],
        summary: 'Verifica se a API está disponível',
        responses: {
          '200': {
            description: 'API disponível',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Health' } } },
          },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Autenticação'],
        summary: 'Inicia uma sessão',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginInput' } } },
        },
        responses: {
          '200': {
            description: 'Login realizado',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginResult' } } },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '401': { description: 'E-mail ou senha inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/auth/me': {
      get: {
        tags: ['Autenticação'],
        summary: 'Retorna os dados do usuário autenticado',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Usuário autenticado',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { description: 'Usuário não encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/ferias': {
      get: {
        tags: ['Férias'],
        summary: 'Lista as solicitações do usuário autenticado',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Lista de solicitações',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/VacationRequest' } } } },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        tags: ['Férias'],
        summary: 'Cria uma solicitação de férias',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/VacationInput' } } },
        },
        responses: {
          '201': {
            description: 'Solicitação criada',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/VacationRequest' } } },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/ferias/{id}': {
      parameters: [{ $ref: '#/components/parameters/Id' }],
      get: {
        tags: ['Férias'],
        summary: 'Consulta uma solicitação do usuário autenticado',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Solicitação encontrada',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/VacationRequest' } } },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { description: 'Solicitação não encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      patch: {
        tags: ['Férias'],
        summary: 'Edita uma solicitação ainda pendente',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/VacationInput' } } },
        },
        responses: {
          '200': {
            description: 'Solicitação atualizada',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/VacationRequest' } } },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { description: 'Solicitação não encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          '409': { description: 'Solicitações finalizadas não podem ser editadas', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      delete: {
        tags: ['Férias'],
        summary: 'Cancela uma solicitação ainda pendente',
        security: [{ bearerAuth: [] }],
        responses: {
          '204': { description: 'Solicitação cancelada' },
          '400': { $ref: '#/components/responses/BadRequest' },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { description: 'Solicitação não encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          '409': { description: 'Solicitações finalizadas não podem ser excluídas', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/aprovacoes': {
      get: {
        tags: ['Aprovações'],
        summary: 'Lista solicitações pendentes',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Solicitações pendentes',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/PendingApproval' } } } },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/aprovacoes/{id}': {
      parameters: [{ $ref: '#/components/parameters/Id' }],
      patch: {
        tags: ['Aprovações'],
        summary: 'Aprova ou nega uma solicitação pendente',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ApprovalDecision' } } },
        },
        responses: {
          '200': {
            description: 'Decisão registrada',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/VacationRequest' } } },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { description: 'Solicitação não encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          '409': { description: 'Solicitação já finalizada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/contatos': {
      get: {
        tags: ['Contatos'],
        summary: 'Lista mensagens de contato',
        responses: {
          '200': {
            description: 'Mensagens ordenadas da mais recente para a mais antiga',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/ContactMessage' } } } },
          },
        },
      },
      post: {
        tags: ['Contatos'],
        summary: 'Registra uma mensagem de contato',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ContactInput' } } },
        },
        responses: {
          '201': {
            description: 'Mensagem registrada',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ContactMessage' } } },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
        },
      },
    },
    '/api/contatos/{id}': {
      parameters: [{ $ref: '#/components/parameters/Id' }],
      get: {
        tags: ['Contatos'],
        summary: 'Consulta uma mensagem de contato',
        responses: {
          '200': {
            description: 'Mensagem encontrada',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ContactMessage' } } },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '404': { description: 'Mensagem não encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      patch: {
        tags: ['Contatos'],
        summary: 'Atualiza uma mensagem de contato',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ContactInput' } } },
        },
        responses: {
          '200': {
            description: 'Mensagem atualizada',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ContactMessage' } } },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '404': { description: 'Mensagem não encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      delete: {
        tags: ['Contatos'],
        summary: 'Exclui uma mensagem de contato',
        responses: {
          '204': { description: 'Mensagem excluída' },
          '400': { $ref: '#/components/responses/BadRequest' },
          '404': { description: 'Mensagem não encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', description: 'Token retornado por POST /api/auth/login' },
    },
    parameters: {
      Id: {
        name: 'id',
        in: 'path',
        required: true,
        description: 'Identificador numérico do registro',
        schema: { type: 'integer', minimum: 1 },
      },
    },
    responses: {
      BadRequest: {
        description: 'Corpo da requisição ou identificador inválido',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
      },
      Unauthorized: {
        description: 'Token ausente, inválido ou expirado',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
      },
    },
    schemas: {
      Health: {
        type: 'object',
        properties: { status: { type: 'string', example: 'ok' } },
        required: ['status'],
      },
      Error: {
        type: 'object',
        properties: { message: { type: 'string', example: 'Dados inválidos.' } },
        required: ['message'],
      },
      LoginInput: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email', example: 'gabriela@rhdigital.local' },
          senha: { type: 'string', minLength: 1, example: '123456' },
        },
        required: ['email', 'senha'],
      },
      LoginResult: {
        type: 'object',
        properties: {
          token: { type: 'string', description: 'JWT com validade de duas horas' },
          usuario: { $ref: '#/components/schemas/LoginUser' },
        },
        required: ['token', 'usuario'],
      },
      LoginUser: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          nome: { type: 'string' },
          email: { type: 'string', format: 'email' },
        },
        required: ['id', 'nome', 'email'],
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
        },
        required: ['id', 'name', 'email'],
      },
      VacationInput: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['30_dias', '20_mais_10', '15_mais_15'] },
          startDate: { type: 'string', format: 'date', example: '2026-12-01' },
        },
        required: ['type', 'startDate'],
      },
      VacationRequest: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          userId: { type: 'integer' },
          protocol: { type: 'string', example: 'FER-2026-123456' },
          type: { type: 'string', enum: ['30_dias', '20_mais_10', '15_mais_15'] },
          startDate: { type: 'string', format: 'date' },
          endDate: { type: 'string', format: 'date' },
          status: { type: 'string', enum: ['PENDENTE', 'APROVADA', 'NEGADA'] },
          requestedAt: { type: 'string', example: '2026-05-01 12:00:00' },
        },
        required: ['id', 'userId', 'protocol', 'type', 'startDate', 'endDate', 'status', 'requestedAt'],
      },
      PendingApproval: {
        allOf: [
          { $ref: '#/components/schemas/VacationRequest' },
          {
            type: 'object',
            properties: { userName: { type: 'string' } },
            required: ['userName'],
          },
        ],
      },
      ApprovalDecision: {
        type: 'object',
        properties: { status: { type: 'string', enum: ['APROVADA', 'NEGADA'] } },
        required: ['status'],
      },
      ContactInput: {
        type: 'object',
        properties: {
          nome: { type: 'string', minLength: 1, example: 'Gabriela' },
          email: { type: 'string', format: 'email', example: 'gabriela@email.com' },
          assunto: { type: 'string', enum: ['duvida', 'sugestao', 'informacao', 'outro'] },
          mensagem: { type: 'string', minLength: 1, example: 'Gostaria de saber mais sobre o projeto.' },
        },
        required: ['nome', 'email', 'assunto', 'mensagem'],
      },
      ContactMessage: {
        allOf: [
          { $ref: '#/components/schemas/ContactInput' },
          {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              createdAt: { type: 'string', example: '2026-05-01 12:00:00' },
              updatedAt: { type: 'string', example: '2026-05-01 12:00:00' },
            },
            required: ['id', 'createdAt', 'updatedAt'],
          },
        ],
      },
    },
  },
} as const;
