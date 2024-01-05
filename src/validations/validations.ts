import * as yup from 'yup';

export const userValidationSchema = yup.object({
  firstName: yup.string().required('First name is required.'),
  lastName: yup.string().required('Last name is required.'),
  birthDate: yup
    .string()
    .required('Birth date is required.')
    .matches(
      /^\d{4}-\d{2}-\d{2}$/,
      'Invalid birth date format. Please use YYYY-MM-DD',
    )
    .test('is-valid-date', 'Invalid birth date', (value) => {
      const date = new Date(value);
      return !isNaN(date.getTime()); // Correção aqui
    }),
  city: yup.string().required('City is required.'),
  country: yup.string().required('Country is required.'),
  email: yup
    .string()
    .email('Invalid email format.')
    .required('Email is required.'),
  password: yup.string().min(6).required('Password is required.'),
  confirmPassword: yup
    .string()
    .nullable()
    .oneOf([yup.ref('password')], 'Passwords must match')
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
