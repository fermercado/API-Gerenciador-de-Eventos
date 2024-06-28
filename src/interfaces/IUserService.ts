import { CreateUserDTO } from '../dtos/user/CreateUserDto';
import { LoginUserDTO } from '../dtos/user/LoginUserDto';
import { IUser } from '../models/UserModel';

export interface IUserService {
  createUser(data: CreateUserDTO): Promise<Omit<IUser, 'password'>>;
  loginUser(
    data: LoginUserDTO,
  ): Promise<{ token: string; user: Omit<IUser, 'password'> }>;
}
