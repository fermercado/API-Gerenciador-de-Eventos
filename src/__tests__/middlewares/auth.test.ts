import { Request, Response, NextFunction } from 'express';
import { authenticateUserFactory } from '../../middlewares/auth';
import { JwtService } from '../../services/jwt/JwtService';

jest.mock('../../services/jwt/JwtService');

describe('authenticateUser', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    req = {
      header: jest.fn(),
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();

    jwtService = {
      verifyToken: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;
  });

  it('should return 401 if no token is provided', () => {
    (req.header as jest.Mock).mockReturnValue(null);

    const authenticateUser = authenticateUserFactory(jwtService);

    authenticateUser(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Not authenticated',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if the token is invalid', () => {
    const token = 'invalidToken';
    (req.header as jest.Mock).mockReturnValue(`Bearer ${token}`);
    (jwtService.verifyToken as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const authenticateUser = authenticateUserFactory(jwtService);

    authenticateUser(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Not authenticated',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if the token is valid', () => {
    const token = 'validToken';
    const decoded = { userId: '123' };
    (req.header as jest.Mock).mockReturnValue(`Bearer ${token}`);
    (jwtService.verifyToken as jest.Mock).mockReturnValue(decoded);

    const authenticateUser = authenticateUserFactory(jwtService);

    authenticateUser(req as Request, res as Response, next);

    expect(jwtService.verifyToken).toHaveBeenCalledWith(token);
    expect(req.userId).toBe(decoded.userId);
    expect(next).toHaveBeenCalled();
  });
});
