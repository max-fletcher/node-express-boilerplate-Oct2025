import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { AppUserOTPModel } from '../db/rdb/models';

export type AppUserOTP = InferAttributes<AppUserOTPModel>;

export type StoreAppUserOTP = Partial<InferCreationAttributes<AppUserOTPModel>> & {
  id: string
  phoneNumber: string
  otp: string
  otp_expires_at: string
};

export type StoreAppUserOTPData = Omit<StoreAppUserOTP, 'id'>;

export type UpdateAppUserOTPData = Partial<StoreAppUserOTPData>;