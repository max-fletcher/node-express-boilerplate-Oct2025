import { UserClient } from '../../clients/postgres.client';
import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

const sequelize = UserClient.getInstance();

class LessonCompletedModel extends Model<
  InferAttributes<LessonCompletedModel>,
  InferCreationAttributes<LessonCompletedModel>
> {
  declare id: string
  declare appUserId: string
  declare lessonId: string
  declare timeSpent: CreationOptional<number | null>
  declare deletedAt: CreationOptional<string | null>
  declare deletedBy: CreationOptional<string | null>
}

LessonCompletedModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    appUserId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lessonId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timeSpent: {
      type: DataTypes.NUMBER,
      allowNull: false,
      defaultValue: 0
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
    tableName: 'lesson_completed',
    sequelize,
    timestamps: true,
  },
);

export { LessonCompletedModel };
