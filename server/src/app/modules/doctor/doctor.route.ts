import express from 'express';
import { DoctorControllers } from './doctor.controller';
import { DoctorValidation } from './doctor.validation';
import { checkAuth } from '../../middlewares/checkAuth';
import validateRequest from '../../middlewares/validateRequest';
import { Role } from '../user/user.interface';

const router = express.Router();

router.post(
  '/',
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  validateRequest(DoctorValidation.createDoctorValidationSchema),
  DoctorControllers.createDoctor
);

router.get('/', checkAuth(Role.SUPER_ADMIN, Role.ADMIN), DoctorControllers.getDoctors);

router.get('/:id', checkAuth(Role.SUPER_ADMIN, Role.ADMIN), DoctorControllers.getDoctor);

router.put(
  '/:id',
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  validateRequest(DoctorValidation.updateDoctorValidationSchema),
  DoctorControllers.updateDoctor
);

router.delete('/:id', checkAuth(Role.SUPER_ADMIN, Role.ADMIN), DoctorControllers.deleteDoctor);

router.get('/:id/patients', checkAuth(Role.SUPER_ADMIN, Role.ADMIN), DoctorControllers.getDoctorPatients);

router.post(
  '/:id/patients',
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  validateRequest(DoctorValidation.addPatientToDoctorValidationSchema),
  DoctorControllers.addPatientToDoctor
);

router.delete(
  '/:id/patients/:patientId',
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  DoctorControllers.removePatientFromDoctor
);

export const DoctorRoutes = router;
