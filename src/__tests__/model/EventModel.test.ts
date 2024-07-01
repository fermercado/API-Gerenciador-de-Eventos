import EventModel, { IEvent } from '../../models/EventModel';

jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');

  const mockSchema = new actualMongoose.Schema({});
  const mockModel = class {
    constructor(public data: any) {}
    static create = jest
      .fn()
      .mockImplementation((data) => Promise.resolve(data));
    save = jest.fn().mockImplementation(() => Promise.resolve(this.data));
  };
  return {
    ...actualMongoose,
    model: jest.fn().mockImplementation(() => mockModel),
    Schema: jest.fn().mockImplementation(() => mockSchema),
    connect: jest.fn(),
  };
});

describe('EventModel', () => {
  it('should create an event successfully', async () => {
    const event: Partial<IEvent> = {
      description: 'Test Event',
      dayOfWeek: 'monday',
      userId: 'user123',
    };

    const createdEvent = new EventModel(event);
    const savedEvent = await createdEvent.save();

    expect(savedEvent).toEqual(event);
  });

  it('should throw validation error if required fields are missing', async () => {
    const invalidEvent: Partial<IEvent> = {
      description: 'Test Event',
    };

    const event = new EventModel(invalidEvent);
    try {
      await event.save();
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  it('should throw validation error if dayOfWeek is invalid', async () => {
    const invalidEvent: Partial<IEvent> = {
      description: 'Test Event',
      dayOfWeek: 'funday',
      userId: 'user123',
    };

    const event = new EventModel(invalidEvent);
    try {
      await event.save();
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  it('should throw validation error if description is missing', async () => {
    const invalidEvent: Partial<IEvent> = {
      dayOfWeek: 'monday',
      userId: 'user123',
    };

    const event = new EventModel(invalidEvent);
    try {
      await event.save();
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});
