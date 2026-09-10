import bcrypt from 'bcryptjs';
import { db } from './db.js';

const email = 'josiane@rhdigital.local';
const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email) as { id: number } | undefined;

if (!existing) {
  const passwordHash = bcrypt.hashSync('123456', 10);
  db.prepare(
    'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
  ).run('Josiane Fatima de Souza', email, passwordHash);
}
