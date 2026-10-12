import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { DoctorServices } from './doctor.service';

export const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const doctor = await DoctorServices.createDoctor(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Doctor created',
    data: doctor,
  });
});

export const getDoctors = catchAsync(async (req: Request, res: Response) => {
  const result = await DoctorServices.getAllDoctors(req.query as Record<string, string>);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Doctors fetched',
    data: result,
  });
});

export const getDoctor = catchAsync(async (req: Request, res: Response) => {
  const doctor = await DoctorServices.getDoctorById(req.params.id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Doctor fetched',
    data: doctor,
  });
});

export const getDoctorPatients = catchAsync(async (req: Request, res: Response) => {
  const patients = await DoctorServices.getDoctorPatients(req.params.id as string, req.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Patients fetched',
    data: patients,
  });
});

export const addPatientToDoctor = catchAsync(async (req: Request, res: Response) => {
  const patient = await DoctorServices.addPatientToDoctor(req.params.id as string, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Patient added to doctor',
    data: patient,
  });
});

export const removePatientFromDoctor = catchAsync(async (req: Request, res: Response) => {
  await DoctorServices.removePatientFromDoctor(req.params.id as string, req.params.patientId as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Patient removed from doctor',
    data: null,
  });
});

export const updateDoctor = catchAsync(async (req: Request, res: Response) => {
  const doctor = await DoctorServices.updateDoctor(req.params.id as string, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Doctor updated',
    data: doctor,
  });
});

export const deleteDoctor = catchAsync(async (req: Request, res: Response) => {
  await DoctorServices.deleteDoctor(req.params.id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Doctor deleted',
    data: null,
  });
});

export const DoctorControllers = {
  createDoctor,
  getDoctors,
  getDoctor,
  getDoctorPatients,
  addPatientToDoctor,
  removePatientFromDoctor,
  updateDoctor,
  deleteDoctor,
};
