import express from 'express';
import { createEvent } from '../controllers/events/CreateEvent';
import { getEvents } from '../controllers/events/GetEvents';
import { getEventById } from '../controllers/events/GetEventsById';
import { deleteEvents } from '../controllers/events/DeleteEvents';
import { deleteEventById } from '../controllers/events/DeleteEventById';

import { authenticateUser } from '../middlewares/auth';

const router = express.Router();

router.use(authenticateUser);

router.post('/', authenticateUser, createEvent);

router.get('/', authenticateUser, getEvents);

router.get('/:id', authenticateUser, getEventById);

router.delete('/', authenticateUser, deleteEvents);

router.delete('/:id', authenticateUser, deleteEventById);

export default router;
