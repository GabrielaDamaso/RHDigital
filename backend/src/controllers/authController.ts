import type { Request, Response } from 'express';
import { z } from 'zod';
import { login, me } from '../services/authService.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';

const loginSchema = z.object({ email: z.string().email(), senha: z.string().min(1) });

export function loginController(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
    return;
  }
  const result = login(parsed.data.email, parsed.data.senha);
  if (!result) {
    res.status(401).json({ message: 'E-mail ou senha inválidos.' });
    return;
  }
  res.json(result);
}

export function meController(req: AuthenticatedRequest, res: Response) {
  const user = me(req.userId!);
  if (!user) {
    res.status(404).json({ message: 'Usuário não encontrado.' });
    return;
  }
  res.json(user);
}
