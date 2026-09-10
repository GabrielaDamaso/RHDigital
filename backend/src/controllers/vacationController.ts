import type { Response } from 'express';
import { z } from 'zod';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import { cancelVacation, createVacation, decideVacation, editVacation, getPendingApprovals, getUserVacations, getVacation } from '../services/vacationService.js';

const vacationSchema = z.object({
  type: z.enum(['30_dias', '20_mais_10', '15_mais_15']),
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

export function getVacationController(req: AuthenticatedRequest, res: Response) {
  const vacation = getVacation(req.userId!, Number(req.params.id));
  if (!vacation) {
    res.status(404).json({ message: 'Solicitação não encontrada.' });
    return;
  }
  res.json(vacation);
}

export function updateVacationController(req: AuthenticatedRequest, res: Response) {
  const id = Number(req.params.id);
  const parsed = vacationSchema.safeParse(req.body);
  if (!Number.isInteger(id) || !parsed.success) {
    res.status(400).json({ message: 'Dados de férias inválidos.' });
    return;
  }
  const result = editVacation(req.userId!, id, parsed.data);
  if (result.kind === 'not_found') {
    res.status(404).json({ message: 'Solicitação não encontrada.' });
    return;
  }
  if (result.kind === 'finalized') {
    res.status(409).json({ message: 'Solicitações finalizadas não podem ser editadas.' });
    return;
  }
  res.json(result.vacation);
}

export function deleteVacationController(req: AuthenticatedRequest, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ message: 'Identificador inválido.' });
    return;
  }
  const result = cancelVacation(req.userId!, id);
  if (result === 'not_found') {
    res.status(404).json({ message: 'Solicitação não encontrada.' });
    return;
  }
  if (result === 'finalized') {
    res.status(409).json({ message: 'Solicitações finalizadas não podem ser excluídas.' });
    return;
  }
  res.status(204).send();
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
