export type VacationType = '30_dias' | '20_mais_10' | '15_mais_15';
export type VacationStatus = 'PENDENTE' | 'APROVADA' | 'NEGADA';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface VacationRequest {
  id: number;
  userId: number;
  protocol: string;
  type: VacationType;
  startDate: string;
  endDate: string;
  status: VacationStatus;
  requestedAt: string;
  userName?: string;
}
