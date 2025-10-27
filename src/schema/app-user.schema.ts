import { z } from 'zod';
// import { APP_USER_VERIFICATION_STATUSES } from '../constants/enums';
// import { imageValidationSchema } from './common.schema';

// export const createAppUserSchema = z.object({
//   phoneNumber: z
//     .string({ required_error: 'Phone no. is required' })
//     .trim()
//     .min(3, { message: 'Phone no. has to be at least 3 characters long.' })
//     .max(255, { message: 'Phone no. cannot exceed 255 characters.' }),
//   firstName: z
//     .string({ required_error: 'First name is required' })
//     .trim()
//     .max(255, { message: 'First name cannot exceed 255 characters.' })
//     .optional()
//     .nullable(),
//   lastName: z
//     .string({ required_error: 'Last name is required' })
//     .trim()
//     .max(255, { message: 'Last name cannot exceed 255 characters.' })
//     .optional()
//     .nullable(),
//   email: z
//     .string({ required_error: 'Email is required' })
//     .trim()
//     .max(255, { message: 'Email cannot exceed 255 characters.' })
//     .optional()
//     .nullable(),
//   avatarUrl: z.array(imageValidationSchema).optional().nullable(),
// });

export const createAppUserSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .max(255, { message: 'Name cannot exceed 255 characters.' }),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .max(255, { message: 'Email cannot exceed 255 characters.' }),
  password: z
    .string({ required_error: 'Password is required' })
    .trim()
    .max(255, { message: 'Password cannot exceed 255 characters.' })
});

export const updateAppUserSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .max(255, { message: 'Name cannot exceed 255 characters.' })
    .optional()
    .nullable(),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .max(255, { message: 'Email cannot exceed 255 characters.' })
    .optional()
    .nullable(),
  password: z
    .string({ required_error: 'Password is required' })
    .trim()
    .max(255, { message: 'Password cannot exceed 255 characters.' })
    .optional()
    .nullable()
});

// export const updateAppUserSchema = z.object({
//   phoneNumber: z
//     .string({ required_error: 'Phone no. is required' })
//     .trim()
//     .min(3, { message: 'Phone no. has to be at least 3 characters long.' })
//     .max(255, { message: 'Phone no. cannot exceed 255 characters.' })
//     .optional()
//     .nullable(),
//   firstName: z
//     .string({ required_error: 'First name is required' })
//     .trim()
//     .max(255, { message: 'First name cannot exceed 255 characters.' })
//     .optional()
//     .nullable(),
//   lastName: z
//     .string({ required_error: 'Last name is required' })
//     .trim()
//     .max(255, { message: 'Last name cannot exceed 255 characters.' })
//     .optional()
//     .nullable(),
//   email: z
//     .string({ required_error: 'Email is required' })
//     .trim()
//     .max(255, { message: 'Email cannot exceed 255 characters.' })
//     .optional()
//     .nullable(),
//   verified: z.enum(APP_USER_VERIFICATION_STATUSES)
//     .optional()
//     .nullable(),
//   avatarUrl: z.array(imageValidationSchema).optional().nullable(),
// });