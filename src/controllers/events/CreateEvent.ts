import { Request, Response } from 'express';
import Event from '../../models/EventModel';
import { eventValidationSchema } from '../../validations/validations';

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { description, dayOfWeek } = req.body;

    await eventValidationSchema.validate(
      { description, dayOfWeek },
      { abortEarly: false },
    );

    if (!req.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    const event = await Event.create({
      description,
      dayOfWeek,
      userId: req.userId,
    });

    res.status(201).json(event);
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const validationErrors = error.inner.map((err: any) => ({
        field: err.path,
        message: err.message,
      }));
      return res.status(400).json({ errors: validationErrors });
    }

    console.error(error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Something went wrong while creating the event',
    });
  }
};
