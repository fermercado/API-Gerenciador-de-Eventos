import bcrypt from 'bcryptjs';
import { formatDateToISO } from '../../utils/dateUtils';
import User from '../../models/UserModel';
import { ApplicationError } from '../../error/ApplicationError';
import { ValidateLoginDTO } from '../../dtos/user/ValidateLoginDto';
import { UpdateUserDTO } from '../../dtos/user/UpdateUserDto';

export class UserValidationService {
  async validateUserExists(email: string): Promise<void> {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApplicationError('Email already exists', 400);
    }
  }

  async validateLogin(data: ValidateLoginDTO): Promise<void> {
    const { password, hashedPassword } = data;
    const passwordMatch = await bcrypt.compare(password, hashedPassword);
    if (!passwordMatch) {
      throw new ApplicationError('Invalid email or password', 400);
    }
  }

  validateAndFormatBirthDate(date: string): Date {
    return formatDateToISO(date);
  }

  async validateUpdateData(data: UpdateUserDTO): Promise<void> {
    if (data.email) {
      await this.validateUserExists(data.email);
    }
    if (data.birthDate) {
      data.birthDate = this.validateAndFormatBirthDate(
        data.birthDate as unknown as string,
      );
    }
  }
}
