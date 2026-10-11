import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { PatientServices } from './patient.service';

export const createPatient = catchAsync(async (req: Request, res: Response) => {
  const patient = await PatientServices.createPatient(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Patient created',
    data: patient,
  });
});

export const getPatients = catchAsync(async (req: Request, res: Response) => {
  const result = await PatientServices.getAllPatients(req.query as Record<string, string>);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Patients fetched',
    data: result,
  });
});

export const getPatient = catchAsync(async (req: Request, res: Response) => {
  const patient = await PatientServices.getPatientById(req.params.id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Patient fetched',
    data: patient,
  });
});

export const updatePatient = catchAsync(async (req: Request, res: Response) => {
  const patient = await PatientServices.updatePatient(req.params.id as string, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Patient updated',
    data: patient,
  });
});

export const deletePatient = catchAsync(async (req: Request, res: Response) => {
  await PatientServices.deletePatient(req.params.id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Patient deleted',
    data: null,
  });
});

export const PatientControllers = {
  createPatient,
  getPatients,
  getPatient,
  updatePatient,
  deletePatient,
};
