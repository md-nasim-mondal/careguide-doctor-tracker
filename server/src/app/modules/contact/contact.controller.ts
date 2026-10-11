import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { Contact } from './contact.model';
import { sendResponse } from '../../utils/sendResponse';
import { QueryBuilder } from '../../utils/QueryBuilder';

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
  const contactQuery = new QueryBuilder(
    Contact.find(),
    req.query as Record<string, string>
  )
    .search(['name', 'hospital', 'email', 'topic'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const [inquiries, meta] = await Promise.all([
    contactQuery.build(),
    contactQuery.getMeta(),
  ]);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contact inquiries retrieved successfully',
    data: {
      inquiries,
      total: meta.total,
      page: meta.page,
      limit: meta.limit,
      totalPages: meta.totalPage,
    },
  });
});
