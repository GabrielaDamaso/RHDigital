import type { Response } from 'express';
import { z } from 'zod';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import { createVacation, decideVacation, getPendingApprovals, getUserVacations } from '../services/vacationService.js';

const vacationSchema = z.object({
  type: z.literal('30_dias'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const decisionSchema = z.object({ status: z.enum(['APROVADA', 'NEGADA']) });

export function listVacationsController(req: AuthenticatedRequest, res: Response) {
  res.json(getUserVacations(req.userId!));
}

export function createVacationController(req: AuthenticatedRequest, res: Response) {
  const parsed = vacationSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Dados de férias inválidos.' });
    return;
  }
  res.status(201).json(createVacation(req.userId!, parsed.data));
}

export function listApprovalsController(_req: AuthenticatedRequest, res: Response) {
  res.json(getPendingApprovals());
}

export function decideApprovalController(req: AuthenticatedRequest, res: Response) {
  const id = Number(req.params.id);
  const parsed = decisionSchema.safeParse(req.body);
  if (!Number.isInteger(id) || !parsed.success) {
    res.status(400).json({ message: 'Dados de aprovação inválidos.' });
    return;
  }

  try {
    const result = decideVacation(id, parsed.data.status);
    if (!result) {
      res.status(404).json({ message: 'Solicitação não encontrada.' });
      return;
    }
    res.json(result);
  } catch (error) {
    res.status(409).json({ message: error instanceof Error ? error.message : 'Não foi possível atualizar.' });
  }
}
