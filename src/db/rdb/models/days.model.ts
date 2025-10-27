import { UserClient } from '../../clients/postgres.client';
import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

const sequelize = UserClient.getInstance();

class DayModel extends Model<
  InferAttributes<DayModel>,
  InferCreationAttributes<DayModel>
> {
  declare id: string
  declare courseId: string
  declare dayNumber: number
  declare title: string
  declare description: CreationOptional<string | null>
  declare updatedBy: string
  declare deletedAt: CreationOptional<string | null>
  declare deletedBy: CreationOptional<string | null>
}

DayModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    courseId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dayNumber: {
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
    tableName: 'days',
    sequelize,
    timestamps: true,
  },
);

export { DayModel };
