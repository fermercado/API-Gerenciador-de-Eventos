import { Request, Response, NextFunction } from 'express';
import { eventValidationSchema } from '../validators/EventValidator';
import { ApplicationError } from '../error/ApplicationError';

export const validateEventCreation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { description, dayOfWeek } = req.body;
    await eventValidationSchema.validate(
      { description, dayOfWeek },
      { abortEarly: false },
    );
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
    next(new ApplicationError('Validation Error', 400));
  }
};

export const validateDayOfWeek = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const dayOfWeek = (req.query.dayOfWeek as string) ?? '';

  if (!dayOfWeek) {
    return res.status(400).json({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Invalid information',
    });
  }

  const validDaysOfWeek = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  if (!validDaysOfWeek.includes(dayOfWeek.toLowerCase())) {
    return res.status(400).json({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Invalid day of the week.',
    });
  }

  next();
};
