import { ApplicationError } from '../../error/ApplicationError';

export class AuthorizationService {
  verifyUserAuthorization(userId: string | undefined): void {
    if (!userId) {
      throw new ApplicationError('Not authenticated', 401);
    }
  }
}
