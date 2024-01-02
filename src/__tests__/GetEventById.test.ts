import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../models/UserModel';
import Event from '../models/EventModel';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

describe('Get Event By ID', () => {
  let mongoServer: MongoMemoryServer;
  let userToken: string;
  let testEventId: string;

  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri, {});

    const user = await createUser();
    userToken = generateUserToken(user._id);
    testEventId = await createTestEvent(user._id);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('retrieves event by ID', async () => {
    const response = await request(app)
      .get(`/api/v1/events/${testEventId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', testEventId.toString());
  });

  it('handles non-existent ID', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .get(`/api/v1/events/${nonExistentId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      statusCode: 404,
      error: 'Not Found',
      message: 'Event not found.',
    });
  });

  it('handles server error', async () => {
    jest.spyOn(Event, 'findOne').mockImplementationOnce(() => {
      throw new Error('Test Error');
    });

    const response = await request(app)
      .get(`/api/v1/events/${new mongoose.Types.ObjectId()}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Internal Server Error');
  });

  async function createUser() {
    const passwordHash = await bcrypt.hash('password123', 10);
    return await User.create({
      firstName: 'Maria',
      lastName: 'Silva',
      email: 'maria@gmail.com',
      password: passwordHash,
      birthDate: '1988-01-11',
      city: 'São Paulo',
      country: 'Brasil',
    });
  }

  function generateUserToken(userId: string) {
    return jwt.sign({ userId }, process.env.JWT_SECRET || '', {
      expiresIn: '1h',
    });
  }

  async function createTestEvent(userId: string) {
    const testEvent = await Event.create({
      description: 'Test Event',
      dayOfWeek: 'monday',
      userId,
    });
    return testEvent._id;
  }

  it('handles invalid event ID format', async () => {
    const invalidId = '123';
    const response = await request(app)
      .get(`/api/v1/events/${invalidId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Invalid event ID format.',
    });
  });
});
