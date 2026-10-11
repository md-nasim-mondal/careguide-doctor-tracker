import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { ContactServices } from './contact.service';

export const createContactInquiry = catchAsync(async (req: Request, res: Response) => {
  const contact = await ContactServices.createContactInquiry(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Contact inquiry submitted successfully',
    data: contact,
  });
});

export const getContactInquiries = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactServices.getContactInquiries(req.query as Record<string, string>);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Contact inquiries retrieved successfully',
    data: result,
  });
});

export const ContactControllers = {
  createContactInquiry,
  getContactInquiries,
};
