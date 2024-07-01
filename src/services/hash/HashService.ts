import * as bcrypt from 'bcryptjs';

export class HashService {
  private saltRounds: number;

  constructor() {
    this.saltRounds = process.env.NODE_ENV === 'test' ? 1 : 10;
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
