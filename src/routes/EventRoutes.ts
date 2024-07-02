import express from 'express';
import { EventController } from '../controllers/events/EventController';
import { authenticateUser } from '../middlewares/auth';
import {
  validateEventCreation,
  validateDayOfWeek,
} from '../middlewares/validateEvent';

const router = express.Router();
const eventController = new EventController();

router.use('/api/v1/events', authenticateUser);

router.post(
  '/api/v1/events',
  validateEventCreation,
  eventController.createEvent.bind(eventController),
);
router.get('/api/v1/events', eventController.getEvents.bind(eventController));
router.get(
  '/api/v1/events/:id',
  eventController.getEventById.bind(eventController),
);
router.delete(
  '/api/v1/events/:id',
  eventController.deleteEventById.bind(eventController),
);
router.delete(
  '/api/v1/events',
  validateDayOfWeek,
  eventController.deleteEvents.bind(eventController),
);

export default router;
