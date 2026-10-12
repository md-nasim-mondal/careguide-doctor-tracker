import { Schema, model } from 'mongoose';
import { IContact } from './contact.interface';

const contactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true },
    hospital: { type: String, required: true },
    email: { type: String, required: true },
    topic: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['pending', 'resolved'], default: 'pending' },
  },
  {
    timestamps: true,
  },
);

contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ email: 1 });
contactSchema.index({ createdAt: -1 });

export const Contact = model<IContact>('Contact', contactSchema);

