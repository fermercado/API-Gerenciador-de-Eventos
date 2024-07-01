import User, { IUser } from '../../models/UserModel';

export class UserRepository {
  async create(data: Partial<IUser>): Promise<IUser> {
    return User.create(data);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email });
  }

  async updateById(
    userId: string,
    data: Partial<IUser>,
  ): Promise<IUser | null> {
    return User.findByIdAndUpdate(userId, data, { new: true });
  }
}
