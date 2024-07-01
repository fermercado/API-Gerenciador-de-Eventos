import { formatEventResponse } from '../../utils/formatEventResponse';

describe('formatEventResponse', () => {
  it('should format the event response correctly', () => {
    const event = {
      _id: 12345,
      description: 'Test Event',
      dayOfWeek: 'monday',
      userId: 67890,
    };

    const formattedEvent = formatEventResponse(event);

    expect(formattedEvent).toEqual({
      _id: '12345',
      description: 'Test Event',
      dayOfWeek: 'monday',
      userId: '67890',
    });
  });

  it('should handle string IDs correctly', () => {
    const event = {
      _id: '12345',
      description: 'Test Event',
      dayOfWeek: 'monday',
      userId: '67890',
    };

    const formattedEvent = formatEventResponse(event);

    expect(formattedEvent).toEqual({
      _id: '12345',
      description: 'Test Event',
      dayOfWeek: 'monday',
      userId: '67890',
    });
  });
});
