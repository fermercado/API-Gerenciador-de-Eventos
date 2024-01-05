import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import User from '../../models/UserModel';
import * as yup from 'yup';
import { userValidationSchema } from '../../validations/validations';

export const createUser = async (req: Request, res: Response) => {
  try {
    await userValidationSchema.validate(req.body, { abortEarly: false });

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const saltRounds = process.env.NODE_ENV === 'test' ? 1 : 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      birthDate: req.body.birthDate,
      city: req.body.city,
      country: req.body.country,
      email: req.body.email,
      password: hashedPassword,
    });

    const userWithoutPassword = {
      ...user.toObject(),
      birthDate: user.birthDate.toISOString().split('T')[0],
      password: undefined,
    };

    res.status(201).json(userWithoutPassword);
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const yupError = error as yup.ValidationError;
      const validationErrors = yupError.inner.map((err) => ({
        field: err.path,
        message: err.message,
      }));
      return res.status(400).json({ errors: validationErrors });
    }

    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Something went wrong',
    });
  }
};
