import { formatUserResponse } from '../../utils/formatUserResponse';

describe('formatUserResponse', () => {
  it('should format user with _id correctly', () => {
    const user = {
      _id: '60b8d295f8d3c8277c417f96',
      firstName: 'John',
      lastName: 'Doe',
      birthDate: '1990-01-01',
      city: 'City',
      country: 'Country',
      email: 'john.doe@example.com',
    };

    const formattedUser = formatUserResponse(user);

    expect(formattedUser).toEqual({
      id: '60b8d295f8d3c8277c417f96',
      firstName: 'John',
      lastName: 'Doe',
      birthDate: '1990-01-01',
      city: 'City',
      country: 'Country',
      email: 'john.doe@example.com',
    });
  });

  it('should format user with id correctly', () => {
    const user = {
      id: '60b8d295f8d3c8277c417f96',
      firstName: 'John',
      lastName: 'Doe',
      birthDate: '1990-01-01',
      city: 'City',
      country: 'Country',
      email: 'john.doe@example.com',
    };

    const formattedUser = formatUserResponse(user);

    expect(formattedUser).toEqual({
      id: '60b8d295f8d3c8277c417f96',
      firstName: 'John',
      lastName: 'Doe',
      birthDate: '1990-01-01',
      city: 'City',
      country: 'Country',
      email: 'john.doe@example.com',
    });
  });

  it('should handle missing id and _id fields', () => {
    const user = {
      firstName: 'John',
      lastName: 'Doe',
      birthDate: '1990-01-01',
      city: 'City',
      country: 'Country',
      email: 'john.doe@example.com',
    };

    const formattedUser = formatUserResponse(user);

    expect(formattedUser).toEqual({
      id: undefined,
      firstName: 'John',
      lastName: 'Doe',
      birthDate: '1990-01-01',
      city: 'City',
      country: 'Country',
      email: 'john.doe@example.com',
    });
  });
});
