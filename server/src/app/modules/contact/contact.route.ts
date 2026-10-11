import { Router } from 'express';
import { ContactControllers } from './contact.controller';
import { ContactValidation } from './contact.validation';
import { checkAuth } from '../../middlewares/checkAuth';
import validateRequest from '../../middlewares/validateRequest';
import { Role } from '../user/user.interface';

export const ContactRoutes = Router();

ContactRoutes.post(
  '/',
  validateRequest(ContactValidation.createContactValidationSchema),
  ContactControllers.createContactInquiry
);

ContactRoutes.get('/', checkAuth(Role.SUPER_ADMIN, Role.ADMIN), ContactControllers.getContactInquiries);
