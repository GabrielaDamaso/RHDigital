import bcrypt from 'bcryptjs';
import { db } from './db.js';

const email = 'gabriela@rhdigital.local';
const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email) as { id: number } | undefined;
const legacyUser = db.prepare('SELECT id FROM users WHERE email = ?').get('josiane@rhdigital.local') as { id: number } | undefined;

const passwordHash = bcrypt.hashSync('123456', 10);
if (legacyUser && !existing) {
  db.prepare(
    'UPDATE users SET name = ?, email = ?, password_hash = ? WHERE id = ?',
  ).run('Gabriela Damaso', email, passwordHash, legacyUser.id);
} else if (!existing) {
  db.prepare(
    'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
  ).run('Gabriela Damaso', email, passwordHash);
}
