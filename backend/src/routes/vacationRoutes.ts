import { Router } from 'express';
import { createVacationController, deleteVacationController, getVacationController, listVacationsController, updateVacationController } from '../controllers/vacationController.js';
import { authMiddleware } from '../middleware/auth.js';

export const vacationRoutes = Router();
vacationRoutes.use(authMiddleware);
vacationRoutes.get('/', listVacationsController);
vacationRoutes.post('/', createVacationController);
vacationRoutes.get('/:id', getVacationController);
vacationRoutes.patch('/:id', updateVacationController);
vacationRoutes.delete('/:id', deleteVacationController);
