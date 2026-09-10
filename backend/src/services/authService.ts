import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { findUserByEmail, findUserById } from '../repositories/userRepository.js';

export function login(email: string, password: string) {
  const user = findUserByEmail(email);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) return null;

  const token = jwt.sign({}, config.jwtSecret, { subject: String(user.id), expiresIn: '2h' });
  return {
    token,
    usuario: { id: user.id, nome: user.name, email: user.email },
  };
}

export function me(userId: number) {
  return findUserById(userId) ?? null;
}
