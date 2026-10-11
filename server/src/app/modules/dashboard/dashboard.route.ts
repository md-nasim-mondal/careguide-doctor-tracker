import { Router } from 'express';
import { DashboardControllers } from './dashboard.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../user/user.interface';

const router = Router();

router.get('/analytics', checkAuth(Role.SUPER_ADMIN, Role.ADMIN), DashboardControllers.getDashboardAnalytics);

export const DashboardRoutes = router;
