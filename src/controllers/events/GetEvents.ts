import { Request, Response } from 'express';
import Event from '../../models/EventModel';

interface Query {
  description?: { $regex: string; $options: 'i' };
  dayOfWeek?: string;
}

export const getEvents = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Not authenticated',
      });
    }

    const { description, dayOfWeek } = req.query;

    const query: Query = {};

    if (description) {
      query.description = { $regex: description as string, $options: 'i' };
    }

    if (dayOfWeek) {
      query.dayOfWeek = dayOfWeek as string;
    }

    const events = await Event.find(query);

    if (events.length === 0) {
      return res
        .status(200)
        .json({ message: 'There are no events for this day of the week.' });
    }

    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Something went wrong while retrieving the events',
    });
  }
};
