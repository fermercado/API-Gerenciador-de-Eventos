import { Request, Response, NextFunction } from 'express';
import { validateUserUpdate } from '../../middlewares/validateUserUpdate';
import { updateUserValidationSchema } from '../../validators/UpdateUserValidator';

jest.mock('../../validators/UpdateUserValidator');

describe('validateUserUpdate', () => {
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

  it('should call next if validation passes', async () => {
    (updateUserValidationSchema.validate as jest.Mock).mockResolvedValue({});

    req.body = {
      firstName: 'John',
      lastName: 'Doe',
      birthDate: '01/01/1990',
      city: 'City',
      country: 'Country',
      email: 'john.doe@example.com',
    };

    await validateUserUpdate(req as Request, res as Response, next);

    expect(updateUserValidationSchema.validate).toHaveBeenCalledWith(req.body, {
      abortEarly: false,
    });
    expect(next).toHaveBeenCalled();
  });

  it('should return 400 if validation fails', async () => {
    const validationError = {
      errors: ['Invalid email format'],
    };
    (updateUserValidationSchema.validate as jest.Mock).mockRejectedValue(
      validationError,
    );

    req.body = {
      email: 'invalid-email',
    };

    await validateUserUpdate(req as Request, res as Response, next);

    expect(updateUserValidationSchema.validate).toHaveBeenCalledWith(req.body, {
      abortEarly: false,
    });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ errors: ['Invalid email format'] });
    expect(next).not.toHaveBeenCalled();
  });
});
