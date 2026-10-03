import type { User, VacationRequest } from '../types';
import type { ContactMessage, ContactPayload } from '../types/contact';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333/api';

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('rh_token');
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const body = (await response.json().catch(() => null)) as T & { message?: string } | null;
  if (!response.ok) throw new Error(body?.message ?? 'Não foi possível concluir a operação.');
  return body as T;
}

export const authApi = {
  login: (email: string, senha: string) =>
    apiFetch<{ token: string; usuario: { id: number; nome: string; email: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    }),
  me: () => apiFetch<User>('/auth/me'),
};

export const vacationApi = {
  list: () => apiFetch<VacationRequest[]>('/ferias'),
  get: (id: number) => apiFetch<VacationRequest>(`/ferias/${id}`),
  create: (payload: { type: string; startDate: string }) =>
    apiFetch<VacationRequest>('/ferias', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id: number, payload: { type: string; startDate: string }) =>
    apiFetch<VacationRequest>(`/ferias/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  remove: (id: number) => apiFetch<void>(`/ferias/${id}`, { method: 'DELETE' }),
};

export const approvalApi = {
  list: () => apiFetch<VacationRequest[]>('/aprovacoes'),
  decide: (id: number, status: 'APROVADA' | 'NEGADA') =>
    apiFetch<VacationRequest>(`/aprovacoes/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
};

export const contactApi = {
  list: () => apiFetch<ContactMessage[]>('/contatos'),
  get: (id: number) => apiFetch<ContactMessage>(`/contatos/${id}`),
  create: (payload: ContactPayload) =>
    apiFetch<ContactMessage>('/contatos', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id: number, payload: ContactPayload) =>
    apiFetch<ContactMessage>(`/contatos/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  remove: (id: number) => apiFetch<void>(`/contatos/${id}`, { method: 'DELETE' }),
};
