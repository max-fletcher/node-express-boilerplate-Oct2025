import { UserClient } from '../../clients/postgres.client';
import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

const sequelize = UserClient.getInstance();

class AppUserModel extends Model<
  InferAttributes<AppUserModel>,
  InferCreationAttributes<AppUserModel>
> {
  declare id: string;
  declare phoneNumber: string;
  declare firstName: CreationOptional<string | null>;
  declare lastName: CreationOptional<string | null>;
  declare email: CreationOptional<string | null>;
  declare streak: CreationOptional<number>;
  declare avatarUrl: CreationOptional<string | null>;
  declare isNewUser: CreationOptional<boolean>;
  declare lastLoginAt: CreationOptional<string>;
  declare deletedAt: CreationOptional<string | null>;
  declare deletedBy: CreationOptional<string | null>;
}

AppUserModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    lastName: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    email: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    streak: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    avatarUrl: {
      type: DataTypes.STRING,
    },
    isNewUser: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      defaultValue: null,
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
    tableName: 'app_users',
    sequelize,
    timestamps: true,
  },
);

export { AppUserModel };
