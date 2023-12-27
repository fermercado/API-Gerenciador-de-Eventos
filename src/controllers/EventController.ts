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
      if (events.length === 0) {
        return res.status(200).json({ message: 'No events found.' });
      }
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

export const deleteEvents = async (req: Request, res: Response) => {
  try {
    const { dayOfWeek } = req.query as { dayOfWeek: string };

    if (!dayOfWeek) {
      return res.status(400).json({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Day of the week is required.',
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
    if (!validDaysOfWeek.includes(dayOfWeek)) {
      return res.status(400).json({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Invalid day of the week.',
      });
    }

    const deletedEvents = await Event.deleteMany({
      userId: req.userId,
      dayOfWeek,
    });

    if (deletedEvents.deletedCount > 0) {
      return res.status(200).json({ message: 'Events deleted successfully.' });
    } else {
      return res.status(404).json({ message: 'No events found for deletion.' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const eventId = req.params.id;

    if (!eventId) {
      return res.status(400).json({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Event ID is required.',
      });
    }

    const event = await Event.findOne({ _id: eventId, userId: req.userId });

    if (!event) {
      return res.status(404).json({
        statusCode: 404,
        error: 'Not Found',
        message: 'Event not found.',
      });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'Something went wrong',
    });
  }
};

export const deleteEventById = async (req: Request, res: Response) => {
  try {
    const eventId = req.params.id;

    if (!eventId) {
      return res.status(400).json({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Event ID is required.',
      });
    }

    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      return res.status(404).json({
        statusCode: 404,
        error: 'Not Found',
        message: 'Event not found for deletion.',
      });
    }

    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'Something went wrong',
    });
  }
};
