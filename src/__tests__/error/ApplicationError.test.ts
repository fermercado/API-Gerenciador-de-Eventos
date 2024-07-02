import { ApplicationError } from '../../error/ApplicationError';

describe('ApplicationError', () => {
  it('should create an ApplicationError with the correct message and status code', () => {
    const message = 'Test error message';
    const statusCode = 400;
    const error = new ApplicationError(message, statusCode);

    expect(error).toBeInstanceOf(ApplicationError);
    expect(error.message).toBe(message);
    expect(error.statusCode).toBe(statusCode);
    expect(error.name).toBe('ApplicationError');
  });

  it('should capture the stack trace correctly', () => {
    const message = 'Test error message';
    const statusCode = 400;
    const error = new ApplicationError(message, statusCode);

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('ApplicationError');
  });
});
