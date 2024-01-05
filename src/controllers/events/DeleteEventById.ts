import { Request, Response } from 'express';
import Event from '../../models/EventModel';

export const deleteEventById = async (req: Request, res: Response) => {
  try {
    const eventId = req.params.id;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        statusCode: 404,
        error: 'Not Found',
        message: 'Event not found for deletion.',
      });
    }

    if (event.userId.toString() !== req.userId) {
      return res.status(400).json({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Invalid Id',
      });
    }

    await Event.findByIdAndDelete(eventId);

    return res.status(200).json({
      deletedEvent: event,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'Something went wrong',
    });
  }
};
