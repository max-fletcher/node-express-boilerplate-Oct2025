import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { CourseModel } from '../db/rdb/models';

export type Course = InferAttributes<CourseModel>;

export type StoreCourse = Partial<InferCreationAttributes<CourseModel>> & {
  id: string
  title: string
  totalDays: number
  languageId: string
  targetLanguageId: string
  imagePath: string
  updatedBy: string
  createdAt?: string | null
  updatedAt?: string | null
};

export type StoreCourseData = Omit<StoreCourse, 'id'>;

export type UpdateCourseData = Partial<StoreCourseData>;

export type CourseWithTimestamps = Course & {
  createdAt: string
  updatedAt: string
};


export type EnrolledCourses = Omit<Course, 'languageId'|'targetLanguageId'|'updatedBy'|'deletedAt'|'deletedBy'> & {
  language: {
    id: string,
    name: string,
  },
  targetLanguage: {
    id: string,
    name: string,
  },
  lessonCount: number
  createdAt: string
  updatedAt: string
};