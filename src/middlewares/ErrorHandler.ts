/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import { ApplicationError } from '../error/ApplicationError';

export const errorHandler = (
  err: ApplicationError | Error,
  req: Request,
  res: Response,
  next: NextFunction,
): Response => {
  if (err instanceof ApplicationError) {
    return res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
    });
  }

  return res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
  });
};
