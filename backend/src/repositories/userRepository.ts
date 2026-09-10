import { db } from '../database/db.js';
import type { AuthUser } from '../types.js';

export function findUserByEmail(email: string) {
  return db
    .prepare('SELECT id, name, email, password_hash FROM users WHERE email = ?')
    .get(email) as { id: number; name: string; email: string; password_hash: string } | undefined;
}

export function findUserById(id: number): AuthUser | undefined {
  return db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(id) as AuthUser | undefined;
}
