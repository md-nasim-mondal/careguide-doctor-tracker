import { Types } from 'mongoose';

export interface IDoctor {
  _id?: Types.ObjectId;
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
}

