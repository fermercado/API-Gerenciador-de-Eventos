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

    const {
      description,
      dayOfWeek,
      onlyMyEvents,
      page = '1',
      limit = '10',
    } = req.query;
    const query: Query = {
      ...(onlyMyEvents === 'true' && { userId: req.userId }),
      ...(description && {
        description: { $regex: description as string, $options: 'i' },
      }),
      ...(dayOfWeek && { dayOfWeek: dayOfWeek as string }),
    };

    const events = await Event.find(query)
      .skip((parseInt(page as string) - 1) * parseInt(limit as string))
      .limit(parseInt(limit as string));

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
    res.status(500).json({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'Something went wrong',
    });
  }
};
