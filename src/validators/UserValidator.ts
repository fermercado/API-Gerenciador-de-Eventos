import * as yup from 'yup';

const onlyLettersRegex = /^[A-Za-zÀ-ÿ\s]+$/;

export const userValidationSchema = yup.object({
  firstName: yup
    .string()
    .required('First name is required.')
    .max(20, 'First name must be at most 20 characters long.')
    .matches(onlyLettersRegex, 'First name must only contain letters.')
    .test(
      'is-not-empty',
      'First name cannot be empty',
      (value) => value.trim().length > 0,
    ),
  lastName: yup
    .string()
    .required('Last name is required.')
    .max(50, 'Last name must be at most 50 characters long.')
    .matches(onlyLettersRegex, 'Last name must only contain letters.')
    .test(
      'is-not-empty',
      'Last name cannot be empty',
      (value) => value.trim().length > 0,
    ),
  birthDate: yup
    .string()
    .required('Birth date is required.')
    .matches(
      /^\d{2}\/\d{2}\/\d{4}$/,
      'Invalid birth date format. Please use DD/MM/YYYY',
    )
    .test('is-valid-date', 'Invalid birth date', (value) => {
      const [day, month, year] = value.split('/');
      const date = new Date(`${year}-${month}-${day}`);
      return !isNaN(date.getTime());
    }),
  city: yup
    .string()
    .required('City is required.')
    .matches(onlyLettersRegex, 'City must only contain letters.')
    .test(
      'is-not-empty',
      'City cannot be empty',
      (value) => value.trim().length > 0,
    ),
  country: yup
    .string()
    .required('Country is required.')
    .matches(onlyLettersRegex, 'Country must only contain letters.')
    .test(
      'is-not-empty',
      'Country cannot be empty',
      (value) => value.trim().length > 0,
    ),
  email: yup
    .string()
    .email('Invalid email format.')
    .required('Email is required.'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters long.')
    .required('Password is required.'),
  confirmPassword: yup
    .string()
    .nullable()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});
