import { z } from 'zod';
import { imageValidationRule } from './common.schema';
import { AppUserService } from '../services/admin/app-user.services';

const appUserService = new AppUserService()

export const phoneNoSchema = z.object({
  phoneNo: z
    .string({ required_error: 'Phone number is required' })
    .trim()
    .min(3, { message: 'Phone number has to be at least 3 characters long.' })
    .max(255, { message: 'Phone number cannot exceed 255 characters.' }),
}).superRefine(async (data, ctx) => {
  const { phoneNo } = data;
  const appUserExists = await appUserService.userExistsByPhone(phoneNo)
  if (!appUserExists) {
    ctx.addIssue({
      code: 'custom',
      path: ['phoneNo'],
      message: 'User with this phone number doesn\'t exist.',
    });
  }
});

export type PhoneNoSchema = z.infer<typeof phoneNoSchema>;

export const appVerifyOtpSchema = z.object({
  otp: z
    .string({ required_error: 'OTP is required' })
    .trim()
    .min(6, { message: 'OTP has to be 6 characters long.' })
    .max(6, { message: 'OTP has to be 6 characters long.' }),
});

export type AppVerifyOtpSchema = z.infer<typeof appVerifyOtpSchema>;

export const editProfileSchema = z.object({
  firstName: z
    .string({ required_error: 'First name is required' })
    .trim()
    .min(3, { message: 'First name has to be at least 3 characters long.' })
    .max(255, { message: 'First name cannot exceed 255 characters.' }),
  lastName: z
    .string({ required_error: 'Last name is required' })
    .trim()
    .min(3, { message: 'Last name has to be at least 3 characters long.' })
    .max(255, { message: 'Last name cannot exceed 255 characters.' }),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email({ message: 'Invalid email format. Please provide a valid email.' })
    .max(255, { message: 'Email cannot exceed 255 characters.' })
    .optional()
    .nullable(),
});

export type nameSchema = z.infer<typeof editProfileSchema>;

export const updateAvtatarUrlSchama = z.object({
  avatarUrl: z.array(imageValidationRule, { required_error: 'Avatar image is required.' }),
});

export type avtatarUrlSchama = z.infer<typeof updateAvtatarUrlSchama>;

export const saveTimeSpentDataSchema = z.object({
  timeSpent: z
    .coerce
    .number({ required_error: 'Time spent is required.' })
    .min(1, { message: 'Number cannot be less than 1.' })
    .max(1000000, { message: 'Number cannot exceed 1000000.' }),
});

export type saveTimeSpentDataSchema = z.infer<typeof saveTimeSpentDataSchema>;
