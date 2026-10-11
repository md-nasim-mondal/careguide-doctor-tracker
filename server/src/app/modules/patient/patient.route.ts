import express from 'express';
import { PatientControllers } from './patient.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../user/user.interface';

const router = express.Router();

router.post('/', checkAuth(Role.SUPER_ADMIN, Role.ADMIN), PatientControllers.createPatient);
router.get('/', checkAuth(Role.SUPER_ADMIN, Role.ADMIN), PatientControllers.getPatients);
router.get('/:id', checkAuth(Role.SUPER_ADMIN, Role.ADMIN), PatientControllers.getPatient);
router.put('/:id', checkAuth(Role.SUPER_ADMIN, Role.ADMIN), PatientControllers.updatePatient);
router.delete('/:id', checkAuth(Role.SUPER_ADMIN, Role.ADMIN), PatientControllers.deletePatient);

export const PatientRoutes = router;
