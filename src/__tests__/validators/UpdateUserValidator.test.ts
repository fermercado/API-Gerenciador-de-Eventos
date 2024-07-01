import { updateUserValidationSchema } from '../../validators/UpdateUserValidator';

describe('updateUserValidationSchema', () => {
  it('should validate a correct update user object', async () => {
    const validUser = {
      firstName: 'John',
      lastName: 'Doe',
      birthDate: '01/01/1990',
      city: 'City',
      country: 'Country',
      email: 'john.doe@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    };

    await expect(
      updateUserValidationSchema.validate(validUser),
    ).resolves.toEqual(validUser);
  });

  it('should fail if firstName is longer than 20 characters', async () => {
    const invalidUser = {
      firstName: 'A'.repeat(21),
    };

    await expect(
      updateUserValidationSchema.validate(invalidUser),
    ).rejects.toThrow('First name must be at most 20 characters long.');
  });

  it('should fail if lastName is longer than 50 characters', async () => {
    const invalidUser = {
      lastName: 'A'.repeat(51),
    };

    await expect(
      updateUserValidationSchema.validate(invalidUser),
    ).rejects.toThrow('Last name must be at most 50 characters long.');
  });

  it('should fail if birthDate is not in the format DD/MM/YYYY', async () => {
    const invalidUser = {
      birthDate: '1990-01-01',
    };

    await expect(
      updateUserValidationSchema.validate(invalidUser),
    ).rejects.toThrow('Invalid birth date format. Please use DD/MM/YYYY');
  });

  it('should fail if city contains non-letter characters', async () => {
    const invalidUser = {
      city: 'City123',
    };

    await expect(
      updateUserValidationSchema.validate(invalidUser),
    ).rejects.toThrow('City must only contain letters.');
  });

  it('should fail if country contains non-letter characters', async () => {
    const invalidUser = {
      country: 'Country123',
    };

    await expect(
      updateUserValidationSchema.validate(invalidUser),
    ).rejects.toThrow('Country must only contain letters.');
  });

  it('should fail if email is not valid', async () => {
    const invalidUser = {
      email: 'not-an-email',
    };

    await expect(
      updateUserValidationSchema.validate(invalidUser),
    ).rejects.toThrow('Invalid email format.');
  });

  it('should fail if password is less than 6 characters', async () => {
    const invalidUser = {
      password: '123',
    };

    await expect(
      updateUserValidationSchema.validate(invalidUser),
    ).rejects.toThrow('Password must be at least 6 characters long.');
  });

  it('should fail if passwords do not match', async () => {
    const invalidUser = {
      password: 'password123',
      confirmPassword: 'differentPassword',
    };

    await expect(
      updateUserValidationSchema.validate(invalidUser),
    ).rejects.toThrow('Passwords must match');
  });

  it('should fail if firstName is empty', async () => {
    const invalidUser = {
      firstName: '   ',
    };

    await expect(
      updateUserValidationSchema.validate(invalidUser),
    ).rejects.toThrow('First name cannot be empty');
  });

  it('should fail if lastName is empty', async () => {
    const invalidUser = {
      lastName: '   ',
    };

    await expect(
      updateUserValidationSchema.validate(invalidUser),
    ).rejects.toThrow('Last name cannot be empty');
  });

  it('should fail if city is empty', async () => {
    const invalidUser = {
      city: '   ',
    };

    await expect(
      updateUserValidationSchema.validate(invalidUser),
    ).rejects.toThrow('City cannot be empty');
  });

  it('should fail if country is empty', async () => {
    const invalidUser = {
      country: '   ',
    };

    await expect(
      updateUserValidationSchema.validate(invalidUser),
    ).rejects.toThrow('Country cannot be empty');
  });
});
