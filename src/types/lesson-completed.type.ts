// import { InferAttributes, InferCreationAttributes } from 'sequelize';
// import { LessonCompletedModel } from '../db/rdb/models';

// export type LessonCompleted = InferAttributes<LessonCompletedModel>;

// export type StoreLessonCompleted = Partial<InferCreationAttributes<LessonCompletedModel>> & {
//   id: string
//   appUserId: string
//   lessonId: string
//   timeSpent: number | null
//   createdAt?: string | null
//   updatedAt?: string | null
// };

// export type StoreLessonCompletedData = Omit<StoreLessonCompleted, 'id'>;

// export type UpdateLessonCompletedData = Partial<StoreLessonCompletedData>;

// export type LessonCompletedWithTimestamps = LessonCompleted & {
//   createdAt: string
//   updatedAt: string
// };