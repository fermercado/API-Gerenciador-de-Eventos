import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../models/UserModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

describe('Event Creation', () => {
  let mongoServer: any;
  let userToken: string;
  let userId: string;

  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri, {});

    const passwordHash = await bcrypt.hash('password123', 10);
    const user = await User.create({
      firstName: 'Maria',
      lastName: 'Silva',
      email: 'maria@gmail.com',
      password: passwordHash,
      birthDate: '1990-01-11',
      city: 'São Paulo',
      country: 'Brasil',
    });

    userId = user._id;
    userToken = jwt.sign({ userId: userId }, process.env.JWT_SECRET || '', {
      expiresIn: '1h',
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should create an event successfully', async () => {
    const mockEvent = {
      description: 'Maria Event',
      dayOfWeek: 'monday',
    };

    const response = await request(app)
      .post('/api/v1/events')
      .set('Authorization', `Bearer ${userToken}`)
      .send(mockEvent);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('description', 'Maria Event');
    expect(response.body).toHaveProperty('dayOfWeek', 'monday');
    expect(response.body).toHaveProperty('userId', userId.toString());
  });

  it('should return validation errors for invalid input', async () => {
    const response = await request(app)
      .post('/api/v1/events')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        description: '',
        dayOfWeek: 'invalid-day',
      });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeTruthy();
  });

  it('should reject event creation without authentication', async () => {
    const mockEvent = {
      description: 'Maria Event',
      dayOfWeek: 'tuesday',
    };

    const response = await request(app).post('/api/v1/events').send(mockEvent);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: 'Unauthorized',
      message: 'Not Authenticated',
    });
  });

  it('should return validation errors for missing fields', async () => {
    const response = await request(app)
      .post('/api/v1/events')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        description: 'Maria Event',
      });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeTruthy();
    expect(
      response.body.errors.some((error: any) => error.field === 'dayOfWeek'),
    ).toBe(true);
  });

  it('should reject event with invalid dayOfWeek', async () => {
    const response = await request(app)
      .post('/api/v1/events')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        description: 'Maria Event',
        dayOfWeek: 'notaday',
      });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeTruthy();
    expect(
      response.body.errors.some((error: any) => error.field === 'dayOfWeek'),
    ).toBe(true);
  });
});
