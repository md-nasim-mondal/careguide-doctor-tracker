import express from 'express';
import { createPatient, getPatients, updatePatient, deletePatient } from './patient.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../user/user.interface';

const router = express.Router();

router.post('/', checkAuth(Role.SUPER_ADMIN, Role.ADMIN), createPatient);
router.get('/', checkAuth(Role.SUPER_ADMIN, Role.ADMIN), getPatients);
router.put('/:id', checkAuth(Role.SUPER_ADMIN, Role.ADMIN), updatePatient);
router.delete('/:id', checkAuth(Role.SUPER_ADMIN, Role.ADMIN), deletePatient);

export const PatientRoutes = router;
