import * as bcrypt from 'bcryptjs';
import { HashService } from '../../services/hash/HashService';

jest.mock('bcryptjs');

describe('HashService', () => {
  describe('constructor', () => {
    it('should set saltRounds to 1 when NODE_ENV is test', () => {
      process.env.NODE_ENV = 'test';
      const hashService = new HashService();
      expect(hashService['saltRounds']).toBe(1);
    });

    it('should set saltRounds to 10 when NODE_ENV is not test', () => {
      process.env.NODE_ENV = 'production';
      const hashService = new HashService();
      expect(hashService['saltRounds']).toBe(10);
    });
  });

  describe('hashPassword', () => {
    let hashService: HashService;

    beforeEach(() => {
      hashService = new HashService();
    });

    it('should hash the password correctly', async () => {
      const password = 'password';
      const hashedPassword = 'hashedPassword';

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const result = await hashService.hashPassword(password);

      expect(bcrypt.hash).toHaveBeenCalledWith(
        password,
        hashService['saltRounds'],
      );
      expect(result).toBe(hashedPassword);
    });
  });

  describe('comparePassword', () => {
    let hashService: HashService;

    beforeEach(() => {
      hashService = new HashService();
    });

    it('should return true if the password matches the hash', async () => {
      const password = 'password';
      const hash = 'hashedPassword';

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await hashService.comparePassword(password, hash);

      expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
      expect(result).toBe(true);
    });

    it('should return false if the password does not match the hash', async () => {
      const password = 'password';
      const hash = 'hashedPassword';

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await hashService.comparePassword(password, hash);

      expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
      expect(result).toBe(false);
    });
  });
});
