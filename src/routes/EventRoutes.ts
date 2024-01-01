import express from 'express';
import { createEvent } from '../controllers/events/CreateEvent';
import { getEvents } from '../controllers/events/GetEvents';
import { getEventById } from '../controllers/events/GetEventsById';
import { deleteEvents } from '../controllers/events/DeleteEvents';
import { deleteEventById } from '../controllers/events/DeleteEventById';

import { authenticateUser } from '../middlewares/auth';

const router = express.Router();

router.use(authenticateUser);

router.post('/', createEvent);

router.get('/', getEvents);

router.get('/:id', getEventById);

router.delete('/:id', deleteEventById);

router.delete('/', deleteEvents);

export default router;
