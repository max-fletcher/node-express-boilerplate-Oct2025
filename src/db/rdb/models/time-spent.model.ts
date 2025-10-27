import { UserClient } from '../../clients/postgres.client';
import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';

const sequelize = UserClient.getInstance();

class TimeSpentModel extends Model<
  InferAttributes<TimeSpentModel>,
  InferCreationAttributes<TimeSpentModel>
> {
  declare id: string
  declare appUserId: string
  declare timeSpent: number
}

TimeSpentModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    appUserId: {
      type: DataTypes.STRING,
      field: 'appUserId', // prevents conversion to snake_case
      allowNull: false,
    },
    timeSpent: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'time_spent',
    sequelize,
    timestamps: true,
  },
);

export { TimeSpentModel };
