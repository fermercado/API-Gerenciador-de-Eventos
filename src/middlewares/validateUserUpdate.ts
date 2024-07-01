import { Request, Response, NextFunction } from 'express';
import { updateUserValidationSchema } from '../validators/UpdateUserValidator';

export const validateUserUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await updateUserValidationSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (err: any) {
    return res.status(400).json({ errors: err.errors });
  }
};
