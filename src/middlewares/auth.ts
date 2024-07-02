import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../services/jwt/JwtService';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const jwtService = new JwtService();

export const authenticateUserFactory = (jwtServiceInstance: JwtService) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Not authenticated',
      });
    }

    try {
      const decoded = jwtServiceInstance.verifyToken(token) as {
        userId: string;
      };
      req.userId = decoded.userId;
      next();
    } catch (error) {
      return res.status(401).json({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Not authenticated',
      });
    }
  };
};

export const authenticateUser = authenticateUserFactory(jwtService);
