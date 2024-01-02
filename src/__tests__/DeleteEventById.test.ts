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
  let anotherUserId: string;
  let testEventId: string;
  let anotherEventId: string;

  const createTestData = async () => {
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

    userId = user._id.toString();
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

    anotherUserId = anotherUser._id.toString();
    anotherUserToken = jwt.sign(
      { userId: anotherUserId },
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

    testEventId = testEvent._id.toString();

    const anotherEvent = await Event.create({
      description: 'Another Event',
      dayOfWeek: 'tuesday',
      userId: anotherUserId,
    });

    anotherEventId = anotherEvent._id.toString();
  };

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri, {});
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await createTestData();
  });

  it('deletes event by ID', async () => {
    const response = await request(app)
      .delete(`/api/v1/events/${testEventId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(204);
  });

  it('handles non-existent ID', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .delete(`/api/v1/events/${nonExistentId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      statusCode: 404,
      error: 'Not Found',
      message: 'Event not found for deletion.',
    });
  });

  it('handles invalid token', async () => {
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

  it('prevents deleting others events', async () => {
    const response = await request(app)
      .delete(`/api/v1/events/${anotherEventId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      statusCode: 400,
      error: 'Bad Request',
      message: 'You do not have permission to delete this event.',
    });
  });

  it('prevents deletion by different user', async () => {
    const response = await request(app)
      .delete(`/api/v1/events/${testEventId}`)
      .set('Authorization', `Bearer ${anotherUserToken}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      statusCode: 400,
      error: 'Bad Request',
      message: 'You do not have permission to delete this event.',
    });
  });
  it('return 500 if a server error occurs during event deletion', async () => {
    const mockDelete = jest
      .spyOn(Event, 'deleteOne')
      .mockRejectedValue(new Error('Internal server error'));

    const response = await request(app)
      .delete('/api/v1/events/some-event-id')
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'Something went wrong',
    });

    mockDelete.mockRestore();
  });
});
