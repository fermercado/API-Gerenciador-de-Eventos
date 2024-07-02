import * as yup from 'yup';

export const eventValidationSchema = yup.object({
  description: yup
    .string()
    .required('Description is required.')
    .min(5, 'Description must be at least 5 characters.')
    .max(50, 'Description must be at most 50 characters.')
    .matches(
      /^[a-zA-Z\s]*$/,
      'Description can only contain letters and spaces.',
    ),
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
