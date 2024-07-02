import * as yup from 'yup';

const onlyLettersRegex = /^[A-Za-zÀ-ÿ\s]+$/;

export const updateUserValidationSchema = yup.object({
  firstName: yup
    .string()
    .max(20, 'First name must be at most 20 characters long.')
    .matches(onlyLettersRegex, 'First name must only contain letters.')
    .test('is-not-empty', 'First name cannot be empty', (value) =>
      value ? value.trim().length > 0 : true,
    ),
  lastName: yup
    .string()
    .max(50, 'Last name must be at most 50 characters long.')
    .matches(onlyLettersRegex, 'Last name must only contain letters.')
    .test('is-not-empty', 'Last name cannot be empty', (value) =>
      value ? value.trim().length > 0 : true,
    ),
  birthDate: yup
    .string()
    .matches(
      /^\d{2}\/\d{2}\/\d{4}$/,
      'Invalid birth date format. Please use DD/MM/YYYY',
    )
    .test('is-valid-date', 'Invalid birth date', (value) => {
      if (!value) return true;
      const [day, month, year] = value.split('/');
      const date = new Date(`${year}-${month}-${day}`);
      return !isNaN(date.getTime());
    }),
  city: yup
    .string()
    .matches(onlyLettersRegex, 'City must only contain letters.')
    .test('is-not-empty', 'City cannot be empty', (value) =>
      value ? value.trim().length > 0 : true,
    ),
  country: yup
    .string()
    .matches(onlyLettersRegex, 'Country must only contain letters.')
    .test('is-not-empty', 'Country cannot be empty', (value) =>
      value ? value.trim().length > 0 : true,
    ),
  email: yup.string().email('Invalid email format.'),
  password: yup.string().min(6, 'Password must be at least 6 characters long.'),
  confirmPassword: yup
    .string()
    .nullable()
    .oneOf([yup.ref('password')], 'Passwords must match'),
});
