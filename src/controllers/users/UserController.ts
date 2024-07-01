import { Request, Response, NextFunction } from 'express';
import { UserService } from '../../services/user/UserService';
import { CreateUserDTO } from '../../dtos/user/CreateUserDto';
import { LoginUserDTO } from '../../dtos/user/LoginUserDto';
import { UpdateUserDTO } from '../../dtos/user/UpdateUserDto';
import { ApplicationError } from '../../error/ApplicationError';
import { formatUserResponse } from '../../utils/formatUserResponse';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public createUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const userDto: CreateUserDTO = req.body;
      const user = await this.userService.createUser(userDto);
      const userResponse = formatUserResponse(user);

      return res.status(201).json(userResponse);
    } catch (error: any) {
      next(error);
    }
  };

  public loginUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const loginDto: LoginUserDTO = req.body;
      const result = await this.userService.loginUser(loginDto);

      return res.status(200).json({
        token: result.token,
        user: formatUserResponse(result.user),
      });
    } catch (error: any) {
      next(new ApplicationError('Invalid email or password', 400));
    }
  };

  public updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const userId = req.params.id;
      const updateDto: UpdateUserDTO = req.body;
      const user = await this.userService.updateUser(userId, updateDto);
      const userResponse = formatUserResponse(user);

      return res.status(200).json(userResponse);
    } catch (error: any) {
      next(error);
    }
  };
}
