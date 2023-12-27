import express from 'express';
import {
  createEvent,
  getEvents,
  deleteEvents,
  getEventById,
  deleteEventById,
} from '../controllers/EventController';
import { authenticateUser } from '../middlewares/auth';

const router = express.Router();

router.use(authenticateUser);

router.post('/', authenticateUser, createEvent);

router.get('/', authenticateUser, getEvents);

router.get('/:id', authenticateUser, getEventById);

router.delete('/', authenticateUser, deleteEvents);

router.delete('/:id', authenticateUser, deleteEventById);

export default router;
