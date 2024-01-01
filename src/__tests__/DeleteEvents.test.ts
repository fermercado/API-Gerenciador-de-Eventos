import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../models/UserModel';
import Event from '../models/EventModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

describe('Delete Events', () => {
  let mongoServer: any;
  let userToken: string;
  let userId: string;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri, {});

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
    userToken = jwt.sign({ userId: userId }, process.env.JWT_SECRET || '', {
      expiresIn: '1h',
    });

    await Event.create([
      { description: 'Event 1', dayOfWeek: 'monday', userId },
      { description: 'Event 2', dayOfWeek: 'tuesday', userId },
    ]);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });
  it('401 Unauthorized if the user is not authenticated', async () => {
    const response = await request(app)
      .delete('/api/v1/events')
      .query({ dayOfWeek: 'monday' });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: 'Unauthorized',
      message: 'Not Authenticated',
    });
  });

  it(' 404 Not Found if no events are found for deletion', async () => {
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

  it('Delete and return events by day', async () => {
    const response = await request(app)
      .delete('/api/v1/events')
      .query({ dayOfWeek: 'monday' })
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.deletedEvents).toBeInstanceOf(Array);
    expect(response.body.deletedEvents).toHaveLength(1);
    expect(response.body.deletedEvents[0].dayOfWeek).toBe('monday');
    expect(response.body.deletedEvents[0]).toHaveProperty('description');
    expect(response.body.deletedEvents[0]).toHaveProperty('_id');
    expect(response.body.deletedEvents[0]).toHaveProperty('userId');
  });

  it('deletes and returns events', async () => {
    const response = await request(app)
      .delete('/api/v1/events')
      .query({ dayOfWeek: 'tuesday' })
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.deletedEvents).toBeInstanceOf(Array);
    expect(response.body.deletedEvents.length).toBeGreaterThan(0);
    expect(response.body.deletedEvents[0]).toHaveProperty(
      'dayOfWeek',
      'tuesday',
    );
  });

  it('errors on invalid day', async () => {
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

  it('errors without day', async () => {
    const response = await request(app)
      .delete('/api/v1/events')
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Day of the week is required.',
    });
  });
});
