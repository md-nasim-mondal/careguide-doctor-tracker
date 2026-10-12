import express from 'express';
import { PatientControllers } from './patient.controller';
import { PatientValidation } from './patient.validation';
import { checkAuth } from '../../middlewares/checkAuth';
import validateRequest from '../../middlewares/validateRequest';
import { Role } from '../user/user.interface';

const router = express.Router();

router.post(
  '/',
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.SENDER),
  validateRequest(PatientValidation.createPatientValidationSchema),
  PatientControllers.createPatient
);

router.get('/conditions', checkAuth(...Object.values(Role)), PatientControllers.getConditions);

router.get('/', checkAuth(...Object.values(Role)), PatientControllers.getPatients);

router.get('/:id', checkAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.SENDER), PatientControllers.getPatient);

router.put(
  '/:id',
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.SENDER),
  validateRequest(PatientValidation.updatePatientValidationSchema),
  PatientControllers.updatePatient
);

router.delete('/:id', checkAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.SENDER), PatientControllers.deletePatient);

export const PatientRoutes = router;
