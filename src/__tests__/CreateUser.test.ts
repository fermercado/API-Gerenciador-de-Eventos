import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../models/UserModel';
import sinon from 'sinon';

describe('User Creation', () => {
  let mongoServer: any;

  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri, {});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });
  afterEach(async () => {
    await User.deleteMany({});
    sinon.restore();
  });

  it('create a user successfully', async () => {
    const mockUser = {
      firstName: 'Maria',
      lastName: 'Silva',
      birthDate: '1988-01-11',
      city: 'São Paulo',
      country: 'Brasil',
      email: 'mariasilva@gmail.com',
      password: 'password123',
      confirmPassword: 'password123',
    };

    const response = await request(app)
      .post('/api/v1/users/sign-up')
      .set('Content-Type', 'application/json')
      .send(mockUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('firstName', 'Maria');
    expect(response.body).toHaveProperty('lastName', 'Silva');

    const createdUser = await User.findOne({ email: mockUser.email });
    expect(createdUser).toBeTruthy();
    expect(createdUser?.firstName).toBe('Maria');
    expect(createdUser?.lastName).toBe('Silva');
  });

  it('validation errors for invalid input', async () => {
    const response = await request(app)
      .post('/api/v1/users/sign-up')
      .set('Content-Type', 'application/json')
      .send({
        firstName: 'Maria',
        lastName: 'Silva',
        birthDate: '01/01/1990',
        city: 'São Paulo',
        country: 'Brasil',
        email: 'maria@gmail.com',
        password: 'password123',
        confirmPassword: 'password123',
      });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeTruthy();
  });

  it('validation errors for missing first name', async () => {
    const response = await request(app)
      .post('/api/v1/users/sign-up')
      .set('Content-Type', 'application/json')
      .send({
        lastName: 'Silva',
        birthDate: '1988-01-11',
        city: 'São Paulo',
        country: 'Brasil',
        email: 'silva@gmail.com',
        password: 'password123',
        confirmPassword: 'password123',
      });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeTruthy();
    expect(
      response.body.errors.some((error: any) => error.field === 'firstName'),
    ).toBe(true);
  });

  it('validation errors for non-matching passwords', async () => {
    const response = await request(app)
      .post('/api/v1/users/sign-up')
      .set('Content-Type', 'application/json')
      .send({
        firstName: 'Maria',
        lastName: 'Silva',
        birthDate: '1988-01-11',
        city: 'São Paulo',
        country: 'Brasil',
        email: 'maria.s@gmail.com',
        password: 'password123',
        confirmPassword: 'differentPassword',
      });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeTruthy();
    expect(
      response.body.errors.some(
        (error: any) => error.field === 'confirmPassword',
      ),
    ).toBe(true);
  });
  it('validation error for invalid email format', async () => {
    const mockUserWithInvalidEmail = {
      firstName: 'Maria',
      lastName: 'Silva',
      birthDate: '1988-01-11',
      city: 'São Paulo',
      country: 'Brasil',
      email: 'invalid-email',
      password: 'password123',
      confirmPassword: 'password123',
    };

    const response = await request(app)
      .post('/api/v1/users/sign-up')
      .set('Content-Type', 'application/json')
      .send(mockUserWithInvalidEmail);

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeTruthy();
    expect(
      response.body.errors.some((error: any) => error.field === 'email'),
    ).toBe(true);
    expect(
      response.body.errors.some((error: any) =>
        error.message.includes('Invalid email format'),
      ),
    ).toBe(true);
  });

  it('reject duplicate email', async () => {
    await request(app)
      .post('/api/v1/users/sign-up')
      .set('Content-Type', 'application/json')
      .send({
        firstName: 'Maria',
        lastName: 'Silva',
        birthDate: '1988-01-11',
        city: 'São Paulo',
        country: 'Brasil',
        email: 'maria.silva@gmail.com',
        password: 'password123',
        confirmPassword: 'password123',
      });

    const response = await request(app)
      .post('/api/v1/users/sign-up')
      .set('Content-Type', 'application/json')
      .send({
        firstName: 'Maria',
        lastName: 'Silva',
        birthDate: '1988-01-11',
        city: 'São Paulo',
        country: 'Brasil',
        email: 'maria.silva@gmail.com',
        password: 'password123',
        confirmPassword: 'password123',
      });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeTruthy();
    expect(
      response.body.errors.some(
        (error: any) => error.message === 'This email already exists',
      ),
    ).toBe(true);
  });
  it('handle server errors during user creation', async () => {
    const createUserSpy = sinon.stub(User, 'create');
    createUserSpy.throws(new Error('Internal server error'));

    const mockUser = {
      firstName: 'Maria',
      lastName: 'Silva',
      birthDate: '1988-01-11',
      city: 'São Paulo',
      country: 'Brasil',
      email: 'maria@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    };

    const response = await request(app)
      .post('/api/v1/users/sign-up')
      .send(mockUser);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: 'Internal Server Error',
      message: 'Something went wrong',
    });

    createUserSpy.restore();
  });
});
