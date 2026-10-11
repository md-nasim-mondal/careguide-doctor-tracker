import { Schema, model } from 'mongoose';
import { IPatient } from './patient.interface';

const patientSchema = new Schema<IPatient>(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    condition: { type: String, required: true },
    doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true, index: true },
  },
  {
    timestamps: true,
  },
);

patientSchema.index({ createdAt: -1 });
patientSchema.index({ name: 1 });
patientSchema.index({ condition: 1 });

export const Patient = model<IPatient>('Patient', patientSchema);

