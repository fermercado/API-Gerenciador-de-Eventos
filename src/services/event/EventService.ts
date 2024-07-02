import { IEventService } from '../../interfaces/IEventService';
import { CreateEventDTO } from '../../dtos/event/CreateEventDto';
import { EventRepository } from '../repository/EventRepository';
import { EventValidationService } from '../validationServices/EventValidationService';
import { AuthorizationService } from '../Authorization/AuthorizationService';
import { IEvent } from '../../models/EventModel';
import { PaginationService } from '../../utils/pagination';

export class EventService implements IEventService {
  private eventRepository: EventRepository;
  private eventValidationService: EventValidationService;
  private authorizationService: AuthorizationService;
  private paginationService: PaginationService;

  constructor() {
    this.eventRepository = new EventRepository();
    this.eventValidationService = new EventValidationService();
    this.authorizationService = new AuthorizationService();
    this.paginationService = new PaginationService();
  }

  async createEvent(data: CreateEventDTO, userId: string): Promise<IEvent> {
    this.authorizationService.verifyUserAuthorization(userId);
    await this.eventValidationService.validateCreateEvent(data);

    const event = await this.eventRepository.create({
      userId,
      ...data,
    });
    return event;
  }

  async deleteEventById(
    eventId: string,
    userId: string,
  ): Promise<IEvent | null> {
    this.authorizationService.verifyUserAuthorization(userId);

    const event = await this.eventRepository.findById(eventId);
    if (event && event.userId === userId) {
      return this.eventRepository.deleteById(eventId);
    }
    return null;
  }

  async deleteEvents(dayOfWeek: string, userId: string): Promise<IEvent[]> {
    this.authorizationService.verifyUserAuthorization(userId);

    const query = { userId, dayOfWeek };
    return this.eventRepository.deleteMany(query);
  }

  async getEvents(
    query: any,
    userId: string,
    page: number,
    limit: number,
  ): Promise<IEvent[]> {
    this.authorizationService.verifyUserAuthorization(userId);

    const conditions = {
      ...query,
      userId,
    };

    const paginatedQuery = this.paginationService.paginate(
      conditions,
      page,
      limit,
    );
    return this.eventRepository.find(paginatedQuery);
  }

  async getEventById(eventId: string): Promise<IEvent | null> {
    return this.eventRepository.findById(eventId);
  }
}
