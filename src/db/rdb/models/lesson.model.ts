import { Difficulty } from '../../../constants/enums';
import { UserClient } from '../../clients/postgres.client';
import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

const sequelize = UserClient.getInstance();

class LessonModel extends Model<
  InferAttributes<LessonModel>,
  InferCreationAttributes<LessonModel>
> {
  declare id: string
  declare dayId: string
  declare lessonOrder: number
  declare title: string
  declare description: CreationOptional<string | null>
  declare estimatedMinutes: number
  declare difficulty: CreationOptional<string>
  declare audioIntro: CreationOptional<string | null>
  // declare xpReward: CreationOptional<number>
  declare updatedBy: string
  declare deletedAt: CreationOptional<string | null>
  declare deletedBy: CreationOptional<string | null>
}

LessonModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    dayId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lessonOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    estimatedMinutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    difficulty: {
      type: DataTypes.ENUM(
        Difficulty.BEGINNER,
        Difficulty.INTERMEDIATE,
        Difficulty.ADVANCED,
      ),
      defaultValue: Difficulty.BEGINNER,
      allowNull: false,
    },
    audioIntro: {
      type: DataTypes.STRING,
    },
    // xpReward: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   defaultValue: 50
    // },
    updatedBy: {
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
    tableName: 'lessons',
    sequelize,
    timestamps: true,
  },
);

export { LessonModel };
