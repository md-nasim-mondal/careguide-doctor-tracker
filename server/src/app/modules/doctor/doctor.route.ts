import express from 'express';
import { createDoctor, getDoctors, getDoctor, getDoctorPatients, addPatientToDoctor, removePatientFromDoctor } from './doctor.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../user/user.interface';

const router = express.Router();

router.post('/', checkAuth(Role.SUPER_ADMIN, Role.ADMIN), createDoctor);
router.get('/', checkAuth(Role.SUPER_ADMIN, Role.ADMIN), getDoctors);
router.get('/:id', checkAuth(Role.SUPER_ADMIN, Role.ADMIN), getDoctor);
router.get('/:id/patients', checkAuth(Role.SUPER_ADMIN, Role.ADMIN), getDoctorPatients);
router.post('/:id/patients', checkAuth(Role.SUPER_ADMIN, Role.ADMIN), addPatientToDoctor);
router.delete('/:id/patients/:patientId', checkAuth(Role.SUPER_ADMIN, Role.ADMIN), removePatientFromDoctor);

export const DoctorRoutes = router;
