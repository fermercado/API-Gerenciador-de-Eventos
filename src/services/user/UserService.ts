import { IUserService } from '../../interfaces/IUserService';
import { CreateUserDTO } from '../../dtos/user/CreateUserDto';
import { LoginUserDTO } from '../../dtos/user/LoginUserDto';
import { UpdateUserDTO } from '../../dtos/user/UpdateUserDto';
import { ValidateLoginDTO } from '../../dtos/user/ValidateLoginDto';
import { UserRepository } from '../../services/repository/UserRepository';
import { HashService } from '../hash/HashService';
import { JwtService } from '../jwt/JwtService';
import { ApplicationError } from '../../error/ApplicationError';
import { UserValidationService } from '../validationServices/UserValidationServices';
import { IUser } from '../../models/UserModel';

export class UserService implements IUserService {
  private hashService: HashService;
  private jwtService: JwtService;
  private userValidationService: UserValidationService;
  private userRepository: UserRepository;

  constructor() {
    this.hashService = new HashService();
    this.jwtService = new JwtService();
    this.userValidationService = new UserValidationService();
    this.userRepository = new UserRepository();
  }

  async createUser(data: CreateUserDTO): Promise<Omit<IUser, 'password'>> {
    await this.userValidationService.validateUserExists(data.email);

    const hashedPassword = await this.hashService.hashPassword(data.password);
    const birthDate = this.userValidationService.validateAndFormatBirthDate(
      data.birthDate,
    );

    const user = await this.userRepository.create({
      ...data,
      birthDate,
      password: hashedPassword,
    });

    return user.toObject() as Omit<IUser, 'password'>;
  }

  async loginUser(
    data: LoginUserDTO,
  ): Promise<{ token: string; user: Omit<IUser, 'password'> }> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new ApplicationError('Email ou senha inválidos', 400);
    }

    const validateLoginData: ValidateLoginDTO = {
      email: data.email,
      password: data.password,
      hashedPassword: user.password,
    };

    await this.userValidationService.validateLogin(validateLoginData);

    const token = this.jwtService.generateToken({ userId: user._id });

    return {
      token,
      user: user.toObject() as Omit<IUser, 'password'>,
    };
  }

  async updateUser(
    userId: string,
    data: UpdateUserDTO,
  ): Promise<Omit<IUser, 'password'>> {
    await this.userValidationService.validateUpdateData(data);

    const updateData: Partial<IUser> = { ...data };

    if (data.password) {
      updateData.password = await this.hashService.hashPassword(data.password);
    }

    const user = await this.userRepository.updateById(userId, updateData);

    if (!user) {
      throw new ApplicationError('Usuário não encontrado', 404);
    }

    return user.toObject() as Omit<IUser, 'password'>;
  }
}
