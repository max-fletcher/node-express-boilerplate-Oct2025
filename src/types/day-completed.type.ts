// import { InferAttributes, InferCreationAttributes } from 'sequelize';
// import { DayCompletedModel } from '../db/rdb/models';

// export type DayCompleted = InferAttributes<DayCompletedModel>;

// export type StoreDayCompleted = Partial<InferCreationAttributes<DayCompletedModel>> & {
//   id: string
//   appUserId: string
//   dayId: string
//   createdAt?: string | null
//   updatedAt?: string | null
// };

// export type StoreDayCompletedData = Omit<StoreDayCompleted, 'id'>;

// export type UpdateDayCompletedData = Partial<StoreDayCompletedData>;

// export type DayCompletedWithTimestamps = DayCompleted & {
//   createdAt: string
//   updatedAt: string
// };