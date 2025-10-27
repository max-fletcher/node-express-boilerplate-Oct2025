import { z } from 'zod';

export const viewEnrolledCoursesFilterSchema = z.object({
  languageId: z
    .string({ required_error: 'Language is required.' })
    .trim()
    .optional()
    .nullable(),
  searchText : z
    .string({ required_error: 'Search text is required.' })
    .trim()
    .max(255, { message: 'Search text cannot exceed 255 characters.' })
    .optional()
    .nullable(),
  page : z
    .coerce
    .number({ required_error: 'Page is required.' })
    .min(1, { message: 'Page cannot be less than 1.' })
    .max(1000000, { message: 'Page cannot exceed 1000000.' })
    .optional()
    .nullable(),
  number : z
    .coerce
    .number({ required_error: 'Number is required.' })
    .min(1, { message: 'Number cannot be less than 1.' })
    .max(1000000, { message: 'Number cannot exceed 1000000.' })
    .optional()
    .nullable(),
});