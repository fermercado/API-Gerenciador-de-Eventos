import jwt from 'jsonwebtoken';

export class JwtService {
  private secret: string;

  constructor() {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined.');
    }
    this.secret = process.env.JWT_SECRET;
  }

  generateToken(payload: object, expiresIn: string = '1h'): string {
    return jwt.sign(payload, this.secret, { expiresIn });
  }

  verifyToken(token: string): any {
    return jwt.verify(token, this.secret);
  }
}
