import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/UserModel';

export const loginUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({
        type: 'Validation Error',
        errors: [{ resource: 'email', message: 'Invalid email' }],
      });
    }

    const passwordMatch =
      process.env.NODE_ENV === 'test'
        ? req.body.password === user.password
        : await bcrypt.compare(req.body.password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({
        type: 'Validation Error',
        errors: [{ resource: 'password', message: 'Invalid password' }],
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined.');
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({
      token,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Something went wrong',
    });
  }
};
