import { Types } from 'mongoose';

export interface IPatient {
  name: string;
  age: number;
  condition: string;
  doctor: Types.ObjectId;
  email?: string;
  phone?: string;
}
