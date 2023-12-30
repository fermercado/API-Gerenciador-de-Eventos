import { Request, Response } from 'express';
import Event from '../../models/EventModel';

export const deleteEventById = async (req: Request, res: Response) => {
  try {
    const eventId = req.params.id;

    if (!eventId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Event ID is required.',
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Event not found for deletion.',
      });
    }

    if (event.userId.toString() !== req.userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to delete this event.',
      });
    }

    await Event.findByIdAndDelete(eventId);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Something went wrong',
    });
  }
};
