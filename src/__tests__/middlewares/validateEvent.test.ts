import { Request, Response, NextFunction } from 'express';
import {
  validateEventCreation,
  validateDayOfWeek,
} from '../../middlewares/validateEvent';
import { eventValidationSchema } from '../../validators/EventValidator';
import { ApplicationError } from '../../error/ApplicationError';

jest.mock('../../validators/EventValidator');

describe('validateEventCreation', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should validate event creation successfully', async () => {
    req.body = { description: 'Test Event', dayOfWeek: 'monday' };

    (eventValidationSchema.validate as jest.Mock).mockResolvedValue(req.body);

    await validateEventCreation(req as Request, res as Response, next);

    expect(eventValidationSchema.validate).toHaveBeenCalledWith(
      { description: 'Test Event', dayOfWeek: 'monday' },
      { abortEarly: false },
    );
    expect(next).toHaveBeenCalled();
  });

  it('should return 400 if validation fails with ValidationError', async () => {
    const validationError = {
      name: 'ValidationError',
      inner: [
        { path: 'description', message: 'Description is required' },
        { path: 'dayOfWeek', message: 'Day of the week is invalid' },
      ],
    };

    req.body = { description: '', dayOfWeek: '' };

    (eventValidationSchema.validate as jest.Mock).mockRejectedValue(
      validationError,
    );

    await validateEventCreation(req as Request, res as Response, next);

    expect(eventValidationSchema.validate).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      type: 'Validation Error',
      errors: [
        { field: 'description', message: 'Description is required' },
        { field: 'dayOfWeek', message: 'Day of the week is invalid' },
      ],
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next with ApplicationError if validation fails with non-ValidationError', async () => {
    const otherError = new Error('Other error');

    req.body = { description: 'Test Event', dayOfWeek: 'monday' };

    (eventValidationSchema.validate as jest.Mock).mockRejectedValue(otherError);

    await validateEventCreation(req as Request, res as Response, next);

    expect(eventValidationSchema.validate).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(
      new ApplicationError('Validation Error', 400),
    );
  });
});

describe('validateDayOfWeek', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      query: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should validate day of the week successfully', () => {
    req.query = { dayOfWeek: 'monday' };

    validateDayOfWeek(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
  });

  it('should return 400 if dayOfWeek is not provided', () => {
    validateDayOfWeek(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Invalid information',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if dayOfWeek is invalid', () => {
    req.query = { dayOfWeek: 'funday' };

    validateDayOfWeek(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Invalid day of the week.',
    });
    expect(next).not.toHaveBeenCalled();
  });
});
