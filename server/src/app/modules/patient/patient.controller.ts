import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { PatientServices } from './patient.service';

export const createPatient = catchAsync(async (req: Request, res: Response) => {
  const patient = await PatientServices.createPatient(req.body, req.user);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Patient created',
    data: patient,
  });
});

export const getPatients = catchAsync(async (req: Request, res: Response) => {
  const result = await PatientServices.getAllPatients(req.query as Record<string, string>, req.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Patients fetched',
    data: result,
  });
});

export const getPatient = catchAsync(async (req: Request, res: Response) => {
  const patient = await PatientServices.getPatientById(req.params.id as string, req.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Patient fetched',
    data: patient,
  });
});

export const updatePatient = catchAsync(async (req: Request, res: Response) => {
  const patient = await PatientServices.updatePatient(req.params.id as string, req.body, req.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Patient updated',
    data: patient,
  });
});

export const deletePatient = catchAsync(async (req: Request, res: Response) => {
  await PatientServices.deletePatient(req.params.id as string, req.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Patient deleted',
    data: null,
  });
});

export const getConditions = catchAsync(async (_req: Request, res: Response) => {
  const conditions = await PatientServices.getDistinctConditions();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Distinct conditions fetched',
    data: conditions,
  });
});

export const PatientControllers = {
  createPatient,
  getPatients,
  getPatient,
  updatePatient,
  deletePatient,
  getConditions,
};
