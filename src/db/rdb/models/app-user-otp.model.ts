import { UserClient } from '../../clients/postgres.client';
import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

const sequelize = UserClient.getInstance();

class AppUserOTPModel extends Model<
  InferAttributes<AppUserOTPModel>,
  InferCreationAttributes<AppUserOTPModel>
> {
  declare id: string
  declare phoneNumber: string
  declare otp: string
  declare otp_expires_at: string
  declare deletedAt: CreationOptional<string | null>;
  declare deletedBy: CreationOptional<string | null>;
}

AppUserOTPModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
    },
    otp: {
      type: DataTypes.STRING,
    },
    otp_expires_at: {
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    deletedBy: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
  },
  {
    tableName: 'app_user_otps',
    sequelize,
    timestamps: true,
  },
);

export { AppUserOTPModel };
