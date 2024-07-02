import jwt from 'jsonwebtoken';
import { JwtService } from '../../services/jwt/JwtService';

jest.mock('jsonwebtoken');

describe('JwtService', () => {
  let jwtService: JwtService;

  beforeEach(() => {
    process.env.JWT_SECRET = 'secret';
    jwtService = new JwtService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should throw an error if JWT_SECRET is not defined', () => {
      delete process.env.JWT_SECRET;
      expect(() => new JwtService()).toThrow('JWT_SECRET is not defined.');
    });

    it('should set the secret from environment variables', () => {
      process.env.JWT_SECRET = 'secret';
      const service = new JwtService();
      expect(service['secret']).toBe('secret');
    });
  });

  describe('generateToken', () => {
    it('should generate a token with the given payload and default expiration', () => {
      const payload = { userId: '123' };
      const token = 'token';
      (jwt.sign as jest.Mock).mockReturnValue(token);

      const result = jwtService.generateToken(payload);

      expect(jwt.sign).toHaveBeenCalledWith(payload, 'secret', {
        expiresIn: '1h',
      });
      expect(result).toBe(token);
    });

    it('should generate a token with the given payload and custom expiration', () => {
      const payload = { userId: '123' };
      const token = 'token';
      const expiresIn = '2h';
      (jwt.sign as jest.Mock).mockReturnValue(token);

      const result = jwtService.generateToken(payload, expiresIn);

      expect(jwt.sign).toHaveBeenCalledWith(payload, 'secret', { expiresIn });
      expect(result).toBe(token);
    });
  });

  describe('verifyToken', () => {
    it('should verify the token and return the decoded payload', () => {
      const token = 'token';
      const decoded = { userId: '123' };
      (jwt.verify as jest.Mock).mockReturnValue(decoded);

      const result = jwtService.verifyToken(token);

      expect(jwt.verify).toHaveBeenCalledWith(token, 'secret');
      expect(result).toBe(decoded);
    });

    it('should throw an error if token verification fails', () => {
      const token = 'token';
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => jwtService.verifyToken(token)).toThrow('Invalid token');
    });
  });
});
