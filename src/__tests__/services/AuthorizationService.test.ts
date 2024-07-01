import { AuthorizationService } from '../../services/Authorization/AuthorizationService';
import { ApplicationError } from '../../error/ApplicationError';

describe('AuthorizationService', () => {
  let authorizationService: AuthorizationService;

  beforeEach(() => {
    authorizationService = new AuthorizationService();
  });

  describe('verifyUserAuthorization', () => {
    it('should throw an ApplicationError if userId is undefined', () => {
      const userId = undefined;

      expect(() =>
        authorizationService.verifyUserAuthorization(userId),
      ).toThrow(ApplicationError);
      expect(() =>
        authorizationService.verifyUserAuthorization(userId),
      ).toThrow('Not authenticated');
    });

    it('should not throw an error if userId is defined', () => {
      const userId = 'user123';

      expect(() =>
        authorizationService.verifyUserAuthorization(userId),
      ).not.toThrow();
    });
  });
});
