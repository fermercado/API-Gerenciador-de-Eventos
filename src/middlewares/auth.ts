import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    console.log('Token não encontrado');
    return res
      .status(401)
      .json({ error: 'Unauthorized', message: 'Not Authenticated' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
    req.userId = (decoded as { userId: string }).userId;
    console.log('Usuário autenticado. ID:', req.userId);
    next();
  } catch (error) {
    console.log('Erro na autenticação:', error);
    return res
      .status(401)
      .json({ error: 'Unauthorized', message: 'Not Authenticated' });
  }
};
