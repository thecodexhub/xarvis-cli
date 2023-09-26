import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/api-error';
import config from '../config/config';

export const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode, message } = err;
  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.env === 'development' && { stack: err.stack }),
  };

  res.status(statusCode).send(response);
};
