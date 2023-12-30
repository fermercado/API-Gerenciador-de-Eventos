import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../models/UserModel';
import Event from '../models/EventModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

describe('Delete Event By ID', () => {
  let mongoServer: any;
  let userToken: string;
  let anotherUserToken: string;
  let userId: string;
  let testEventId: string;
  let anotherEventId: string;

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

    userId = user._id;
    userToken = jwt.sign({ userId: userId }, process.env.JWT_SECRET || '', {
      expiresIn: '1h',
    });

    const anotherUser = await User.create({
      firstName: 'João',
      lastName: 'Pereira',
      email: 'joao@gmail.com',
      password: passwordHash,
      birthDate: '1990-01-01',
      city: 'Rio de Janeiro',
      country: 'Brasil',
    });

    anotherUserToken = jwt.sign(
      { userId: anotherUser._id },
      process.env.JWT_SECRET || '',
      {
        expiresIn: '1h',
      },
    );

    const testEvent = await Event.create({
      description: 'Maria Event',
      dayOfWeek: 'monday',
      userId,
    });
    testEventId = testEvent._id;

    const anotherEvent = await Event.create({
      description: 'Another Event',
      dayOfWeek: 'tuesday',
      userId: anotherUser._id,
    });
    anotherEventId = anotherEvent._id;
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  it('should successfully delete an event by ID', async () => {
    const response = await request(app)
      .delete(`/api/v1/events/${testEventId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(204);
  });

  it('should return a 404 for a non-existent event ID', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .delete(`/api/v1/events/${nonExistentId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Not Found',
      message: 'Event not found for deletion.',
    });
  });

  it('should return an error for invalid authentication token', async () => {
    const invalidToken = 'someInvalidTokenString';
    const response = await request(app)
      .delete(`/api/v1/events/${testEventId}`)
      .set('Authorization', `Bearer ${invalidToken}`);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: 'Unauthorized',
      message: 'Not Authenticated',
    });
  });

  it('should prevent a user from deleting an event they did not create', async () => {
    const response = await request(app)
      .delete(`/api/v1/events/${anotherEventId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error: 'Forbidden',
      message: 'You do not have permission to delete this event.',
    });
  });
  it('should prevent a different user from deleting an event they did not create', async () => {
    const response = await request(app)
      .delete(`/api/v1/events/${testEventId}`)
      .set('Authorization', `Bearer ${anotherUserToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Not Found',
      message: 'Event not found for deletion.',
    });
  });
});
