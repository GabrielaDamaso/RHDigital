import { db } from '../database/db.js';
import type { ContactMessage, ContactPayload, ContactSubject } from '../types/contact.js';

function mapRow(row: Record<string, unknown>): ContactMessage {
  return {
    id: Number(row.id),
    nome: String(row.nome),
    email: String(row.email),
    assunto: String(row.assunto) as ContactSubject,
    mensagem: String(row.mensagem),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export function list(): ContactMessage[] {
  const rows = db
    .prepare('SELECT * FROM contact_messages ORDER BY created_at DESC, id DESC')
    .all() as Record<string, unknown>[];
  return rows.map(mapRow);
}

export function findById(id: number): ContactMessage | undefined {
  const row = db.prepare('SELECT * FROM contact_messages WHERE id = ?').get(id) as
    | Record<string, unknown>
    | undefined;
  return row ? mapRow(row) : undefined;
}

export function create(input: ContactPayload): ContactMessage {
  const result = db
    .prepare(`
      INSERT INTO contact_messages (nome, email, assunto, mensagem)
      VALUES (@nome, @email, @assunto, @mensagem)
    `)
    .run(input);
  return findById(Number(result.lastInsertRowid))!;
}

export function update(id: number, input: ContactPayload): ContactMessage | undefined {
  const result = db
    .prepare(`
      UPDATE contact_messages
      SET nome = @nome, email = @email, assunto = @assunto,
          mensagem = @mensagem, updated_at = CURRENT_TIMESTAMP
      WHERE id = @id
    `)
    .run({ id, ...input });
  return result.changes > 0 ? findById(id) : undefined;
}

export function remove(id: number): boolean {
  const result = db.prepare('DELETE FROM contact_messages WHERE id = ?').run(id);
  return result.changes > 0;
}
