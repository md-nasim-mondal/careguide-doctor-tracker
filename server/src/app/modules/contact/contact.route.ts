import { Router } from 'express';
import { ContactControllers } from './contact.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../user/user.interface';

export const ContactRoutes = Router();

ContactRoutes.post('/', ContactControllers.createContactInquiry);
ContactRoutes.get('/', checkAuth(Role.SUPER_ADMIN, Role.ADMIN), ContactControllers.getContactInquiries);
