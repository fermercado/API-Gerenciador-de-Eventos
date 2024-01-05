import { Request, Response } from 'express';
import Event from '../../models/EventModel';

export const deleteEvents = async (req: Request, res: Response) => {
  try {
    const { dayOfWeek } = req.query as { dayOfWeek?: string };

    if (!req.userId) {
      return res.status(401).json({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Not Authenticated',
      });
    }

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

    const eventsToDelete = await Event.find({
      userId: req.userId,
      dayOfWeek: dayOfWeek.toLowerCase(),
    }).lean();

    if (eventsToDelete.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        error: 'Not Found',
        message: 'No events found for deletion.',
      });
    }

    await Event.deleteMany({
      userId: req.userId,
      dayOfWeek: dayOfWeek.toLowerCase(),
    });

    const deletedEvents = eventsToDelete.map((event) => ({
      _id: event._id.toString(),
      description: event.description,
      dayOfWeek: event.dayOfWeek,
      userId: event.userId.toString(),
    }));

    return res.status(200).json({ deletedEvents });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'Something went wrong',
    });
  }
};
