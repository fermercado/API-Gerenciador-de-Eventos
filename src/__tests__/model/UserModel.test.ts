import UserModel, { IUser } from '../../models/UserModel';
import { formatDateToBrazilian } from '../../utils/dateUtils';

jest.mock('../../utils/dateUtils', () => ({
  formatDateToBrazilian: jest.fn(() => '01/01/1990'),
}));

describe('UserModel', () => {
  let user: IUser;

  beforeAll(() => {
    user = new UserModel({
      firstName: 'John',
      lastName: 'Doe',
      birthDate: new Date(1990, 0, 1),
      city: 'City',
      country: 'Country',
      email: 'john.doe@example.com',
      password: 'password123',
    });
  });

  it('should format birthDate and remove password in toObject transformation', () => {
    const userObject = user.toObject();

    expect(userObject.password).toBeUndefined();
    expect(userObject.birthDate).toBe('01/01/1990');
    expect(formatDateToBrazilian).toHaveBeenCalledWith(new Date(1990, 0, 1));
  });

  it('should format birthDate and remove password in toJSON transformation', () => {
    const userJSON = user.toJSON();

    expect(userJSON.password).toBeUndefined();
    expect(userJSON.birthDate).toBe('01/01/1990');
    expect(formatDateToBrazilian).toHaveBeenCalledWith(new Date(1990, 0, 1));
  });
});
