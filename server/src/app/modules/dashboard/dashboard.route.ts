import express from 'express';
import { getDashboardAnalytics } from './dashboard.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../user/user.interface';

const router = express.Router();
router.get('/', checkAuth(Role.SUPER_ADMIN, Role.ADMIN), getDashboardAnalytics);
export const DashboardRoutes = router;
