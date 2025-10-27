import { z } from 'zod';
import { audioValidationRule, imageValidationRule } from './common.schema';
import { FlashCardService } from '../services/admin/flash-card.services';
import { LessonService } from '../services/admin/lesson.services';

const lessonService = new LessonService()
const flashCardService = new FlashCardService()

export const createFlashCardSchema = z.object({
  lessonId: z
    .string({ required_error: 'Lesson id is required.' })
    .trim(),
  frontText: z
    .string({ required_error: 'Front text is required.' })
    .trim()
    .max(255, { message: 'Front text cannot exceed 255 characters.' }),
  frontSubtext: z
    .string({ required_error: 'Front subtext is required.' })
    .trim()
    .max(255, { message: 'Front subtext cannot exceed 255 characters.' })
    .optional()
    .nullable(),
  backText: z
    .string({ required_error: 'Back text is required.' })
    .trim()
    .max(255, { message: 'Back text cannot exceed 255 characters.' }),
  backSubtext: z
    .string({ required_error: 'Back subtext is required.' })
    .trim()
    .max(255, { message: 'Back subtext cannot exceed 255 characters.' })
    .optional()
    .nullable(),
  example: z
    .string({ required_error: 'Example is required.' })
    .trim()
    .max(255, { message: 'Example cannot exceed 255 characters.' }),
  exampleTranslation: z
    .string({ required_error: 'Back subtext is required.' })
    .trim()
    .max(255, { message: 'Back subtext cannot exceed 255 characters.' })
    .optional()
    .nullable(),
  usageNotes: z
    .string({ required_error: 'Back subtext is required.' })
    .trim()
    .max(255, { message: 'Back subtext cannot exceed 255 characters.' })
    .optional()
    .nullable(),
  imageUrl: z
    .array(imageValidationRule, {required_error: "Image url is be required." })
    .optional()
    .nullable(),
  audioUrl: z.
    array(audioValidationRule, {required_error: "Audio url is be required." })
    .optional()
    .nullable(),
  cardOrder: z
    .coerce
    .number({ required_error: 'Flash card order is required.' })
    .min(1, { message: 'Flash card order has to be at least 1.' })
    .max(1000000, { message: 'Flash card order cannot exceed 1000000.' }),
})
.superRefine(async (data, ctx) => {
  const { lessonId, cardOrder } = data;

  const lesson = await lessonService.lessonExistsById(lessonId)
  if(!lesson){
    ctx.addIssue({
      code: 'custom',
      path: ['lessonId'],
      message: 'Lesson not found.',
    });
  }

  if(!data.imageUrl && !data.audioUrl){
    ctx.addIssue({
      code: 'custom',
      path: ['imageUrl'],
      message: 'Either image or audio is required.',
    });

    ctx.addIssue({
      code: 'custom',
      path: ['audioUrl'],
      message: 'Either image or audio is required.',
    });
  }

  // Check if course with day already exists
  const lessonWithCardOrder = await flashCardService.lessonWithCardOrderExists(lessonId, cardOrder);
  if (lessonWithCardOrder) {
    ctx.addIssue({
      code: 'custom',
      path: ['lessonId'],
      message: 'Lesson with this flash card order already exists.',
    });

    ctx.addIssue({
      code: 'custom',
      path: ['cardOrder'],
      message: 'Lesson with this flash card order already exists.',
    });
  }
});

export const updateFlashCardSchema = z.object({
  id: z
    .string({ required_error: 'Id is required.' })
    .trim(),
  lessonId: z
    .string({ required_error: 'Lesson id is required.' })
    .trim()
    .optional()
    .nullable(),
  frontText: z
    .string({ required_error: 'Front text is required.' })
    .trim()
    .max(255, { message: 'Front text cannot exceed 255 characters.' })
    .optional()
    .nullable(),
  frontSubtext: z
    .string({ required_error: 'Front subtext is required.' })
    .trim()
    .max(255, { message: 'Front subtext cannot exceed 255 characters.' })
    .optional()
    .nullable(),
  backText: z
    .string({ required_error: 'Back text is required.' })
    .trim()
    .max(255, { message: 'Back text cannot exceed 255 characters.' })
    .optional()
    .nullable(),
  backSubtext: z
    .string({ required_error: 'Back subtext is required.' })
    .trim()
    .max(255, { message: 'Back subtext cannot exceed 255 characters.' })
    .optional()
    .nullable(),
  example: z
    .string({ required_error: 'Example is required.' })
    .trim()
    .max(255, { message: 'Example cannot exceed 255 characters.' })
    .optional()
    .nullable(),
  exampleTranslation: z
    .string({ required_error: 'Back subtext is required.' })
    .trim()
    .max(255, { message: 'Back subtext cannot exceed 255 characters.' })
    .optional()
    .nullable(),
  usageNotes: z
    .string({ required_error: 'Back subtext is required.' })
    .trim()
    .max(255, { message: 'Back subtext cannot exceed 255 characters.' })
    .optional()
    .nullable(),
  imageUrl: z
    .array(imageValidationRule, {required_error: "Image url is be required." })
    .optional()
    .nullable(),
  audioUrl: z.
    array(audioValidationRule, {required_error: "Audio url is be required." })
    .optional()
    .nullable(),
  cardOrder: z
    .coerce
    .number({ required_error: 'Flash card order is required.' })
    .min(1, { message: 'Flash card order has to be at least 1.' })
    .max(1000000, { message: 'Flash card order cannot exceed 1000000.' })
    .optional()
    .nullable(),
})
.superRefine(async (data, ctx) => {
  const { id } = data;
  let { lessonId, cardOrder } = data;
  const flashCard = await flashCardService.findFlashCardById(id, ['id', 'lessonId', 'cardOrder'])

  if(flashCard){
    if(!lessonId)
      lessonId = flashCard.lessonId
    if(!cardOrder)
      cardOrder = flashCard.cardOrder

    const lesson = await lessonService.lessonExistsById(lessonId)
    if(!lesson){
      ctx.addIssue({
        code: 'custom',
        path: ['lessonId'],
        message: 'Lesson not found.',
      });
    }

    // Check if course with day already exists
    const dayWithFlashCard = await flashCardService.lessonWithCardOrderExists(lessonId, cardOrder);
    if (dayWithFlashCard && cardOrder && cardOrder !== flashCard.cardOrder) {
      if (dayWithFlashCard) {
        ctx.addIssue({
          code: 'custom',
          path: ['lessonId'],
          message: 'Lesson with this flash card order already exists.',
        });
    
        ctx.addIssue({
          code: 'custom',
          path: ['cardOrder'],
          message: 'Lesson with this flash card order already exists.',
        });
      }
    }
  }
});