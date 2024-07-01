import { CreateEventDTO } from '../dtos/event/CreateEventDto';
import { IEvent } from '../models/EventModel';

export interface IEventService {
  createEvent(data: CreateEventDTO, userId: string): Promise<IEvent>;
  deleteEventById(eventId: string, userId: string): Promise<IEvent | null>;
  deleteEvents(dayOfWeek: string, userId: string): Promise<IEvent[]>;
  getEvents(
    query: any,
    userId: string,
    page: number,
    limit: number,
  ): Promise<IEvent[]>;
  getEventById(eventId: string): Promise<IEvent | null>;
}
