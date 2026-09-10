export type VacationStatus = 'PENDENTE' | 'APROVADA' | 'NEGADA';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

export interface VacationRequest {
  id: number;
  userId: number;
  protocol: string;
  type: string;
  startDate: string;
  endDate: string;
  status: VacationStatus;
  requestedAt: string;
}
