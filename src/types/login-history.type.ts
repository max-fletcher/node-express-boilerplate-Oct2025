import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { LoginHistoryModel } from '../db/rdb/models';

export type LoginHistory = InferAttributes<LoginHistoryModel>;

export type StoreLoginHistory = Partial<InferCreationAttributes<LoginHistoryModel>> & {
  id: string
  appUserId: string
  createdAt?: string | null
  updatedAt?: string | null
};

export type StoreLoginHistoryData = Omit<StoreLoginHistory, 'id'>;

export type UpdateLoginHistoryData = Partial<StoreLoginHistoryData>;

export type LoginHistoryWithTimestamps = LoginHistory & {
  createdAt: string
  updatedAt: string
};