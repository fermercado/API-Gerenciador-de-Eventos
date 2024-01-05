import express from 'express';
import { createUser } from '../controllers/users/CreateUser';
import { loginUser } from '../controllers/users/LoginUser';

const router = express.Router();

router.post('/sign-up', createUser);
router.post('/sign-in', loginUser);

export default router;
