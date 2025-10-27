import { UserClient } from '../../clients/postgres.client';
import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

const sequelize = UserClient.getInstance();

class AppUserCourseModel extends Model<
  InferAttributes<AppUserCourseModel>,
  InferCreationAttributes<AppUserCourseModel>
> {
  declare id: string
  declare appUserId: string
  declare courseId: string
  declare deletedAt: CreationOptional<string | null>
  declare deletedBy: CreationOptional<string | null>
}

AppUserCourseModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    appUserId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    courseId: {
      type: DataTypes.STRING,
      allowNull: false,
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
    tableName: 'user_courses',
    sequelize,
    timestamps: true,
  },
);

export { AppUserCourseModel };
