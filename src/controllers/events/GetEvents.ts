import { Request, Response } from 'express';
import Event from '../../models/EventModel';

interface Query {
  description?: { $regex: string; $options: 'i' };
  dayOfWeek?: string;
  userId?: string;
}

export const getEvents = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Not authenticated',
      });
    }

    const { description, dayOfWeek, onlyMyEvents } = req.query;
    const query: Query = {};

    if (onlyMyEvents === 'true') {
      query.userId = req.userId;
    }

    if (description) {
      query.description = { $regex: description as string, $options: 'i' };
    }
    if (dayOfWeek) {
      query.dayOfWeek = dayOfWeek as string;
    }

    const events = await Event.find(query);

    if (events.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        error: 'Not Found',
        message:
          onlyMyEvents === 'true'
            ? 'No events created by this user.'
            : 'No events found',
      });
    }

    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'Something went wrong',
    });
  }
};
