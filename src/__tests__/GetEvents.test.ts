import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../models/UserModel';
import Event from '../models/EventModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

describe('Get Events', () => {
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
      birthDate: '1988-01-11',
      city: 'Birigui',
      country: 'Brasil',
    });

    userId = user._id;
    userToken = jwt.sign({ userId: userId }, process.env.JWT_SECRET || '', {
      expiresIn: '1h',
    });

    await Event.create([
      { description: 'Event 1', dayOfWeek: 'monday', userId },
      { description: 'Event 2', dayOfWeek: 'tuesday', userId },
    ]);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should retrieve all events for a user', async () => {
    const response = await request(app)
      .get('/api/v1/events')
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should retrieve events filtered by dayOfWeek', async () => {
    const response = await request(app)
      .get('/api/v1/events')
      .query({ dayOfWeek: 'monday' })
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(
      response.body.every((event: any) => event.dayOfWeek === 'monday'),
    ).toBe(true);
  });

  it('should return a message for no events found', async () => {
    const response = await request(app)
      .get('/api/v1/events')
      .query({ dayOfWeek: 'sunday' })
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'No events on this day.' });
  });
});
