import { db } from '../database/db.js';
import type { VacationRequest, VacationStatus } from '../types.js';

function mapRow(row: Record<string, unknown>): VacationRequest {
  return {
    id: Number(row.id),
    userId: Number(row.user_id),
    protocol: String(row.protocol),
    type: String(row.type),
    startDate: String(row.start_date),
    endDate: String(row.end_date),
    status: String(row.status) as VacationStatus,
    requestedAt: String(row.requested_at),
  };
}

export function listByUser(userId: number): VacationRequest[] {
  const rows = db
    .prepare('SELECT * FROM vacation_requests WHERE user_id = ? ORDER BY requested_at DESC')
    .all(userId) as Record<string, unknown>[];
  return rows.map(mapRow);
}

export function listPending(): (VacationRequest & { userName: string })[] {
  const rows = db
    .prepare(`
      SELECT vr.*, u.name AS user_name
      FROM vacation_requests vr
      JOIN users u ON u.id = vr.user_id
      WHERE vr.status = 'PENDENTE'
      ORDER BY vr.requested_at ASC
    `)
    .all() as Record<string, unknown>[];

  return rows.map((row) => ({ ...mapRow(row), userName: String(row.user_name) }));
}

export function findById(id: number): VacationRequest | undefined {
  const row = db.prepare('SELECT * FROM vacation_requests WHERE id = ?').get(id) as Record<string, unknown> | undefined;
  return row ? mapRow(row) : undefined;
}

export function create(input: {
  userId: number;
  protocol: string;
  type: string;
  startDate: string;
  endDate: string;
}): VacationRequest {
  const result = db
    .prepare(`
      INSERT INTO vacation_requests (user_id, protocol, type, start_date, end_date)
      VALUES (@userId, @protocol, @type, @startDate, @endDate)
    `)
    .run(input);
  return findById(Number(result.lastInsertRowid))!;
}

export function updateByUser(id: number, userId: number, input: { type: string; startDate: string; endDate: string }): VacationRequest | undefined {
  db.prepare(`
    UPDATE vacation_requests
    SET type = @type, start_date = @startDate, end_date = @endDate
    WHERE id = @id AND user_id = @userId
  `).run({ id, userId, ...input });
  return findById(id);
}

export function removeByUser(id: number, userId: number): boolean {
  const result = db.prepare('DELETE FROM vacation_requests WHERE id = ? AND user_id = ?').run(id, userId);
  return result.changes > 0;
}

export function updateStatus(id: number, status: VacationStatus): VacationRequest {
  db.prepare('UPDATE vacation_requests SET status = ? WHERE id = ?').run(status, id);
  return findById(id)!;
}
