import { Request, Response, NextFunction } from 'express';
import { userValidationSchema } from '../validators/UserValidator';

export const validateUserCreation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await userValidationSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const validationErrors = error.inner.map((err: any) => ({
        field: err.path,
        message: err.message,
      }));
      return res.status(400).json({
        type: 'Validation Error',
        errors: validationErrors,
      });
    }
    next(error);
  }
};
