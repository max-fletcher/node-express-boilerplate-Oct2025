import { z } from 'zod';

// # IMPLEMENT LATER
// export const createAppUserSchema = z.object({
//   phoneNumber: z
//     .string({ required_error: 'Phone no. is required' })
//     .trim()
//     .min(3, { message: 'Phone no. has to be at least 3 characters long.' })
//     .max(255, { message: 'Phone no. cannot exceed 255 characters.' }),
//   firstName: z
//     .string({ required_error: 'First name is required' })
//     .trim()
//     .min(3, { message: 'First name has to be at least 3 characters long.' })
//     .max(255, { message: 'First name cannot exceed 255 characters.' }),
//   lastName: z
//     .string({ required_error: 'Last name is required' })
//     .trim()
//     .min(3, { message: 'Last name has to be at least 3 characters long.' })
//     .max(255, { message: 'Last name cannot exceed 255 characters.' }),
//   email: z
//     .string({ required_error: 'Email is required' })
//     .trim()
//     .min(3, { message: 'Email has to be at least 3 characters long.' })
//     .max(255, { message: 'Email cannot exceed 255 characters.' })
//     .optional()
//     .nullable(),
//   nativeLanguage: z
//     .string({ required_error: 'Native language is required' })
//     .trim()
//     .min(3, { message: 'Native language has to be at least 3 characters long.' })
//     .max(255, { message: 'Native language cannot exceed 255 characters.' }),
//   learningGoal: z
//     .string({ required_error: 'Learning goal is required' })
//     .trim()
//     .min(3, { message: 'Learning goal has to be at least 3 characters long.' })
//     .max(255, { message: 'Learning goal cannot exceed 255 characters.' }),
//   proficiencyLevel: z
//     .string({ required_error: 'Proficiency level is required' })
//     .trim()
//     .min(3, { message: 'Proficiency level has to be at least 3 characters long.' })
//     .max(255, { message: 'Proficiency level cannot exceed 255 characters.' })
//     .optional()
//     .nullable(),
//   avatarUrl: z.array(imageValidationRule).optional().nullable(),
// });

// # IMPROVE LATER
export const updateAdminUserSchema = z.object({
  // phoneNumber: z
  //   .string({ required_error: 'Phone no. is required' })
  //   .trim()
  //   .min(3, { message: 'Phone no. has to be at least 3 characters long.' })
  //   .max(255, { message: 'Phone no. cannot exceed 255 characters.' })
  //   .optional()
  //   .nullable(),
  firstName: z
    .string({ required_error: 'First name is required' })
    .trim()
    .min(3, { message: 'First name has to be at least 3 characters long.' })
    .max(255, { message: 'First name cannot exceed 255 characters.' })
    .optional()
    .nullable(),
  lastName: z
    .string({ required_error: 'Last name is required' })
    .trim()
    .min(3, { message: 'Last name has to be at least 3 characters long.' })
    .max(255, { message: 'Last name cannot exceed 255 characters.' })
    .optional()
    .nullable(),
  password: z
    .string({ required_error: 'Password is required' })
    .trim()
    .min(8, { message: 'Password has to be at least 8 characters long.' })
    .max(255, { message: 'Password cannot exceed 255 characters.' })
    .optional()
    .nullable(),
  confirmPassword: z
    .string({ required_error: 'Confirm password is required' })
    .trim()
    .min(8, { message: 'Confirm password has to be at least 8 characters long.' })
    .max(255, { message: 'Confirm password cannot exceed 255 characters.' })
    .optional()
    .nullable(),
  // email: z
  //   .string({ required_error: 'Email is required' })
  //   .trim()
  //   .min(3, { message: 'Email has to be at least 3 characters long.' })
  //   .max(255, { message: 'Email cannot exceed 255 characters.' })
  //   .optional()
  //   .nullable(),
}).superRefine(async (data, ctx) => {
  const { password, confirmPassword } = data;

  if (password && !confirmPassword) {
    ctx.addIssue({
      code: 'custom',
      path: ['password'],
      message: 'Confirm password is required if password is provided.',
    });

    ctx.addIssue({
      code: 'custom',
      path: ['confirmPassword'],
      message: 'Confirm password is required if password is provided.',
    });
  }

  if (password && confirmPassword && password !== confirmPassword) {
    ctx.addIssue({
      code: 'custom',
      path: ['password'],
      message: 'Password and confirm password doesn\'t match.',
    });

    ctx.addIssue({
      code: 'custom',
      path: ['confirmPassword'],
      message: 'Password and confirm password doesn\'t match.',
    });
  }
});