import express from 'express';
import { createEvent, getEvents } from '../controllers/EventController';
import { authenticateUser } from '../middlewares/auth';

const router = express.Router();

router.use(authenticateUser);

router.post('/', createEvent);

router.get('/', getEvents);

export default router;
