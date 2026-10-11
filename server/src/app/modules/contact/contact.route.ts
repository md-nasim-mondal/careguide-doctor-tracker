import { Router } from 'express';
import { createContactInquiry, getContactInquiries } from './contact.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../user/user.interface';

export const ContactRoutes = Router();

ContactRoutes.post('/', createContactInquiry);
ContactRoutes.get('/', checkAuth(Role.SUPER_ADMIN, Role.ADMIN), getContactInquiries);
