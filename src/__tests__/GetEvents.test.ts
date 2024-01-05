import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../models/UserModel';
import Event from '../models/EventModel';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface Event {
  description: string;
  dayOfWeek: string;
  userId: string;
}

describe('Get Events', () => {
  let mongoServer: any;
  let userToken: string;
  let userId: string;

  const createTestUserAndEvent = async () => {
    await User.deleteMany({});
    await Event.deleteMany({});

    const passwordHash = await bcrypt.hash('password123', 10);
    const user = await User.create({
      firstName: 'Maria',
      lastName: 'Silva',
      email: 'maria@gmail.com',
      password: passwordHash,
      birthDate: '1988-01-11',
      city: 'São Paulo',
      country: 'Brasil',
    });

    userId = user._id;
    userToken = jwt.sign({ userId: userId }, process.env.JWT_SECRET || '', {
      expiresIn: '1h',
    });

    await Event.create({
      description: 'Maria Event',
      dayOfWeek: 'monday',
      userId: userId,
    });
  };

  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri, {});
    await createTestUserAndEvent();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await createTestUserAndEvent();
  });

  it('should retrieve only user events', async () => {
    const response = await request(app)
      .get('/api/v1/events')
      .query({ onlyMyEvents: 'true' })
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(
      response.body.every(
        (event: Event) => event.userId.toString() === userId.toString(),
      ),
    ).toBeTruthy();
  });

  it('should retrieve events', async () => {
    const response = await request(app)
      .get('/api/v1/events')
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should handle unauthorized access', async () => {
    const response = await request(app)
      .get('/api/v1/events')
      .set('Authorization', 'Bearer invalidToken');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Not authenticated',
    });
  });

  it('should retrieve events by dayOfWeek', async () => {
    const response = await request(app)
      .get('/api/v1/events')
      .query({ dayOfWeek: 'monday' })
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(
      response.body.some((event: Event) => event.dayOfWeek === 'monday'),
    ).toBeTruthy();
  });

  it('should handle no events on specified day error', async () => {
    const response = await request(app)
      .get('/api/v1/events')
      .query({ dayOfWeek: 'sunday' })
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      statusCode: 404,
      error: 'Not Found',
      message: 'No events found',
    });
  });

  it('should retrieve events by description', async () => {
    const response = await request(app)
      .get('/api/v1/events')
      .query({ description: 'Maria Event' })
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(
      response.body.some((event: Event) => event.description === 'Maria Event'),
    ).toBeTruthy();
  });

  it('should handle no events found error', async () => {
    await Event.deleteMany({});
    let response = await request(app)
      .get('/api/v1/events?onlyMyEvents=true')
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      statusCode: 404,
      error: 'Not Found',
      message: 'No events created by this user.',
    });

    response = await request(app)
      .get('/api/v1/events')
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      statusCode: 404,
      error: 'Not Found',
      message: 'No events found',
    });
  });

  it('should handle server error during event retrieval', async () => {
    jest.spyOn(Event, 'find').mockImplementationOnce(() => {
      throw new Error('Test Error');
    });

    const response = await request(app)
      .get('/api/v1/events')
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'Something went wrong',
    });

    jest.restoreAllMocks();
  });
});
