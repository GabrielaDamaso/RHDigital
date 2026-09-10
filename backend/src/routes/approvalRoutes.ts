import { Router } from 'express';
import { decideApprovalController, listApprovalsController } from '../controllers/vacationController.js';
import { authMiddleware } from '../middleware/auth.js';

export const approvalRoutes = Router();
approvalRoutes.use(authMiddleware);
approvalRoutes.get('/', listApprovalsController);
approvalRoutes.patch('/:id', decideApprovalController);
