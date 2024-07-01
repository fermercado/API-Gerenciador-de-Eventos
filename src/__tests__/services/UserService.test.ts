import { UserService } from '../../services/user/UserService';
import { UserRepository } from '../../services/repository/UserRepository';
import { HashService } from '../../services/hash/HashService';
import { JwtService } from '../../services/jwt/JwtService';
import { UserValidationService } from '../../services/validationServices/UserValidationServices';
import { CreateUserDTO } from '../../dtos/user/CreateUserDto';
import { LoginUserDTO } from '../../dtos/user/LoginUserDto';
import { UpdateUserDTO } from '../../dtos/user/UpdateUserDto';
import { ApplicationError } from '../../error/ApplicationError';
import { IUser } from '../../models/UserModel';

jest.mock('../../services/repository/UserRepository');
jest.mock('../../services/hash/HashService');
jest.mock('../../services/jwt/JwtService');
jest.mock('../../services/validationServices/UserValidationServices');

describe('UserService', () => {
  let userService: UserService;
  let userRepository: jest.Mocked<UserRepository>;
  let hashService: jest.Mocked<HashService>;
  let jwtService: jest.Mocked<JwtService>;
  let userValidationService: jest.Mocked<UserValidationService>;

  beforeEach(() => {
    userRepository = new UserRepository() as jest.Mocked<UserRepository>;
    hashService = new HashService() as jest.Mocked<HashService>;
    jwtService = new JwtService() as jest.Mocked<JwtService>;
    userValidationService =
      new UserValidationService() as jest.Mocked<UserValidationService>;

    userService = new UserService();
    userService['userRepository'] = userRepository;
    userService['hashService'] = hashService;
    userService['jwtService'] = jwtService;
    userService['userValidationService'] = userValidationService;
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const createUserDTO: CreateUserDTO = {
        firstName: 'John',
        lastName: 'Doe',
        birthDate: '01/01/1990',
        city: 'City',
        country: 'Country',
        email: 'john.doe@example.com',
        password: 'password',
      };

      const hashedPassword = 'hashedPassword';
      const birthDate = new Date(1990, 0, 1);
      const user = {
        ...createUserDTO,
        password: hashedPassword,
        birthDate,
        toObject: jest
          .fn()
          .mockReturnValue({ ...createUserDTO, password: undefined }),
      } as unknown as IUser;

      userValidationService.validateUserExists.mockResolvedValue(undefined);
      userValidationService.validateAndFormatBirthDate.mockReturnValue(
        birthDate,
      );
      hashService.hashPassword.mockResolvedValue(hashedPassword);
      userRepository.create.mockResolvedValue(user);

      const result = await userService.createUser(createUserDTO);

      expect(userValidationService.validateUserExists).toHaveBeenCalledWith(
        createUserDTO.email,
      );
      expect(hashService.hashPassword).toHaveBeenCalledWith(
        createUserDTO.password,
      );
      expect(userRepository.create).toHaveBeenCalledWith({
        ...createUserDTO,
        password: hashedPassword,
        birthDate,
      });
      expect(result).toEqual({ ...createUserDTO, password: undefined });
    });

    it('should throw an error if the user already exists', async () => {
      const createUserDTO: CreateUserDTO = {
        firstName: 'John',
        lastName: 'Doe',
        birthDate: '01/01/1990',
        city: 'City',
        country: 'Country',
        email: 'john.doe@example.com',
        password: 'password',
      };

      userValidationService.validateUserExists.mockRejectedValue(
        new ApplicationError('Email already exists', 400),
      );

      await expect(userService.createUser(createUserDTO)).rejects.toThrow(
        ApplicationError,
      );
      expect(userValidationService.validateUserExists).toHaveBeenCalledWith(
        createUserDTO.email,
      );
      expect(hashService.hashPassword).not.toHaveBeenCalled();
      expect(userRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('loginUser', () => {
    it('should login a user successfully', async () => {
      const loginUserDTO: LoginUserDTO = {
        email: 'john.doe@example.com',
        password: 'password',
      };

      const user = {
        _id: 'userId',
        email: 'john.doe@example.com',
        password: 'hashedPassword',
        toObject: jest.fn().mockReturnValue({ email: 'john.doe@example.com' }),
      } as unknown as IUser;

      const token = 'token';

      userRepository.findByEmail.mockResolvedValue(user);
      userValidationService.validateLogin.mockResolvedValue(undefined);
      jwtService.generateToken.mockReturnValue(token);

      const result = await userService.loginUser(loginUserDTO);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        loginUserDTO.email,
      );
      expect(userValidationService.validateLogin).toHaveBeenCalledWith({
        email: loginUserDTO.email,
        password: loginUserDTO.password,
        hashedPassword: user.password,
      });
      expect(jwtService.generateToken).toHaveBeenCalledWith({
        userId: user._id,
      });
      expect(result).toEqual({
        token,
        user: { email: 'john.doe@example.com' },
      });
    });

    it('should throw an error if the user does not exist', async () => {
      const loginUserDTO: LoginUserDTO = {
        email: 'john.doe@example.com',
        password: 'password',
      };

      userRepository.findByEmail.mockResolvedValue(null);

      await expect(userService.loginUser(loginUserDTO)).rejects.toThrow(
        ApplicationError,
      );
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        loginUserDTO.email,
      );
      expect(userValidationService.validateLogin).not.toHaveBeenCalled();
      expect(jwtService.generateToken).not.toHaveBeenCalled();
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

      const userId = 'userId';

      const user = {
        ...updateUserDTO,
        toObject: jest
          .fn()
          .mockReturnValue({ ...updateUserDTO, password: undefined }),
      } as unknown as IUser;

      userValidationService.validateUpdateData.mockResolvedValue(undefined);
      userRepository.updateById.mockResolvedValue(user);

      const result = await userService.updateUser(userId, updateUserDTO);

      expect(userValidationService.validateUpdateData).toHaveBeenCalledWith(
        updateUserDTO,
      );
      expect(userRepository.updateById).toHaveBeenCalledWith(
        userId,
        updateUserDTO,
      );
      expect(result).toEqual({ ...updateUserDTO, password: undefined });
    });

    it('should update a user with a new password', async () => {
      const updateUserDTO: UpdateUserDTO = {
        firstName: 'Jane',
        lastName: 'Doe',
        city: 'New City',
        email: 'jane.doe@example.com',
        password: 'newpassword',
      };

      const userId = 'userId';

      const hashedPassword = 'hashedNewPassword';
      const user = {
        ...updateUserDTO,
        password: hashedPassword,
        toObject: jest
          .fn()
          .mockReturnValue({ ...updateUserDTO, password: undefined }),
      } as unknown as IUser;

      userValidationService.validateUpdateData.mockResolvedValue(undefined);
      hashService.hashPassword.mockResolvedValue(hashedPassword);
      userRepository.updateById.mockResolvedValue(user);

      const result = await userService.updateUser(userId, updateUserDTO);

      expect(userValidationService.validateUpdateData).toHaveBeenCalledWith(
        updateUserDTO,
      );
      expect(hashService.hashPassword).toHaveBeenCalledWith(
        updateUserDTO.password,
      );
      expect(userRepository.updateById).toHaveBeenCalledWith(userId, {
        ...updateUserDTO,
        password: hashedPassword,
      });
      expect(result).toEqual({ ...updateUserDTO, password: undefined });
    });

    it('should throw an error if the user is not found', async () => {
      const updateUserDTO: UpdateUserDTO = {
        firstName: 'Jane',
        lastName: 'Doe',
        city: 'New City',
        email: 'jane.doe@example.com',
      };

      const userId = 'userId';

      userValidationService.validateUpdateData.mockResolvedValue(undefined);
      userRepository.updateById.mockResolvedValue(null);

      await expect(
        userService.updateUser(userId, updateUserDTO),
      ).rejects.toThrow(ApplicationError);
      expect(userValidationService.validateUpdateData).toHaveBeenCalledWith(
        updateUserDTO,
      );
      expect(userRepository.updateById).toHaveBeenCalledWith(
        userId,
        updateUserDTO,
      );
    });
  });
});
