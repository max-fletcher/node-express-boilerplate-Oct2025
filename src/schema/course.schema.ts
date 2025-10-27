import { z } from 'zod';
import { imageValidationRule } from './common.schema';
import { DIFFICULTIES } from '../constants/enums';
import { LanguageService } from '../services/admin/language.services';

const languageService = new LanguageService()

export const createCourseSchema = z.object({
  title: z
    .string({ required_error: 'Title is required.' })
    .trim()
    .min(3, { message: 'Title has to be at least 3 characters long.' })
    .max(255, { message: 'Title cannot exceed 255 characters.' }),
  description: z
    .string({ required_error: 'Description is required.' })
    .trim()
    .max(255, { message: 'Description cannot exceed 255 characters.' })
    .optional()
    .nullable(),
  totalDays: z
    .coerce
    .number({ required_error: 'Total days is required.' })
    .min(1, { message: 'Total days has to be at least 1.' })
    .max(1000000, { message: 'Total days cannot exceed 1000000.' }),
  languageId: z
    .string({ required_error: 'Language is required.' })
    .trim(),
  targetLanguageId: z
    .string({ required_error: 'Target language is required.' })
    .trim(),
  difficulty: z
    .enum(DIFFICULTIES, { required_error: 'Difficulty is required.' }),
  estimatedHours: z
    .coerce
    .number({ required_error: 'Estimated hours is required.' })
    .min(1, { message: 'Estimated hours has to be at least 1.' })
    .max(1000000, { message: 'Estimated hours cannot exceed 1000000.' }),
  imagePath: z.array(imageValidationRule, {required_error: "Image is be required." }),
})
.superRefine(async (data, ctx) => {
  const { languageId, targetLanguageId } = data;

  const langExists = await languageService.findLanguageById(languageId)
  if (!langExists) {
    ctx.addIssue({
      code: 'custom',
      path: ['languageId'],
      message: 'Language not found.',
    });
  }

  const targetLangExists = await languageService.findLanguageById(targetLanguageId)
  if (!targetLangExists) {
    ctx.addIssue({
      code: 'custom',
      path: ['targetLanguageId'],
      message: 'Target language not found.',
    });
  }

  if(languageId === targetLanguageId){
    ctx.addIssue({
      code: 'custom',
      path: ['targetLanguageId'],
      message: 'Language and target language cannot be the same.',
    });
    ctx.addIssue({
      code: 'custom',
      path: ['targetLanguageId'],
      message: 'Language and target language cannot be the same.',
    });
  }
});

export const updateCourseSchema = z.object({
  title: z
    .string({ required_error: 'Title is required.' })
    .trim()
    .min(3, { message: 'Title has to be at least 3 characters long.' })
    .max(255, { message: 'Title cannot exceed 255 characters.' })
    .optional()
    .nullable(),
  description: z
    .string({ required_error: 'Description is required.' })
    .trim()
    .max(255, { message: 'Description cannot exceed 255 characters.' })
    .optional()
    .nullable(),
  totalDays: z
    .coerce
    .number({ required_error: 'Total days is required.' })
    .min(1, { message: 'Total days has to be at least 1.' })
    .max(1000000, { message: 'Total days cannot exceed 1000000.' })
    .optional()
    .nullable(),
  languageId: z
    .string({ required_error: 'Language is required.' })
    .trim()
    .optional()
    .nullable(),
  targetLanguageId: z
    .string({ required_error: 'Target language is required.' })
    .trim()
    .optional()
    .nullable(),
  difficulty: z
    .enum(DIFFICULTIES, { required_error: 'Difficulty is required.' }),
  estimatedHours: z
    .coerce
    .number({ required_error: 'Estimated hours is required.' })
    .min(1, { message: 'Estimated hours has to be at least 1.' })
    .max(1000000, { message: 'Estimated hours cannot exceed 1000000.' }),
  imagePath: z.array(imageValidationRule, {required_error: "Image is be required." })
    .optional()
    .nullable(),
})
.superRefine(async (data, ctx) => {
  const { languageId, targetLanguageId } = data;

  if(languageId){
    const langExists = await languageService.findLanguageById(languageId)
    if (!langExists) {
      ctx.addIssue({
        code: 'custom',
        path: ['languageId'],
        message: 'Language not found.',
      });
    }
  }

  if(targetLanguageId){
    const targetLangExists = await languageService.findLanguageById(targetLanguageId)
    if (!targetLangExists) {
      ctx.addIssue({
        code: 'custom',
        path: ['targetLanguageId'],
        message: 'Target language not found.',
      });
    }
  }

  if(languageId === targetLanguageId){
    ctx.addIssue({
      code: 'custom',
      path: ['targetLanguageId'],
      message: 'Language and target language cannot be the same.',
    });
    ctx.addIssue({
      code: 'custom',
      path: ['targetLanguageId'],
      message: 'Language and target language cannot be the same.',
    });
  }
});