import mongoose from 'mongoose';
import { connectToMongoDB } from '../database/db';

jest.mock('mongoose', () => ({
  connect: jest.fn(),
  connection: {
    readyState: 0,
  },
}));

beforeEach(() => {
  (mongoose.connect as jest.Mock).mockClear();
});
beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  (console.log as jest.Mock).mockRestore();
  (console.error as jest.Mock).mockRestore();
});

describe('connectToMongoDB', () => {
  it('connect to MongoDB successfully', async () => {
    (mongoose.connect as jest.Mock).mockResolvedValue(true);

    await expect(connectToMongoDB()).resolves.toBeUndefined();
    expect(mongoose.connect).toHaveBeenCalled();
  });
});
