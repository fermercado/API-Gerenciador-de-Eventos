import User, { IUser } from '../../models/UserModel';
import { UserRepository } from '../../services/repository/UserRepository';

jest.mock('../../models/UserModel');

describe('UserRepository', () => {
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = new UserRepository();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const data: Partial<IUser> = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password',
      };

      const createdUser = {
        ...data,
        _id: 'userId',
      } as IUser;

      (User.create as jest.Mock).mockResolvedValue(createdUser);

      const result = await userRepository.create(data);

      expect(User.create).toHaveBeenCalledWith(data);
      expect(result).toEqual(createdUser);
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email successfully', async () => {
      const email = 'john.doe@example.com';
      const foundUser = {
        _id: 'userId',
        email,
        firstName: 'John',
        lastName: 'Doe',
        password: 'password',
      } as IUser;

      (User.findOne as jest.Mock).mockResolvedValue(foundUser);

      const result = await userRepository.findByEmail(email);

      expect(User.findOne).toHaveBeenCalledWith({ email });
      expect(result).toEqual(foundUser);
    });

    it('should return null if no user is found', async () => {
      const email = 'nonexistent@example.com';

      (User.findOne as jest.Mock).mockResolvedValue(null);

      const result = await userRepository.findByEmail(email);

      expect(User.findOne).toHaveBeenCalledWith({ email });
      expect(result).toBeNull();
    });
  });

  describe('updateById', () => {
    it('should update a user by id successfully', async () => {
      const userId = 'userId';
      const data: Partial<IUser> = {
        firstName: 'Jane',
        lastName: 'Doe',
      };

      const updatedUser = {
        _id: userId,
        ...data,
        email: 'jane.doe@example.com',
        password: 'password',
      } as IUser;

      (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedUser);

      const result = await userRepository.updateById(userId, data);

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(userId, data, {
        new: true,
      });
      expect(result).toEqual(updatedUser);
    });

    it('should return null if no user is found to update', async () => {
      const userId = 'nonexistentId';
      const data: Partial<IUser> = {
        firstName: 'Jane',
        lastName: 'Doe',
      };

      (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      const result = await userRepository.updateById(userId, data);

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(userId, data, {
        new: true,
      });
      expect(result).toBeNull();
    });
  });
});
