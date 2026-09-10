import { Router } from 'express';
import { createVacationController, listVacationsController } from '../controllers/vacationController.js';
import { authMiddleware } from '../middleware/auth.js';

export const vacationRoutes = Router();
vacationRoutes.use(authMiddleware);
vacationRoutes.get('/', listVacationsController);
vacationRoutes.post('/', createVacationController);
