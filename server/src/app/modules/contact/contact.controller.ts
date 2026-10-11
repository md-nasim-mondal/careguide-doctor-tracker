import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { Contact } from './contact.model';
import { sendResponse } from '../../utils/sendResponse';

export const createContactInquiry = catchAsync(async (req: Request, res: Response) => {
  const contact = await Contact.create(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Contact inquiry submitted successfully',
    data: contact,
  });
});

export const getContactInquiries = catchAsync(async (req: Request, res: Response) => {
  const inquiries = await Contact.find().sort({ createdAt: -1 });
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contact inquiries retrieved successfully',
    data: inquiries,
  });
});
