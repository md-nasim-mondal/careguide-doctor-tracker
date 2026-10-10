import { Schema, model } from 'mongoose';
import { IPatient } from './patient.interface';

const patientSchema = new Schema<IPatient>(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    condition: { type: String, required: true },
    doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  },
  {
    timestamps: true,
  },
);

export const Patient = model<IPatient>('Patient', patientSchema);
