import bcrypt from 'bcryptjs';
import { UserValidationService } from '../../services/validationServices/UserValidationServices';
import User from '../../models/UserModel';
import { ApplicationError } from '../../error/ApplicationError';
import { ValidateLoginDTO } from '../../dtos/user/ValidateLoginDto';
import { UpdateUserDTO } from '../../dtos/user/UpdateUserDto';
import { formatDateToISO } from '../../utils/dateUtils';

jest.mock('../../models/UserModel');
jest.mock('bcryptjs');
jest.mock('../../utils/dateUtils');

describe('UserValidationService', () => {
  let userValidationService: UserValidationService;

  beforeEach(() => {
    userValidationService = new UserValidationService();
  });

  describe('validateUserExists', () => {
    it('should throw an error if the user already exists', async () => {
      (User.findOne as jest.Mock).mockResolvedValue({
        email: 'existing@example.com',
      });

      await expect(
        userValidationService.validateUserExists('existing@example.com'),
      ).rejects.toThrow(ApplicationError);
      expect(User.findOne).toHaveBeenCalledWith({
        email: 'existing@example.com',
      });
    });

    it('should not throw an error if the user does not exist', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        userValidationService.validateUserExists('new@example.com'),
      ).resolves.not.toThrow();
      expect(User.findOne).toHaveBeenCalledWith({ email: 'new@example.com' });
    });
  });

  describe('validateLogin', () => {
    it('should throw an error if the password does not match', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const validateLoginDTO: ValidateLoginDTO = {
        email: 'user@example.com',
        password: 'password',
        hashedPassword: 'hashedPassword',
      };

      await expect(
        userValidationService.validateLogin(validateLoginDTO),
      ).rejects.toThrow(ApplicationError);
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedPassword');
    });

    it('should not throw an error if the password matches', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const validateLoginDTO: ValidateLoginDTO = {
        email: 'user@example.com',
        password: 'password',
        hashedPassword: 'hashedPassword',
      };

      await expect(
        userValidationService.validateLogin(validateLoginDTO),
      ).resolves.not.toThrow();
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedPassword');
    });
  });

  describe('validateAndFormatBirthDate', () => {
    it('should format the birth date correctly', () => {
      const date = '1990-01-01';
      const formattedDate = new Date(date);
      (formatDateToISO as jest.Mock).mockReturnValue(formattedDate);

      const result = userValidationService.validateAndFormatBirthDate(date);

      expect(formatDateToISO).toHaveBeenCalledWith(date);
      expect(result).toBe(formattedDate);
    });
  });

  describe('validateUpdateData', () => {
    it('should validate email if provided', async () => {
      const updateUserDTO: UpdateUserDTO = { email: 'new@example.com' };

      const validateUserExistsSpy = jest
        .spyOn(userValidationService, 'validateUserExists')
        .mockResolvedValue();

      await userValidationService.validateUpdateData(updateUserDTO);

      expect(validateUserExistsSpy).toHaveBeenCalledWith('new@example.com');
    });

    it('should format birth date if provided', async () => {
      const date = '1990-01-01';
      const formattedDate = new Date(date);
      (formatDateToISO as jest.Mock).mockReturnValue(formattedDate);

      const updateUserDTO: UpdateUserDTO = {
        birthDate: date as unknown as Date,
      };

      await userValidationService.validateUpdateData(updateUserDTO);

      expect(formatDateToISO).toHaveBeenCalledWith(date);
      expect(updateUserDTO.birthDate).toBe(formattedDate);
    });

    it('should handle both email and birth date', async () => {
      const date = '1990-01-01';
      const formattedDate = new Date(date);
      const updateUserDTO: UpdateUserDTO = {
        email: 'new@example.com',
        birthDate: date as unknown as Date,
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (formatDateToISO as jest.Mock).mockReturnValue(formattedDate);

      await userValidationService.validateUpdateData(updateUserDTO);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'new@example.com' });
      expect(formatDateToISO).toHaveBeenCalledWith(date);
      expect(updateUserDTO.birthDate).toBe(formattedDate);
    });
  });
});
