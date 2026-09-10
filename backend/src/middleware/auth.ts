import jwt from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';
import { config } from '../config.js';

export interface AuthenticatedRequest extends Request {
  userId?: number;
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const header = req.header('Authorization');
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Token não informado.' });
    return;
  }

  try {
    const token = header.slice('Bearer '.length);
    const payload = jwt.verify(token, config.jwtSecret) as { sub?: string };
    const userId = Number(payload.sub);
    if (!Number.isInteger(userId)) throw new Error('Token inválido');
    req.userId = userId;
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
}
