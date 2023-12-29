import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../models/UserModel';
import bcrypt from 'bcrypt';

describe('User Login', () => {
  let mongoServer: any;

  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri, {});

    const passwordHash = await bcrypt.hash('password123', 10);
    await User.create({
      firstName: 'Maria',
      lastName: 'Silva',
      email: 'maria@gmail.com',
      password: passwordHash,
      birthDate: '1988-01-11',
      city: 'São Paulo',
      country: 'Brasil',
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should successfully log in a user', async () => {
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

  it('should return error for invalid email', async () => {
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

  it('should return error for invalid password', async () => {
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
