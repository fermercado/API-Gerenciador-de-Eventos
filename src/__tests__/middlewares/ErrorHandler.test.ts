import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../../middlewares/ErrorHandler';
import { ApplicationError } from '../../error/ApplicationError';

describe('errorHandler', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should handle ApplicationError and return the correct response', () => {
    const error = new ApplicationError('Test ApplicationError', 400);

    errorHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'ApplicationError',
      message: 'Test ApplicationError',
    });
  });

  it('should handle generic Error and return the correct response', () => {
    const error = new Error('Test generic error');

    errorHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Internal Server Error',
      message: 'Test generic error',
    });
  });
});
