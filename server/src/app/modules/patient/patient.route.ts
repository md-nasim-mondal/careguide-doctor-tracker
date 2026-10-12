import express from 'express';
import { PatientControllers } from './patient.controller';
import { PatientValidation } from './patient.validation';
import { checkAuth } from '../../middlewares/checkAuth';
import validateRequest from '../../middlewares/validateRequest';
import { Role } from '../user/user.interface';

const router = express.Router();

router.post(
  '/',
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR),
  validateRequest(PatientValidation.createPatientValidationSchema),
  PatientControllers.createPatient
);

router.get('/conditions', checkAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR, Role.PATIENT), PatientControllers.getConditions);

router.get('/', checkAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR, Role.PATIENT), PatientControllers.getPatients);

router.get('/:id', checkAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR, Role.PATIENT), PatientControllers.getPatient);

router.put(
  '/:id',
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR),
  validateRequest(PatientValidation.updatePatientValidationSchema),
  PatientControllers.updatePatient
);

router.delete('/:id', checkAuth(Role.SUPER_ADMIN, Role.ADMIN), PatientControllers.deletePatient);

export const PatientRoutes = router;
