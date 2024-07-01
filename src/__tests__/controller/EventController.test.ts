import { Request, Response, NextFunction } from 'express';
import { EventController } from '../../controllers/events/EventController';
import { EventService } from '../../services/event/EventService';
import { IEvent } from '../../models/EventModel';

jest.mock('../../services/event/EventService');

describe('EventController', () => {
  let eventController: EventController;
  let eventService: jest.Mocked<EventService>;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    eventService = new EventService() as jest.Mocked<EventService>;
    eventController = new EventController();
    (eventController as any).eventService = eventService;

    req = {
      body: {},
      query: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe('createEvent', () => {
    it('should create an event and return 201 status', async () => {
      const event: IEvent = {
        _id: 'event123',
        description: 'Test Event',
        dayOfWeek: 'monday',
        userId: 'user123',
      } as IEvent;
      req.body = { description: 'Test Event', dayOfWeek: 'monday' };
      req.userId = 'user123';

      eventService.createEvent.mockResolvedValue(event);

      await eventController.createEvent(req as Request, res as Response, next);

      expect(eventService.createEvent).toHaveBeenCalledWith(
        { description: 'Test Event', dayOfWeek: 'monday' },
        'user123',
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(event);
    });

    it('should call next with error if createEvent fails', async () => {
      const error = new Error('Create event failed');
      req.body = { description: 'Test Event', dayOfWeek: 'monday' };
      req.userId = 'user123';

      eventService.createEvent.mockRejectedValue(error);

      await eventController.createEvent(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getEvents', () => {
    it('should get events and return 200 status', async () => {
      const events: IEvent[] = [
        {
          _id: 'event123',
          description: 'Test Event 1',
          dayOfWeek: 'monday',
          userId: 'user123',
        } as IEvent,
        {
          _id: 'event124',
          description: 'Test Event 2',
          dayOfWeek: 'tuesday',
          userId: 'user123',
        } as IEvent,
      ];
      req.query = {
        description: 'Test Event',
        dayOfWeek: 'monday',
        page: '1',
        limit: '10',
      };
      req.userId = 'user123';

      eventService.getEvents.mockResolvedValue(events);

      await eventController.getEvents(req as Request, res as Response, next);

      expect(eventService.getEvents).toHaveBeenCalledWith(
        {
          description: { $regex: new RegExp('Test Event', 'i') },
          dayOfWeek: 'monday',
        },
        'user123',
        1,
        10,
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(events);
    });

    it('should get events with no description and return 200 status', async () => {
      const events: IEvent[] = [
        {
          _id: 'event123',
          description: 'Test Event 1',
          dayOfWeek: 'monday',
          userId: 'user123',
        } as IEvent,
      ];
      req.query = { dayOfWeek: 'monday', page: '1', limit: '10' };
      req.userId = 'user123';

      eventService.getEvents.mockResolvedValue(events);

      await eventController.getEvents(req as Request, res as Response, next);

      expect(eventService.getEvents).toHaveBeenCalledWith(
        { dayOfWeek: 'monday' },
        'user123',
        1,
        10,
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(events);
    });

    it('should get events with default page and limit when not provided', async () => {
      const events: IEvent[] = [
        {
          _id: 'event123',
          description: 'Test Event 1',
          dayOfWeek: 'monday',
          userId: 'user123',
        } as IEvent,
      ];
      req.query = { dayOfWeek: 'monday' };
      req.userId = 'user123';

      eventService.getEvents.mockResolvedValue(events);

      await eventController.getEvents(req as Request, res as Response, next);

      expect(eventService.getEvents).toHaveBeenCalledWith(
        { dayOfWeek: 'monday' },
        'user123',
        1,
        10,
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(events);
    });

    it('should call next with error if getEvents fails', async () => {
      const error = new Error('Get events failed');
      req.query = {
        description: 'Test Event',
        dayOfWeek: 'monday',
        page: '1',
        limit: '10',
      };
      req.userId = 'user123';

      eventService.getEvents.mockRejectedValue(error);

      await eventController.getEvents(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getEventById', () => {
    it('should get event by id and return 200 status', async () => {
      const event: IEvent = {
        _id: 'event123',
        description: 'Test Event',
        dayOfWeek: 'monday',
        userId: 'user123',
      } as IEvent;
      req.params = { id: 'event123' };

      eventService.getEventById.mockResolvedValue(event);

      await eventController.getEventById(req as Request, res as Response, next);

      expect(eventService.getEventById).toHaveBeenCalledWith('event123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(event);
    });

    it('should return 404 if event not found', async () => {
      req.params = { id: 'event123' };

      eventService.getEventById.mockResolvedValue(null);

      await eventController.getEventById(req as Request, res as Response, next);

      expect(eventService.getEventById).toHaveBeenCalledWith('event123');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Event not found' });
    });

    it('should call next with error if getEventById fails', async () => {
      const error = new Error('Get event by id failed');
      req.params = { id: 'event123' };

      eventService.getEventById.mockRejectedValue(error);

      await eventController.getEventById(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteEventById', () => {
    it('should delete event by id and return 200 status', async () => {
      const event: IEvent = {
        _id: 'event123',
        description: 'Test Event',
        dayOfWeek: 'monday',
        userId: 'user123',
      } as IEvent;
      req.params = { id: 'event123' };
      req.userId = 'user123';

      eventService.deleteEventById.mockResolvedValue(event);

      await eventController.deleteEventById(
        req as Request,
        res as Response,
        next,
      );

      expect(eventService.deleteEventById).toHaveBeenCalledWith(
        'event123',
        'user123',
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Event deleted successfully',
      });
    });

    it('should return 404 if event not found', async () => {
      req.params = { id: 'event123' };
      req.userId = 'user123';

      eventService.deleteEventById.mockResolvedValue(null);

      await eventController.deleteEventById(
        req as Request,
        res as Response,
        next,
      );

      expect(eventService.deleteEventById).toHaveBeenCalledWith(
        'event123',
        'user123',
      );
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Event not found' });
    });

    it('should call next with error if deleteEventById fails', async () => {
      const error = new Error('Delete event by id failed');
      req.params = { id: 'event123' };
      req.userId = 'user123';

      eventService.deleteEventById.mockRejectedValue(error);

      await eventController.deleteEventById(
        req as Request,
        res as Response,
        next,
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteEvents', () => {
    it('should delete events and return 200 status', async () => {
      const events: IEvent[] = [
        {
          _id: 'event123',
          description: 'Test Event 1',
          dayOfWeek: 'monday',
          userId: 'user123',
        } as IEvent,
        {
          _id: 'event124',
          description: 'Test Event 2',
          dayOfWeek: 'monday',
          userId: 'user123',
        } as IEvent,
      ];
      req.query = { dayOfWeek: 'monday' };
      req.userId = 'user123';

      eventService.deleteEvents.mockResolvedValue(events);

      await eventController.deleteEvents(req as Request, res as Response, next);

      expect(eventService.deleteEvents).toHaveBeenCalledWith(
        'monday',
        'user123',
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Events deleted successfully',
        result: events,
      });
    });

    it('should return 404 if no events found', async () => {
      req.query = { dayOfWeek: 'monday' };
      req.userId = 'user123';

      eventService.deleteEvents.mockResolvedValue([]);

      await eventController.deleteEvents(req as Request, res as Response, next);

      expect(eventService.deleteEvents).toHaveBeenCalledWith(
        'monday',
        'user123',
      );
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Event not found' });
    });

    it('should call next with error if deleteEvents fails', async () => {
      const error = new Error('Delete events failed');
      req.query = { dayOfWeek: 'monday' };
      req.userId = 'user123';

      eventService.deleteEvents.mockRejectedValue(error);

      await eventController.deleteEvents(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
