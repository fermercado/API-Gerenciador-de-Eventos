import * as yup from 'yup';

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
