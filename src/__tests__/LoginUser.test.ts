import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../models/UserModel';

describe('User Login', () => {
  let mongoServer: any;

  const createUserForTest = async () => {
    const password =
      process.env.NODE_ENV === 'test'
        ? 'password123'
        : await bcrypt.hash('password123', 10);
    await User.create({
      firstName: 'Maria',
      lastName: 'Silva',
      email: 'maria@gmail.com',
      password: password,
      birthDate: '1988-01-11',
      city: 'São Paulo',
      country: 'Brasil',
    });
  };

  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri, {});
    await createUserForTest();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it('successfully log in a user', async () => {
    const response = await request(app)
      .post('/api/v1/users/sign-in')
      .set('Content-Type', 'application/json')
      .send({
        email: 'maria@gmail.com',
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('firstName', 'Maria');
    expect(response.body).toHaveProperty('lastName', 'Silva');
    expect(response.body).toHaveProperty('email', 'maria@gmail.com');
  });

  it('return error for invalid email', async () => {
    const response = await request(app)
      .post('/api/v1/users/sign-in')
      .set('Content-Type', 'application/json')
      .send({
        email: 'silva@gmail.com',
        password: 'password123',
      });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeTruthy();
  });

  it('return error for invalid password', async () => {
    const response = await request(app)
      .post('/api/v1/users/sign-in')
      .set('Content-Type', 'application/json')
      .send({
        email: 'maria@gmail.com',
        password: 'password12',
      });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeTruthy();
  });
});
