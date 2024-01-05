import dotenv from 'dotenv';

dotenv.config();

export const configDB = {
  username: process.env.MONGODB_USERNAME,
  password: process.env.MONGODB_PASSWORD,
  host: process.env.MONGODB_HOST,
  database: process.env.MONGODB_DATABASE,
};
