import express, { Application } from 'express';
import dotenv from 'dotenv';
import { connectToMongoDB } from './database/db';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(express.json());

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });

  connectToMongoDB();
}
