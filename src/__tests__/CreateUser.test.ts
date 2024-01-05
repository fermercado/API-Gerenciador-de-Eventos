import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import UserModel from '../models/UserModel';
import bcrypt from 'bcryptjs';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(await mongoUri, {});
});

afterEach(async () => {
  jest.clearAllMocks();
  await UserModel.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('User Creation', () => {
  it('should successfully create a new user', async () => {
    const userData = {
      firstName: 'Maria',
      lastName: 'Silva',
      birthDate: '1990-01-01',
      city: 'São Paulo',
      country: 'Brasil',
      email: 'maria@gmail.com',
      password: 'Password123',
      confirmPassword: 'Password123',
    };

    const response = await request(app)
      .post('/api/v1/users/sign-up')
      .send(userData);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('email', userData.email);
  });

  it('should return 400 for invalid data', async () => {
    const userData = {};

    const response = await request(app)
      .post('/api/v1/users/sign-up')
      .send(userData);

    expect(response.statusCode).toBe(400);
  });

  it('should not create a user with an existing email', async () => {
    await UserModel.create({
      firstName: 'Maria',
      lastName: 'Silva',
      birthDate: '1990-01-02',
      city: 'São Paulo',
      country: 'Brasil',
      email: 'maria@gmail.com',
      password: 'Password123',
    });

    const response = await request(app).post('/api/v1/users/sign-up').send({
      firstName: 'Maria',
      lastName: 'Silva',
      birthDate: '1990-01-02',
      city: 'São Paulo',
      country: 'Brasil',
      email: 'maria@gmail.com',
      password: 'Password123',
      confirmPassword: 'Password123',
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(
      expect.objectContaining({
        error: 'Email already exists',
      }),
    );
  });

  it('should not create a user if password confirmation does not match', async () => {
    const userData = {
      firstName: 'Maria',
      lastName: 'Silva',
      birthDate: '1990-01-02',
      city: 'São Paulo',
      country: 'Brasil',
      email: 'maria@gmail.com',
      password: 'Password123',
      confirmPassword: 'Password1234',
    };

    const response = await request(app)
      .post('/api/v1/users/sign-up')
      .send(userData);

    expect(response.statusCode).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'confirmPassword',
          message: 'Passwords must match',
        }),
      ]),
    );
  });

  it('should handle unexpected errors', async () => {
    jest
      .spyOn(UserModel, 'create')
      .mockImplementationOnce(() =>
        Promise.reject(new Error('Unexpected error')),
      );

    const userData = {
      firstName: 'Maria',
      lastName: 'Silva',
      birthDate: '1990-01-02',
      city: 'São Paulo',
      country: 'Brasil',
      email: 'maria@gmail.com',
      password: 'Password123',
      confirmPassword: 'Password123',
    };

    const response = await request(app)
      .post('/api/v1/users/sign-up')
      .send(userData);

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(
      expect.objectContaining({
        error: 'Internal Server Error',
      }),
    );
  });

  describe('User Creation with different NODE_ENV', () => {
    let originalNodeEnv: string;

    beforeEach(() => {
      jest.clearAllMocks();
      originalNodeEnv = process.env.NODE_ENV || 'development';
    });

    afterEach(() => {
      process.env.NODE_ENV = originalNodeEnv;
    });

    it('should use 10 saltRounds when NODE_ENV is not test', async () => {
      process.env.NODE_ENV = 'development';
      UserModel.create = jest
        .fn()
        .mockImplementation((userData: any) => Promise.resolve(userData));
      const hashSpy = jest.spyOn(bcrypt, 'hash');

      const userData = {
        firstName: 'Maria',
        lastName: 'Silva',
        birthDate: '1990-01-02',
        city: 'São Paulo',
        country: 'Brasil',
        email: 'maria@gmail.com',
        password: 'Password123',
        confirmPassword: 'Password123',
      };

      await request(app).post('/api/v1/users/sign-up').send(userData);
      expect(hashSpy).toHaveBeenCalledWith(userData.password, 10);
      hashSpy.mockRestore();
    });
  });

  describe('User Creation Validation', () => {
    it('should return validation errors if the request data is invalid', async () => {
      const invalidUserData = {
        firstName: '',
        lastName: '',
        birthDate: '05/05/2000',
        city: '',
        country: '',
        email: 'invalid email',
        password: 'pass',
        confirmPassword: 'passw',
      };

      const response = await request(app)
        .post('/api/v1/users/sign-up')
        .send(invalidUserData);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toBeInstanceOf(Array);
      expect(response.body.errors).toHaveLength(8);

      response.body.errors.forEach((error: any) => {
        expect(error).toHaveProperty('field');
        expect(error).toHaveProperty('message');
      });
    });
  });
});
