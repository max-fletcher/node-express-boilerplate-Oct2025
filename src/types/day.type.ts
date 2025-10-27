import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { DayModel } from '../db/rdb/models';

export type Day = InferAttributes<DayModel>;

export type StoreDay = Partial<InferCreationAttributes<DayModel>> & {
  id: string
  courseId: string
  dayNumber: number
  title: string
  updatedBy: string
  createdAt?: string | null
  updatedAt?: string | null
};

export type StoreDayData = Omit<StoreDay, 'id'>;

export type UpdateDayData = Partial<StoreDayData>;

export type DayWithTimestamps = Day & {
  createdAt: string
  updatedAt: string
};