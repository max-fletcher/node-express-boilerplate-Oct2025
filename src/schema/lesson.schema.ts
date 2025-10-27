import { z } from 'zod';
import { DIFFICULTIES } from '../constants/enums';
import { DayService } from '../services/admin/day.services';
import { audioValidationRule } from './common.schema';
import { LessonService } from '../services/admin/lesson.services';

const dayService = new DayService()
const lessonService = new LessonService()

export const createLessonSchema = z.object({
  dayId: z
    .string({ required_error: 'Day id is required.' })
    .trim(),
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
  estimatedMinutes: z
    .coerce
    .number({ required_error: 'Estimated minutes is required.' })
    .min(1, { message: 'Estimated minutes has to be at least 1.' })
    .max(1000000, { message: 'Estimated minutes cannot exceed 1000000.' }),
  difficulty: z
    .enum(DIFFICULTIES, { required_error: 'Difficulty is required.' }),
  // xpReward: z
  //   .coerce
  //   .number({ required_error: 'XP reward is required.' })
  //   .min(1, { message: 'XP reward has to be at least 1.' })
  //   .max(1000000, { message: 'XP reward cannot exceed 1000000.' }),
  lessonOrder: z
    .coerce
    .number({ required_error: 'Lesson order is required.' })
    .min(1, { message: 'Lesson order has to be at least 1.' })
    .max(1000000, { message: 'Lesson order cannot exceed 1000000.' }),
  audioIntro: z.array(audioValidationRule, {required_error: "Audio intro is be required." })
    .optional()
    .nullable(),
})
.superRefine(async (data, ctx) => {
  const { dayId, lessonOrder } = data;

  const day = await dayService.dayExistsById(dayId)
  if(!day){
    ctx.addIssue({
      code: 'custom',
      path: ['dayId'],
      message: 'Day not found.',
    });
  }

  // Check if course with day already exists
  const dayWithLesson = await lessonService.dayWithLessonOrderExists(dayId, lessonOrder);
  if (dayWithLesson) {
    ctx.addIssue({
      code: 'custom',
      path: ['dayId'],
      message: 'Day with this lesson order already exists.',
    });

    ctx.addIssue({
      code: 'custom',
      path: ['lessonOrder'],
      message: 'Day with this lesson order already exists.',
    });
  }
});

export const updateLessonSchema = z.object({
  id: z
    .string({ required_error: 'Id is required.' })
    .trim(),
  dayId: z
    .string({ required_error: 'Day id is required.' })
    .trim()
    .optional()
    .nullable(),
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
  estimatedMinutes: z
    .coerce
    .number({ required_error: 'Estimated minutes is required.' })
    .min(1, { message: 'Estimated minutes has to be at least 1.' })
    .max(1000000, { message: 'Estimated minutes cannot exceed 1000000.' })
    .optional()
    .nullable(),
  difficulty: z
    .enum(DIFFICULTIES, { required_error: 'Difficulty is required.' })
    .optional()
    .nullable(),
  // xpReward: z
  //   .coerce
  //   .number({ required_error: 'XP reward is required.' })
  //   .min(1, { message: 'XP reward has to be at least 1.' })
  //   .max(1000000, { message: 'XP reward cannot exceed 1000000.' })
  //   .optional()
  //   .nullable(),
  lessonOrder: z
    .coerce
    .number({ required_error: 'Lesson order is required.' })
    .min(1, { message: 'Lesson order has to be at least 1.' })
    .max(1000000, { message: 'Lesson order cannot exceed 1000000.' })
    .optional()
    .nullable(),
  audioIntro: z.array(audioValidationRule, {required_error: "Audio intro is be required." })
    .optional()
    .nullable(),
})
.superRefine(async (data, ctx) => {
  const { id } = data;
  let { dayId, lessonOrder } = data;
  const lesson = await lessonService.findLessonById(id, ['id', 'dayId', 'lessonOrder'])

  if(lesson){
    if(!dayId)
      dayId = lesson.dayId
    if(!lessonOrder)
      lessonOrder = lesson.lessonOrder

    const day = await dayService.dayExistsById(dayId)
    if(!day){
      ctx.addIssue({
        code: 'custom',
        path: ['dayId'],
        message: 'Day not found.',
      });
    }

    // Check if course with day already exists
    const dayWithLesson = await lessonService.dayWithLessonOrderExists(dayId, lessonOrder);
    if (dayWithLesson && lessonOrder &&lessonOrder !== lesson.lessonOrder) {
      if (dayWithLesson) {
        ctx.addIssue({
          code: 'custom',
          path: ['dayId'],
          message: 'Day with this lesson order already exists.',
        });
    
        ctx.addIssue({
          code: 'custom',
          path: ['lessonOrder'],
          message: 'Day with this lesson order already exists.',
        });
      }
    }
  }
});