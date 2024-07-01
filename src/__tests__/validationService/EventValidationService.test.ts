import { EventValidationService } from '../../services/validationServices/EventValidationService';
import { ApplicationError } from '../../error/ApplicationError';
import { eventValidationSchema } from '../../validators/EventValidator';

jest.mock('../../validators/EventValidator', () => ({
  eventValidationSchema: {
    validate: jest.fn(),
  },
}));

describe('EventValidationService', () => {
  let eventValidationService: EventValidationService;

  beforeEach(() => {
    eventValidationService = new EventValidationService();
  });

  describe('validateCreateEvent', () => {
    it('should validate event data successfully', async () => {
      const data = { description: 'Test Event', dayOfWeek: 'monday' };

      (eventValidationSchema.validate as jest.Mock).mockResolvedValue(data);

      await expect(
        eventValidationService.validateCreateEvent(data),
      ).resolves.not.toThrow();

      expect(eventValidationSchema.validate).toHaveBeenCalledWith(data, {
        abortEarly: false,
      });
    });

    it('should throw an ApplicationError if validation fails with ValidationError', async () => {
      const data = { description: 'Test Event', dayOfWeek: 'monday' };
      const validationError = {
        name: 'ValidationError',
        message: 'Validation failed',
      };

      (eventValidationSchema.validate as jest.Mock).mockRejectedValue(
        validationError,
      );

      await expect(
        eventValidationService.validateCreateEvent(data),
      ).rejects.toThrow(ApplicationError);
      await expect(
        eventValidationService.validateCreateEvent(data),
      ).rejects.toThrow('Validation Error');

      expect(eventValidationSchema.validate).toHaveBeenCalledWith(data, {
        abortEarly: false,
      });
    });

    it('should throw the original error if validation fails with a non-ValidationError', async () => {
      const data = { description: 'Test Event', dayOfWeek: 'monday' };
      const otherError = new Error('Other error');

      (eventValidationSchema.validate as jest.Mock).mockRejectedValue(
        otherError,
      );

      await expect(
        eventValidationService.validateCreateEvent(data),
      ).rejects.toThrow(otherError);

      expect(eventValidationSchema.validate).toHaveBeenCalledWith(data, {
        abortEarly: false,
      });
    });
  });
});
