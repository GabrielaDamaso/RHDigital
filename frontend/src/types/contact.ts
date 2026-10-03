export type ContactSubject = 'duvida' | 'sugestao' | 'informacao' | 'outro';

export interface ContactMessage {
  id: number;
  nome: string;
  email: string;
  assunto: ContactSubject;
  mensagem: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactPayload {
  nome: string;
  email: string;
  assunto: ContactSubject;
  mensagem: string;
}
