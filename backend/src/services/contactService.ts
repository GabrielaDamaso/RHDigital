import { create, findById, list, remove, update } from '../repositories/contactRepository.js';
import type { ContactPayload } from '../types/contact.js';

export function getContacts() {
  return list();
}

export function getContact(id: number) {
  return findById(id);
}

export function createContact(input: ContactPayload) {
  return create(input);
}

export function updateContact(id: number, input: ContactPayload) {
  return update(id, input);
}

export function deleteContact(id: number) {
  return remove(id);
}
