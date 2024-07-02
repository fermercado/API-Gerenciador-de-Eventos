import { Request, Response, NextFunction } from 'express';
import { EventService } from '../../services/event/EventService';

export class EventController {
  private eventService: EventService;

  constructor() {
    this.eventService = new EventService();
  }

  public async createEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { description, dayOfWeek } = req.body;
      const userId = req.userId as string;
      const event = await this.eventService.createEvent(
        { description, dayOfWeek },
        userId,
      );
      res.status(201).json(event);
    } catch (error) {
      next(error);
    }
  }

  public async getEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const dayOfWeek = req.query.dayOfWeek as string | undefined;
      const description = req.query.description as string | undefined;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const userId = req.userId as string;

      const query: any = {};

      if (dayOfWeek) {
        query.dayOfWeek = dayOfWeek;
      }

      if (description) {
        query.description = { $regex: new RegExp(description, 'i') };
      }

      const events = await this.eventService.getEvents(
        query,
        userId,
        page,
        limit,
      );
      res.status(200).json(events);
    } catch (error) {
      next(error);
    }
  }

  public async getEventById(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await this.eventService.getEventById(req.params.id);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.status(200).json(event);
    } catch (error) {
      next(error);
    }
  }

  public async deleteEventById(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.userId as string;
      const event = await this.eventService.deleteEventById(
        req.params.id,
        userId,
      );
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  public async deleteEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const dayOfWeek = req.query.dayOfWeek as string | undefined;
      const userId = req.userId as string;
      const result = await this.eventService.deleteEvents(
        dayOfWeek as string,
        userId,
      );
      if (result.length === 0) {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.status(200).json({ message: 'Events deleted successfully', result });
    } catch (error) {
      next(error);
    }
  }
}
