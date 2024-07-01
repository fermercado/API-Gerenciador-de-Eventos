import { eventValidationSchema } from '../../validators/EventValidator';
import { ApplicationError } from '../../error/ApplicationError';

export class EventValidationService {
  async validateCreateEvent(data: any): Promise<void> {
    try {
      await eventValidationSchema.validate(data, { abortEarly: false });
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        throw new ApplicationError('Validation Error', 400);
      }
      throw error;
    }
  }
}
