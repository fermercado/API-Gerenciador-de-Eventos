import { Request, Response } from 'express';
import Event from '../models/EventModel';
import { eventValidationSchema } from '../validations/validations';

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { description, dayOfWeek } = req.body;

    await eventValidationSchema.validate(
      { description, dayOfWeek },
      { abortEarly: false },
    );

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

export const getEvents = async (req: Request, res: Response) => {
  try {
    const { dayOfWeek } = req.query;
    if (!dayOfWeek) {
      const events = await Event.find({ userId: req.userId });
      return res.status(200).json(events);
    }

    const filteredEvents = await Event.find({ userId: req.userId, dayOfWeek });

    if (filteredEvents.length === 0) {
      return res.status(200).json({ message: 'No events on this day.' });
    }

    res.status(200).json(filteredEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Something went wrong',
    });
  }
};
