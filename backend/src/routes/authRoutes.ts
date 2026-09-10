import { Router } from 'express';
import { loginController, meController } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

export const authRoutes = Router();
authRoutes.post('/login', loginController);
authRoutes.get('/me', authMiddleware, meController);
