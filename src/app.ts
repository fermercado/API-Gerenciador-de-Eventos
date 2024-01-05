import express, { Application } from 'express';
import dotenv from 'dotenv';
import { connectToMongoDB } from './database/db';
import EventRoutes from './routes/EventRoutes';
import userRoutes from './routes/UsersRoutes';
import swaggerUi from 'swagger-ui-express';
import swaggerOptions from './swaggerOptions.json';

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
} else {
  dotenv.config();
}

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/events', EventRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOptions));

app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });

  connectToMongoDB();
}

export default app;
