import Event, { IEvent } from '../../models/EventModel';

export class EventRepository {
  async create(data: Partial<IEvent>): Promise<IEvent> {
    return Event.create(data);
  }

  async findById(eventId: string): Promise<IEvent | null> {
    return Event.findById(eventId);
  }

  async find(query: any): Promise<IEvent[]> {
    const { skip, limit, ...conditions } = query;
    return Event.find(conditions).skip(skip).limit(limit);
  }

  async deleteById(eventId: string): Promise<IEvent | null> {
    const event = await Event.findById(eventId);
    if (event) {
      await Event.deleteOne({ _id: eventId });
    }
    return event;
  }

  async deleteMany(query: any): Promise<IEvent[]> {
    const events = await Event.find(query);
    if (events.length > 0) {
      await Event.deleteMany(query);
    }
    return events;
  }
}
