import Event, { IEvent } from '../../models/EventModel';
import { EventRepository } from '../../services/repository/EventRepository';

jest.mock('../../models/EventModel');

describe('EventRepository', () => {
  let eventRepository: EventRepository;

  beforeEach(() => {
    eventRepository = new EventRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new event', async () => {
      const data: Partial<IEvent> = {
        description: 'Test Event',
        dayOfWeek: 'monday',
        userId: 'user123',
      };
      const event: IEvent = { ...data, _id: 'event123' } as IEvent;

      (Event.create as jest.Mock).mockResolvedValue(event);

      const result = await eventRepository.create(data);

      expect(Event.create).toHaveBeenCalledWith(data);
      expect(result).toEqual(event);
    });
  });

  describe('findById', () => {
    it('should find an event by id', async () => {
      const eventId = 'event123';
      const event: IEvent = {
        _id: eventId,
        description: 'Test Event',
        dayOfWeek: 'monday',
        userId: 'user123',
      } as IEvent;

      (Event.findById as jest.Mock).mockResolvedValue(event);

      const result = await eventRepository.findById(eventId);

      expect(Event.findById).toHaveBeenCalledWith(eventId);
      expect(result).toEqual(event);
    });

    it('should return null if event is not found', async () => {
      const eventId = 'event123';

      (Event.findById as jest.Mock).mockResolvedValue(null);

      const result = await eventRepository.findById(eventId);

      expect(Event.findById).toHaveBeenCalledWith(eventId);
      expect(result).toBeNull();
    });
  });

  describe('find', () => {
    it('should find events with query', async () => {
      const query = { description: 'Test Event', skip: 0, limit: 10 };
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

      (Event.find as jest.Mock).mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(events),
      });

      const result = await eventRepository.find(query);

      expect(Event.find).toHaveBeenCalledWith({ description: 'Test Event' });
      expect(result).toEqual(events);
    });
  });

  describe('deleteById', () => {
    it('should delete an event by id', async () => {
      const eventId = 'event123';
      const event: IEvent = {
        _id: eventId,
        description: 'Test Event',
        dayOfWeek: 'monday',
        userId: 'user123',
      } as IEvent;

      (Event.findById as jest.Mock).mockResolvedValue(event);
      (Event.deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 1 });

      const result = await eventRepository.deleteById(eventId);

      expect(Event.findById).toHaveBeenCalledWith(eventId);
      expect(Event.deleteOne).toHaveBeenCalledWith({ _id: eventId });
      expect(result).toEqual(event);
    });

    it('should return null if event is not found', async () => {
      const eventId = 'event123';

      (Event.findById as jest.Mock).mockResolvedValue(null);

      const result = await eventRepository.deleteById(eventId);

      expect(Event.findById).toHaveBeenCalledWith(eventId);
      expect(result).toBeNull();
    });
  });

  describe('deleteMany', () => {
    it('should delete events with query', async () => {
      const query = { dayOfWeek: 'monday', userId: 'user123' };
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

      (Event.find as jest.Mock).mockResolvedValue(events);
      (Event.deleteMany as jest.Mock).mockResolvedValue({ deletedCount: 2 });

      const result = await eventRepository.deleteMany(query);

      expect(Event.find).toHaveBeenCalledWith(query);
      expect(Event.deleteMany).toHaveBeenCalledWith(query);
      expect(result).toEqual(events);
    });

    it('should return empty array if no events are found', async () => {
      const query = { dayOfWeek: 'monday', userId: 'user123' };

      (Event.find as jest.Mock).mockResolvedValue([]);

      const result = await eventRepository.deleteMany(query);

      expect(Event.find).toHaveBeenCalledWith(query);
      expect(result).toEqual([]);
    });
  });
});
