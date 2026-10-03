import type { Request, Response } from 'express';
import { z } from 'zod';
import { createContact, deleteContact, getContact, getContacts, updateContact } from '../services/contactService.js';

const contactSchema = z.object({
  nome: z.string().trim().min(1),
  email: z.string().trim().email(),
  assunto: z.enum(['duvida', 'sugestao', 'informacao', 'outro']),
  mensagem: z.string().trim().min(1),
});

export function listContactsController(_req: Request, res: Response) {
  res.json(getContacts());
}

export function getContactController(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'Identificador inválido.' });
    return;
  }
  const contact = getContact(id);
  if (!contact) {
    res.status(404).json({ message: 'Mensagem não encontrada.' });
    return;
  }
  res.json(contact);
}

export function createContactController(req: Request, res: Response) {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Dados de contato inválidos.' });
    return;
  }
  res.status(201).json(createContact(parsed.data));
}

export function updateContactController(req: Request, res: Response) {
  const id = Number(req.params.id);
  const parsed = contactSchema.safeParse(req.body);
  if (!Number.isInteger(id) || id <= 0 || !parsed.success) {
    res.status(400).json({ message: 'Dados de contato inválidos.' });
    return;
  }
  const contact = updateContact(id, parsed.data);
  if (!contact) {
    res.status(404).json({ message: 'Mensagem não encontrada.' });
    return;
  }
  res.json(contact);
}

export function deleteContactController(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'Identificador inválido.' });
    return;
  }
  if (!deleteContact(id)) {
    res.status(404).json({ message: 'Mensagem não encontrada.' });
    return;
  }
  res.status(204).send();
}
