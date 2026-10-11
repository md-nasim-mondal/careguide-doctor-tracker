import { IDoctor } from './doctor.interface';

export const doctorSearchableFields = ['name', 'specialization', 'hospital'];

export const doctorAllowedUpdateFields: (keyof IDoctor)[] = [
  'name',
  'specialization',
  'hospital',
  'phone',
  'email',
];
