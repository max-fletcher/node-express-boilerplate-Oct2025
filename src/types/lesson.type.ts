import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { LessonModel } from '../db/rdb/models/lesson.model';
import { FlashCardWithTimestamps } from './flash-card.type';

export type Lesson = InferAttributes<LessonModel>;

export type StoreLesson = Partial<InferCreationAttributes<LessonModel>> & {
  id: string
  dayId: string
  lessonOrder: number
  title: string
  estimatedMinutes: number
  updatedBy: string
  createdAt?: string | null
  updatedAt?: string | null
};

export type StoreLessonData = Omit<StoreLesson, 'id'>;

export type UpdateLessonData = Partial<StoreLessonData>;

export type LessonWithTimestamps = Lesson & {
  createdAt: string
  updatedAt: string
};

export type LessonWithFlashCards = Omit<LessonWithTimestamps, 'updatedBy'|'deletedAt'|'deletedBy'> & {
  day: {
    id: string
    courseId: string
    course: {
      id: string,
      user_courses: { id: string }[]
    }
  }
  flash_cards: Omit<FlashCardWithTimestamps, 'updatedBy'|'deletedAt'|'deletedBy'>[]
}