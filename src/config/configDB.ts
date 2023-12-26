import dotenv from 'dotenv';

dotenv.config();

export const configDB = {
  username: process.env.MONGODB_USERNAME || '',
  password: process.env.MONGODB_PASSWORD || '',
};
