import * as yup from 'yup';
import User from '../models/UserModel';

export const userValidationSchema = yup.object({
  firstName: yup.string().required('First name is required.'),
  lastName: yup.string().required('Last name is required.'),
  birthDate: yup
    .string()
    .required('Birth date is required.')
    .test(
      'valid-birthDate-format',
      'Invalid birth date format. Please use YYYY-MM-DD.',
      (value) => {
        if (!value) return false;

        const regex = /^\d{4}-\d{2}-\d{2}$/;
        return regex.test(value);
      },
    ),
  city: yup.string().required('City is required.'),
  country: yup.string().required('Country is required.'),
  email: yup
    .string()
    .email('Invalid email format.')
    .required('Email is required.')
    .test('unique-email', 'This email already exists', async function (value) {
      const existingUser = await User.findOne({ email: value });
      return !existingUser;
    }),
  password: yup.string().min(6).required('Password is required.'),
  confirmPassword: yup
    .string()
    .nullable()
    .transform((value) => (value === '' ? null : value))
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

export const eventValidationSchema = yup.object({
  description: yup.string().required('Description is required.'),
  dayOfWeek: yup
    .string()
    .required('Day of the week is required.')
    .oneOf(
      [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
      ],
      'Invalid day of the week',
    ),
});
