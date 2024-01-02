import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import sinon from 'sinon';
import bcrypt from 'bcrypt';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../models/UserModel';

describe('User Login', () => {
  let mongoServer: MongoMemoryServer;
  let clock: sinon.SinonFakeTimers;

  const createUserForTest = async () => {
    let password = 'password123';
    if (process.env.NODE_ENV !== 'test') {
      password = await bcrypt.hash(password, 10);
    }

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

  beforeEach(async () => {
    clock = sinon.useFakeTimers();
    process.env.NODE_ENV = 'production';
    await User.deleteMany({});
    await createUserForTest();
  });

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
    sinon.restore();
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

  it('should log in a user with direct password comparison in test environment', async () => {
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

  it('successfully log in a user and generate a token', async () => {
    const response = await request(app)
      .post('/api/v1/users/sign-in')
      .set('Content-Type', 'application/json')
      .send({
        email: 'maria@gmail.com',
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.token).not.toBe('');
    expect(response.body).toHaveProperty('firstName', 'Maria');
    expect(response.body).toHaveProperty('lastName', 'Silva');
    expect(response.body).toHaveProperty('email', 'maria@gmail.com');
  });

  it('should expire token after 1 hour', async () => {
    const loginResponse = await request(app)
      .post('/api/v1/users/sign-in')
      .send({ email: 'maria@gmail.com', password: 'password123' });

    const token = loginResponse.body.token;
    expect(token).toBeDefined();

    clock.tick(61 * 60 * 1000);

    const protectedResponse = await request(app)
      .get('/api/v1/events')
      .set('Authorization', `Bearer ${token}`);

    expect(protectedResponse.status).toBe(401);
    expect(protectedResponse.body).toHaveProperty('error', 'Unauthorized');
  });
  it('should return 500 if an internal error occurs', async () => {
    const findOneSpy = sinon.stub(User, 'findOne');
    findOneSpy.throws(new Error('Internal server error'));

    const response = await request(app)
      .post('/api/v1/users/sign-in')
      .send({ email: 'maria@gmail.com', password: 'password123' });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: 'Internal Server Error',
      message: 'Something went wrong',
    });

    findOneSpy.restore();
  });
});
