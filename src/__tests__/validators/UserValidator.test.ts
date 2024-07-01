import { userValidationSchema } from '../../validators/UserValidator';

describe('userValidationSchema', () => {
  it('should validate successfully with correct data', async () => {
    const validData = {
      firstName: 'John',
      lastName: 'Doe',
      birthDate: '01/01/1990',
      city: 'City',
      country: 'Country',
      email: 'john.doe@example.com',
      password: 'password',
      confirmPassword: 'password',
    };

    await expect(
      userValidationSchema.validate(validData),
    ).resolves.not.toThrow();
  });

  it('should throw an error for missing firstName', async () => {
    const invalidData = {
      lastName: 'Doe',
      birthDate: '01/01/1990',
      city: 'City',
      country: 'Country',
      email: 'john.doe@example.com',
      password: 'password',
      confirmPassword: 'password',
    };

    await expect(userValidationSchema.validate(invalidData)).rejects.toThrow(
      'First name is required.',
    );
  });

  it('should throw an error for firstName exceeding max length', async () => {
    const invalidData = {
      firstName: 'John'.repeat(6),
      lastName: 'Doe',
      birthDate: '01/01/1990',
      city: 'City',
      country: 'Country',
      email: 'john.doe@example.com',
      password: 'password',
      confirmPassword: 'password',
    };

    await expect(userValidationSchema.validate(invalidData)).rejects.toThrow(
      'First name must be at most 20 characters long.',
    );
  });

  it('should throw an error for invalid firstName characters', async () => {
    const invalidData = {
      firstName: 'John123',
      lastName: 'Doe',
      birthDate: '01/01/1990',
      city: 'City',
      country: 'Country',
      email: 'john.doe@example.com',
      password: 'password',
      confirmPassword: 'password',
    };

    await expect(userValidationSchema.validate(invalidData)).rejects.toThrow(
      'First name must only contain letters.',
    );
  });

  it('should throw an error for invalid birth date format', async () => {
    const invalidData = {
      firstName: 'John',
      lastName: 'Doe',
      birthDate: '1990-01-01',
      city: 'City',
      country: 'Country',
      email: 'john.doe@example.com',
      password: 'password',
      confirmPassword: 'password',
    };

    await expect(userValidationSchema.validate(invalidData)).rejects.toThrow(
      'Invalid birth date format. Please use DD/MM/YYYY',
    );
  });

  it('should throw an error for invalid email format', async () => {
    const invalidData = {
      firstName: 'John',
      lastName: 'Doe',
      birthDate: '01/01/1990',
      city: 'City',
      country: 'Country',
      email: 'invalid-email',
      password: 'password',
      confirmPassword: 'password',
    };

    await expect(userValidationSchema.validate(invalidData)).rejects.toThrow(
      'Invalid email format.',
    );
  });

  it('should throw an error for password less than 6 characters', async () => {
    const invalidData = {
      firstName: 'John',
      lastName: 'Doe',
      birthDate: '01/01/1990',
      city: 'City',
      country: 'Country',
      email: 'john.doe@example.com',
      password: 'pass',
      confirmPassword: 'pass',
    };

    await expect(userValidationSchema.validate(invalidData)).rejects.toThrow(
      'Password must be at least 6 characters long.',
    );
  });

  it('should throw an error for non-matching passwords', async () => {
    const invalidData = {
      firstName: 'John',
      lastName: 'Doe',
      birthDate: '01/01/1990',
      city: 'City',
      country: 'Country',
      email: 'john.doe@example.com',
      password: 'password',
      confirmPassword: 'differentPassword',
    };

    await expect(userValidationSchema.validate(invalidData)).rejects.toThrow(
      'Passwords must match',
    );
  });

  it('should throw an error for missing confirmPassword', async () => {
    const invalidData = {
      firstName: 'John',
      lastName: 'Doe',
      birthDate: '01/01/1990',
      city: 'City',
      country: 'Country',
      email: 'john.doe@example.com',
      password: 'password',
    };

    await expect(userValidationSchema.validate(invalidData)).rejects.toThrow(
      'Confirm password is required',
    );
  });
});
