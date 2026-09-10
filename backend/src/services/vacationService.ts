import { create, listByUser, listPending, findById, updateStatus } from '../repositories/vacationRepository.js';

function addDays(date: string, days: number) {
  const result = new Date(`${date}T00:00:00`);
  result.setDate(result.getDate() + days);
  return result.toISOString().slice(0, 10);
}

export function calculateEndDate(type: string, startDate: string) {
  const duration = type === '30_dias' ? 29 : type === '20_mais_10' ? 19 : 14;
  return addDays(startDate, duration);
}

export function getUserVacations(userId: number) {
  return listByUser(userId);
}

export function createVacation(userId: number, input: { type: string; startDate: string }) {
  const endDate = calculateEndDate(input.type, input.startDate);
  const protocol = `FER-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
  return create({ userId, protocol, type: input.type, startDate: input.startDate, endDate });
}

export function getPendingApprovals() {
  return listPending();
}

export function decideVacation(id: number, status: 'APROVADA' | 'NEGADA') {
  const vacation = findById(id);
  if (!vacation) return null;
  if (vacation.status !== 'PENDENTE') throw new Error('Solicitação já finalizada.');
  return updateStatus(id, status);
}
