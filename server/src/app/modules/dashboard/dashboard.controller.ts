import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { DashboardServices } from './dashboard.service';

export const getDashboardAnalytics = catchAsync(async (req: Request, res: Response) => {
  const result = await DashboardServices.getDashboardAnalytics();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Dashboard analytics fetched',
    data: result,
  });
});

export const DashboardControllers = {
  getDashboardAnalytics,
};
