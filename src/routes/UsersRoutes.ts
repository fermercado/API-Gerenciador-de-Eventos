import express from 'express';
import { UserController } from '../controllers/users/UserController';
import { validateUserCreation } from '../middlewares/validateUserCreation';
import { validateUserUpdate } from '../middlewares/validateUserUpdate';

const router = express.Router();
const userController = new UserController();

router.post(
  '/api/v1/users/sign-up',
  validateUserCreation,
  userController.createUser.bind(userController),
);

router.post(
  '/api/v1/users/sign-in',
  userController.loginUser.bind(userController),
);

router.put(
  '/api/v1/users/:id',
  validateUserUpdate,
  userController.updateUser.bind(userController),
);

export default router;
