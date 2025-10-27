import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { TimeSpentModel } from '../db/rdb/models';

export type TimeSpent = InferAttributes<TimeSpentModel>;

export type StoreTimeSpent = Partial<InferCreationAttributes<TimeSpentModel>> & {
  id: string
  appUserId: string
  timeSpent: number
  createdAt?: string | null
  updatedAt?: string | null
};

export type StoreTimeSpentData = Omit<StoreTimeSpent, 'id'>;

export type UpdateTimeSpentData = Partial<StoreTimeSpentData>;

export type TimeSpentWithTimestamps = TimeSpent & {
  createdAt: string
  updatedAt: string
};