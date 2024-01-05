import mongoose from 'mongoose';
import { Request, Response } from 'express';
import Event from '../../models/EventModel';

export const getEventById = async (req: Request, res: Response) => {
  try {
    const eventId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Invalid event ID format.',
      });
    }

    const event = await Event.findOne({ _id: eventId });

    if (!event) {
      return res.status(404).json({
        statusCode: 404,
        error: 'Not Found',
        message: 'Event not found.',
      });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'Something went wrong',
    });
  }
};
