import { UserClient } from '../../clients/postgres.client';
import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

const sequelize = UserClient.getInstance();

class DayCompletedModel extends Model<
  InferAttributes<DayCompletedModel>,
  InferCreationAttributes<DayCompletedModel>
> {
  declare id: string
  declare appUserId: string
  declare dayId: string
  declare deletedAt: CreationOptional<string | null>
  declare deletedBy: CreationOptional<string | null>
}

DayCompletedModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    appUserId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dayId: {
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
    tableName: 'day_completed',
    sequelize,
    timestamps: true,
  },
);

export { DayCompletedModel };
