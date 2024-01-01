import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../../models/UserModel';
import { userValidationSchema } from '../../validations/validations';

export const createUser = async (req: Request, res: Response) => {
  try {
    await userValidationSchema.validate(req.body, { abortEarly: false });

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
    const userWithoutTime = {
      ...user.toObject(),
      birthDate: user.birthDate.toISOString().split('T')[0],
    };

    res.status(201).json(userWithoutTime);
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
