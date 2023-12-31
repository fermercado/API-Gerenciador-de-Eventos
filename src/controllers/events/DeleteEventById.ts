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
        message: 'You do not have permission to delete this event.',
      });
    }

    await Event.findByIdAndDelete(eventId);
    return res.status(204).json({
      statusCode: 204,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'Something went wrong',
    });
  }
};
