import { EventService } from '../../services/event/EventService';
import { EventRepository } from '../../services/repository/EventRepository';
import { EventValidationService } from '../../services/validationServices/EventValidationService';
import { AuthorizationService } from '../../services/Authorization/AuthorizationService';
import { PaginationService } from '../../utils/pagination';
import { CreateEventDTO } from '../../dtos/event/CreateEventDto';
import { IEvent } from '../../models/EventModel';

jest.mock('../../services/repository/EventRepository');
jest.mock('../../services/validationServices/EventValidationService');
jest.mock('../../services/Authorization/AuthorizationService');
jest.mock('../../utils/pagination');

describe('EventService', () => {
  let eventService: EventService;
  let eventRepository: jest.Mocked<EventRepository>;
  let eventValidationService: jest.Mocked<EventValidationService>;
  let authorizationService: jest.Mocked<AuthorizationService>;
  let paginationService: jest.Mocked<PaginationService>;

  beforeEach(() => {
    eventRepository = new EventRepository() as jest.Mocked<EventRepository>;
    eventValidationService =
      new EventValidationService() as jest.Mocked<EventValidationService>;
    authorizationService =
      new AuthorizationService() as jest.Mocked<AuthorizationService>;
    paginationService =
      new PaginationService() as jest.Mocked<PaginationService>;

    eventService = new EventService();
    (eventService as any).eventRepository = eventRepository;
    (eventService as any).eventValidationService = eventValidationService;
    (eventService as any).authorizationService = authorizationService;
    (eventService as any).paginationService = paginationService;
  });

  describe('createEvent', () => {
    it('should create an event successfully', async () => {
      const data: CreateEventDTO = {
        description: 'Test Event',
        dayOfWeek: 'monday',
      };
      const userId = 'user123';
      const event: IEvent = {
        _id: 'event123',
        description: 'Test Event',
        dayOfWeek: 'monday',
        userId,
      } as IEvent;

      authorizationService.verifyUserAuthorization.mockImplementation(() => {});
      eventValidationService.validateCreateEvent.mockResolvedValue();
      eventRepository.create.mockResolvedValue(event);

      const result = await eventService.createEvent(data, userId);

      expect(authorizationService.verifyUserAuthorization).toHaveBeenCalledWith(
        userId,
      );
      expect(eventValidationService.validateCreateEvent).toHaveBeenCalledWith(
        data,
      );
      expect(eventRepository.create).toHaveBeenCalledWith({ userId, ...data });
      expect(result).toEqual(event);
    });

    it('should throw an error if validation fails', async () => {
      const data: CreateEventDTO = {
        description: 'Test Event',
        dayOfWeek: 'monday',
      };
      const userId = 'user123';
      const error = new Error('Validation Error');

      authorizationService.verifyUserAuthorization.mockImplementation(() => {});
      eventValidationService.validateCreateEvent.mockRejectedValue(error);

      await expect(eventService.createEvent(data, userId)).rejects.toThrow(
        error,
      );
    });
  });

  describe('deleteEventById', () => {
    it('should delete an event successfully', async () => {
      const eventId = 'event123';
      const userId = 'user123';
      const event: IEvent = {
        _id: 'event123',
        description: 'Test Event',
        dayOfWeek: 'monday',
        userId,
      } as IEvent;

      authorizationService.verifyUserAuthorization.mockImplementation(() => {});
      eventRepository.findById.mockResolvedValue(event);
      eventRepository.deleteById.mockResolvedValue(event);

      const result = await eventService.deleteEventById(eventId, userId);

      expect(authorizationService.verifyUserAuthorization).toHaveBeenCalledWith(
        userId,
      );
      expect(eventRepository.findById).toHaveBeenCalledWith(eventId);
      expect(eventRepository.deleteById).toHaveBeenCalledWith(eventId);
      expect(result).toEqual(event);
    });

    it('should return null if event does not exist', async () => {
      const eventId = 'event123';
      const userId = 'user123';

      authorizationService.verifyUserAuthorization.mockImplementation(() => {});
      eventRepository.findById.mockResolvedValue(null);

      const result = await eventService.deleteEventById(eventId, userId);

      expect(authorizationService.verifyUserAuthorization).toHaveBeenCalledWith(
        userId,
      );
      expect(eventRepository.findById).toHaveBeenCalledWith(eventId);
      expect(result).toBeNull();
    });

    it('should return null if user is not authorized to delete the event', async () => {
      const eventId = 'event123';
      const userId = 'user123';
      const event: IEvent = {
        _id: 'event123',
        description: 'Test Event',
        dayOfWeek: 'monday',
        userId: 'otherUser',
      } as IEvent;

      authorizationService.verifyUserAuthorization.mockImplementation(() => {});
      eventRepository.findById.mockResolvedValue(event);

      const result = await eventService.deleteEventById(eventId, userId);

      expect(authorizationService.verifyUserAuthorization).toHaveBeenCalledWith(
        userId,
      );
      expect(eventRepository.findById).toHaveBeenCalledWith(eventId);
      expect(result).toBeNull();
    });
  });

  describe('deleteEvents', () => {
    it('should delete events successfully', async () => {
      const dayOfWeek = 'monday';
      const userId = 'user123';
      const events: IEvent[] = [
        {
          _id: 'event123',
          description: 'Test Event 1',
          dayOfWeek: 'monday',
          userId,
        } as IEvent,
        {
          _id: 'event124',
          description: 'Test Event 2',
          dayOfWeek: 'monday',
          userId,
        } as IEvent,
      ];

      authorizationService.verifyUserAuthorization.mockImplementation(() => {});
      eventRepository.deleteMany.mockResolvedValue(events);

      const result = await eventService.deleteEvents(dayOfWeek, userId);

      expect(authorizationService.verifyUserAuthorization).toHaveBeenCalledWith(
        userId,
      );
      expect(eventRepository.deleteMany).toHaveBeenCalledWith({
        userId,
        dayOfWeek,
      });
      expect(result).toEqual(events);
    });
  });

  describe('getEvents', () => {
    it('should get paginated events successfully', async () => {
      const query = { description: 'Test Event' };
      const userId = 'user123';
      const page = 1;
      const limit = 10;
      const events: IEvent[] = [
        {
          _id: 'event123',
          description: 'Test Event 1',
          dayOfWeek: 'monday',
          userId,
        } as IEvent,
        {
          _id: 'event124',
          description: 'Test Event 2',
          dayOfWeek: 'monday',
          userId,
        } as IEvent,
      ];
      const paginatedQuery = { ...query, userId, skip: 0, limit };

      authorizationService.verifyUserAuthorization.mockImplementation(() => {});
      paginationService.paginate.mockReturnValue(paginatedQuery);
      eventRepository.find.mockResolvedValue(events);

      const result = await eventService.getEvents(query, userId, page, limit);

      expect(authorizationService.verifyUserAuthorization).toHaveBeenCalledWith(
        userId,
      );
      expect(paginationService.paginate).toHaveBeenCalledWith(
        { ...query, userId },
        page,
        limit,
      );
      expect(eventRepository.find).toHaveBeenCalledWith(paginatedQuery);
      expect(result).toEqual(events);
    });
  });

  describe('getEventById', () => {
    it('should get event by id successfully', async () => {
      const eventId = 'event123';
      const event: IEvent = {
        _id: 'event123',
        description: 'Test Event',
        dayOfWeek: 'monday',
        userId: 'user123',
      } as IEvent;

      eventRepository.findById.mockResolvedValue(event);

      const result = await eventService.getEventById(eventId);

      expect(eventRepository.findById).toHaveBeenCalledWith(eventId);
      expect(result).toEqual(event);
    });

    it('should return null if event does not exist', async () => {
      const eventId = 'event123';

      eventRepository.findById.mockResolvedValue(null);

      const result = await eventService.getEventById(eventId);

      expect(eventRepository.findById).toHaveBeenCalledWith(eventId);
      expect(result).toBeNull();
    });
  });
});
