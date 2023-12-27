import { Request, Response } from 'express';
import Event from '../../models/EventModel';

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
