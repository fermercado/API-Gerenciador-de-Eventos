import { Request, Response, NextFunction } from 'express';
import { validateUserCreation } from '../../middlewares/validateUserCreation';
import { userValidationSchema } from '../../validators/UserValidator';

jest.mock('../../validators/UserValidator');

describe('validateUserCreation', () => {
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
    (userValidationSchema.validate as jest.Mock).mockResolvedValue({});

    req.body = {
      firstName: 'John',
      lastName: 'Doe',
      birthDate: '01/01/1990',
      city: 'City',
      country: 'Country',
      email: 'john.doe@example.com',
      password: 'password',
      confirmPassword: 'password',
    };

    await validateUserCreation(req as Request, res as Response, next);

    expect(userValidationSchema.validate).toHaveBeenCalledWith(req.body, {
      abortEarly: false,
    });
    expect(next).toHaveBeenCalled();
  });

  it('should return 400 if validation fails', async () => {
    const validationError = {
      name: 'ValidationError',
      inner: [{ path: 'email', message: 'Invalid email format' }],
    };
    (userValidationSchema.validate as jest.Mock).mockRejectedValue(
      validationError,
    );

    req.body = {
      email: 'invalid-email',
    };

    await validateUserCreation(req as Request, res as Response, next);

    expect(userValidationSchema.validate).toHaveBeenCalledWith(req.body, {
      abortEarly: false,
    });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      type: 'Validation Error',
      errors: [{ field: 'email', message: 'Invalid email format' }],
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next with error if non-validation error occurs', async () => {
    const nonValidationError = new Error('Some error');
    (userValidationSchema.validate as jest.Mock).mockRejectedValue(
      nonValidationError,
    );

    req.body = {
      email: 'test@example.com',
    };

    await validateUserCreation(req as Request, res as Response, next);

    expect(userValidationSchema.validate).toHaveBeenCalledWith(req.body, {
      abortEarly: false,
    });
    expect(next).toHaveBeenCalledWith(nonValidationError);
  });
});
