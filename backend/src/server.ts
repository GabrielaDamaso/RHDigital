import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import './database/seed.js';
import { authRoutes } from './routes/authRoutes.js';
import { vacationRoutes } from './routes/vacationRoutes.js';
import { approvalRoutes } from './routes/approvalRoutes.js';
import { contactRoutes } from './routes/contactRoutes.js';
import swaggerUi from 'swagger-ui-express';
import { openApiDocument } from './docs/openapi.js';

const app = express();
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.get('/api/docs/openapi.json', (_req, res) => res.json(openApiDocument));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.use('/api/auth', authRoutes);
app.use('/api/ferias', vacationRoutes);
app.use('/api/aprovacoes', approvalRoutes);
app.use('/api/contatos', contactRoutes);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ message: 'Erro interno do servidor.' });
});

app.listen(config.port, () => {
  console.log(`RH Digital API disponível em http://localhost:${config.port}`);
});
