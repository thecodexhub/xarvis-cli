import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../utils/catch-async';
import { healthService } from '../services';

const getHealth = catchAsync(async (req: Request, res: Response) => {
  const currentHealth = await healthService.checkHealth();
  res.status(httpStatus.OK).send(currentHealth);
});

export { getHealth };
