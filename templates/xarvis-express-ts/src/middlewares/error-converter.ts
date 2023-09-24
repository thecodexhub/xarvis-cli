import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/api-error';
import httpStatus from 'http-status';

export const errorConverter = (err: Error, req: Request, res: Response, next: NextFunction) => {
  let apiError = err;

  if (!(err instanceof ApiError)) {
    const statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
    const message: string = err.message || httpStatus[statusCode] || 'Internal Server Error';
    apiError = new ApiError(statusCode, message);
  }

  next(apiError);
};
