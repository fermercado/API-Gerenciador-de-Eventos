import express, { Application } from 'express';
import cors from 'cors';
import { connectToMongoDB } from './database/db';
import EventRoutes from './routes/EventRoutes';
import userRoutes from './routes/UsersRoutes';
import setupSwagger from './swagger';
import { errorHandler } from './middlewares/ErrorHandler';

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.json());

setupSwagger(app);

app.use(userRoutes);
app.use(EventRoutes);

app.use(errorHandler);

app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
    connectToMongoDB();
  });
}

export default app;
