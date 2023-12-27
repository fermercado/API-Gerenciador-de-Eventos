import { Request, Response } from 'express';
import Event from '../../models/EventModel';

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
