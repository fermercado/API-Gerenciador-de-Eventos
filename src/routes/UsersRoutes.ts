// routes/userRoutes.ts
import express from 'express';
import * as UserController from '../controllers/UserController';

const router = express.Router();

router.post('/sign-up', UserController.createUser);
router.post('/sign-in', UserController.loginUser);

export default router;
