import { Request, Response, NextFunction } from 'express';
import { UserController } from '../../controllers/users/UserController';
import { UserService } from '../../services/user/UserService';
import { CreateUserDTO } from '../../dtos/user/CreateUserDto';
import { LoginUserDTO } from '../../dtos/user/LoginUserDto';
import { UpdateUserDTO } from '../../dtos/user/UpdateUserDto';
import { formatUserResponse } from '../../utils/formatUserResponse';
import { ApplicationError } from '../../error/ApplicationError';

jest.mock('../../services/user/UserService');
jest.mock('../../utils/formatUserResponse');

describe('UserController', () => {
  let userController: UserController;
  let userService: jest.Mocked<UserService>;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    userService = new UserService() as jest.Mocked<UserService>;
    userController = new UserController();
    userController['userService'] = userService;

    req = {
      body: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const createUserDTO: CreateUserDTO = {
        firstName: 'John',
        lastName: 'Doe',
        birthDate: '1990-01-01',
        city: 'City',
        country: 'Country',
        email: 'john.doe@example.com',
        password: 'password',
      };

      const createdUser = { ...createUserDTO, _id: 'userId' };
      (userService.createUser as jest.Mock).mockResolvedValue(createdUser);
      (formatUserResponse as jest.Mock).mockReturnValue({
        ...createdUser,
        id: 'userId',
      });

      req.body = createUserDTO;

      await userController.createUser(req as Request, res as Response, next);

      expect(userService.createUser).toHaveBeenCalledWith(createUserDTO);
      expect(formatUserResponse).toHaveBeenCalledWith(createdUser);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ ...createdUser, id: 'userId' });
    });

    it('should handle errors', async () => {
      const error = new ApplicationError('User already exists', 400);
      (userService.createUser as jest.Mock).mockRejectedValue(error);

      await userController.createUser(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('loginUser', () => {
    it('should login a user successfully', async () => {
      const loginUserDTO: LoginUserDTO = {
        email: 'john.doe@example.com',
        password: 'password',
      };

      const loginResult = {
        token: 'token',
        user: { ...loginUserDTO, _id: 'userId', password: 'hashedPassword' },
      };
      (userService.loginUser as jest.Mock).mockResolvedValue(loginResult);
      (formatUserResponse as jest.Mock).mockReturnValue({
        ...loginResult.user,
        id: 'userId',
      });

      req.body = loginUserDTO;

      await userController.loginUser(req as Request, res as Response, next);

      expect(userService.loginUser).toHaveBeenCalledWith(loginUserDTO);
      expect(formatUserResponse).toHaveBeenCalledWith(loginResult.user);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        token: loginResult.token,
        user: { ...loginResult.user, id: 'userId' },
      });
    });

    it('should handle errors', async () => {
      const error = new ApplicationError('Invalid email or password', 400);
      (userService.loginUser as jest.Mock).mockRejectedValue(error);

      await userController.loginUser(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(
        new ApplicationError('Invalid email or password', 400),
      );
    });
  });

  describe('updateUser', () => {
    it('should update a user successfully', async () => {
      const updateUserDTO: UpdateUserDTO = {
        firstName: 'Jane',
        lastName: 'Doe',
        city: 'New City',
        email: 'jane.doe@example.com',
      };

      const updatedUser = { ...updateUserDTO, _id: 'userId' };
      (userService.updateUser as jest.Mock).mockResolvedValue(updatedUser);
      (formatUserResponse as jest.Mock).mockReturnValue({
        ...updatedUser,
        id: 'userId',
      });

      req.params = { id: 'userId' };
      req.body = updateUserDTO;

      await userController.updateUser(req as Request, res as Response, next);

      expect(userService.updateUser).toHaveBeenCalledWith(
        'userId',
        updateUserDTO,
      );
      expect(formatUserResponse).toHaveBeenCalledWith(updatedUser);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ ...updatedUser, id: 'userId' });
    });

    it('should handle errors', async () => {
      const error = new ApplicationError('User not found', 404);
      (userService.updateUser as jest.Mock).mockRejectedValue(error);

      req.params = { id: 'userId' };
      req.body = { firstName: 'Jane' };

      await userController.updateUser(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
