import { AdminUserModel } from '../db/rdb/models';
import { InferAttributes, InferCreationAttributes } from 'sequelize';

export type AdminUser = InferAttributes<AdminUserModel>;

export type StoreAdminUser = Partial<InferCreationAttributes<AdminUserModel>> & {
  id: string
  email: string
  phoneNumber: string | null
  password: string
  createdAt?: string | null
  updatedAt?: string | null
};

export type StoreAdminUserData = Omit<StoreAdminUser, 'id'>;

export type UpdateAdminUserData = Partial<StoreAdminUserData>;