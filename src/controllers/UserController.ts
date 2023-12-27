import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel';
import { userValidationSchema } from '../validations/validations';

export const createUser = async (req: Request, res: Response) => {
  try {
    await userValidationSchema.validate(req.body, { abortEarly: false });

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      birthDate: req.body.birthDate,
      city: req.body.city,
      country: req.body.country,
      email: req.body.email,
      password: hashedPassword,
    });

    res.status(201).json(user);
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const validationErrors = (error.inner || []).map((err: any) => ({
        field: err.path,
        message: err.message,
      }));
      return res.status(400).json({ errors: validationErrors });
    }

    console.error(error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Something went wrong',
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({
        type: 'Validation Error',
        errors: [{ resource: 'email', message: 'Invalid email' }],
      });
    }

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password,
    );

    if (!passwordMatch) {
      return res.status(400).json({
        type: 'Validation Error',
        errors: [{ resource: 'password', message: 'Invalid password' }],
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || '', {
      expiresIn: '1h',
    });

    res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Something went wrong',
    });
  }
};
