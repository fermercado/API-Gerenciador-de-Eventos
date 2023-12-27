import { Request, Response } from 'express';
import Event from '../../models/EventModel';

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
