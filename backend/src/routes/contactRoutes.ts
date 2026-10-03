import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getContactController,
  listContactsController,
  updateContactController,
} from '../controllers/contactController.js';

export const contactRoutes = Router();
contactRoutes.get('/', listContactsController);
contactRoutes.post('/', createContactController);
contactRoutes.get('/:id', getContactController);
contactRoutes.patch('/:id', updateContactController);
contactRoutes.delete('/:id', deleteContactController);
