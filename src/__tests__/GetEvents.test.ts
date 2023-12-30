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
      city: 'Birigui',
      country: 'Brasil',
    });

    userId = user.id;
    userToken = jwt.sign({ userId }, process.env.JWT_SECRET || '', {
      expiresIn: '1h',
    });

    await Event.create([
      { description: 'Event 1', dayOfWeek: 'monday', userId },
      { description: 'Event 2', dayOfWeek: 'tuesday', userId },
      { description: 'Event 3', dayOfWeek: 'wednesday', userId },
    ]);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  it('should retrieve all events for a user', async () => {
    const response = await request(app)
      .get('/api/v1/events')
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(3);
  });

  it('should retrieve events filtered by dayOfWeek', async () => {
    const response = await request(app)
      .get('/api/v1/events')
      .query({ dayOfWeek: 'monday' })
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(1);
    expect(response.body[0].dayOfWeek).toBe('monday');
  });

  it('should return a message for no events found on a specific day', async () => {
    const response = await request(app)
      .get('/api/v1/events')
      .query({ dayOfWeek: 'sunday' })
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'No events found',
    });
  });

  it('should retrieve events filtered by description', async () => {
    const response = await request(app)
      .get('/api/v1/events')
      .query({ description: 'Event 1' })
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(1);
    expect(response.body[0].description).toBe('Event 1');
  });

  it('should retrieve only events created by the authenticated user', async () => {
    const response = await request(app)
      .get('/api/v1/events')
      .query({ onlyMyEvents: 'true' })
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(3);
  });

  it('should return a message when the authenticated user has no events', async () => {
    const newUser = await User.create({
      firstName: 'João',
      lastName: 'Silva',
      email: 'joao@gmail.com',
      password: await bcrypt.hash('password123', 10),
      birthDate: '1990-01-11',
      city: 'São Paulo',
      country: 'Brasil',
    });

    const newUserToken = jwt.sign(
      { userId: newUser.id },
      process.env.JWT_SECRET || '',
      {
        expiresIn: '1h',
      },
    );

    const response = await request(app)
      .get('/api/v1/events')
      .query({ onlyMyEvents: 'true' })
      .set('Authorization', `Bearer ${newUserToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: 'No events created by this user.',
    });
  });
});
