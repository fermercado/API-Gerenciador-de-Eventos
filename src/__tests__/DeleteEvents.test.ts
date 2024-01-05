import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../models/UserModel';
import Event from '../models/EventModel';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

describe('Delete Events', () => {
  let mongoServer: MongoMemoryServer;
  let userToken: string;
  let userId: any;

  const createTestEvents = async () => {
    await Event.create([
      { description: 'Event 1', dayOfWeek: 'monday', userId },
      { description: 'Event 2', dayOfWeek: 'tuesday', userId },
    ]);
  };

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(await mongoUri);

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

    userId = user._id.toString();
    userToken = jwt.sign({ userId }, process.env.JWT_SECRET || '', {
      expiresIn: '1h',
    });

    await createTestEvents();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Event.deleteMany({});
    await createTestEvents();
  });

  it('should return Unauthorized if User Not Authenticated', async () => {
    const response = await request(app)
      .delete('/api/v1/events')
      .query({ dayOfWeek: 'monday' });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Not Authenticated',
    });
  });

  it('should return Bad Request for Invalid Day of Week', async () => {
    const response = await request(app)
      .delete('/api/v1/events')
      .query({ dayOfWeek: 'invalid-day' })
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Invalid day of the week.',
    });
  });

  it('should return Bad Request if Day of Week Not Provided', async () => {
    const response = await request(app)
      .delete('/api/v1/events')
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Invalid information',
    });
  });

  it('should return Not Found if No Events to Delete', async () => {
    const response = await request(app)
      .delete('/api/v1/events')
      .query({ dayOfWeek: 'sunday' })
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      statusCode: 404,
      error: 'Not Found',
      message: 'No events found for deletion.',
    });
  });

  it('should Delete and Return Events by Day of Week', async () => {
    const response = await request(app)
      .delete('/api/v1/events')
      .query({ dayOfWeek: 'monday' })
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.deletedEvents).toBeInstanceOf(Array);
    expect(response.body.deletedEvents).toHaveLength(1);
  });

  it('should return Internal Server Error on Server Failure', async () => {
    jest.spyOn(Event, 'find').mockImplementationOnce(() => {
      throw new Error();
    });

    const response = await request(app)
      .delete('/api/v1/events')
      .query({ dayOfWeek: 'monday' })
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(500);

    jest.restoreAllMocks();
  });

  it('should Delete and Return Events for Each Day', async () => {
    const daysOfWeek = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ];
    for (const day of daysOfWeek) {
      await Event.create({
        description: `Event on ${day}`,
        dayOfWeek: day,
        userId,
      });

      const response = await request(app)
        .delete('/api/v1/events')
        .query({ dayOfWeek: day })
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.deletedEvents).toBeInstanceOf(Array);

      response.body.deletedEvents.forEach((event: { dayOfWeek: any }) => {
        expect(event.dayOfWeek).toBe(day);
      });

      const remainingEvents = await Event.find({ dayOfWeek: day, userId });
      expect(remainingEvents).toHaveLength(0);
    }
  });

  it('should return Not Found if No Events on Specified Day', async () => {
    await Event.deleteMany({ dayOfWeek: 'wednesday' });
    const response = await request(app)
      .delete('/api/v1/events')
      .query({ dayOfWeek: 'wednesday' })
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      statusCode: 404,
      error: 'Not Found',
      message: 'No events found for deletion.',
    });
  });

  it('should Not Delete Other Users Events', async () => {
    const anotherUser = await User.create({
      firstName: 'João',
      lastName: 'Silva',
      email: 'joao@gmail.com',
      password: bcrypt.hashSync('password456', 10),
      birthDate: '1990-05-15',
      city: 'Rio de Janeiro',
      country: 'Brasil',
    });

    const anotherUserId = anotherUser._id.toString();
    await Event.create({
      description: 'Event 3',
      dayOfWeek: 'monday',
      userId: anotherUserId,
    });

    const response = await request(app)
      .delete('/api/v1/events')
      .query({ dayOfWeek: 'monday' })
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.deletedEvents).toHaveLength(1);

    const remainingEvent = await Event.findOne({
      userId: anotherUserId,
      dayOfWeek: 'monday',
    });
    expect(remainingEvent).not.toBeNull();
  });

  it('should Fail to Delete Events Without Authentication', async () => {
    const response = await request(app)
      .delete('/api/v1/events')
      .query({ dayOfWeek: 'monday' });

    expect(response.status).toBe(401);
  });
});
