import { Familiarity } from '../../../constants/enums';
import { UserClient } from '../../clients/postgres.client';
import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

const sequelize = UserClient.getInstance();

class FlashCardViewedModel extends Model<
  InferAttributes<FlashCardViewedModel>,
  InferCreationAttributes<FlashCardViewedModel>
> {
  declare id: string
  declare appUserId: string
  declare flashCardId: string
  declare familiarity: CreationOptional<string | null>
  declare deletedAt: CreationOptional<string | null>
  declare deletedBy: CreationOptional<string | null>
}

FlashCardViewedModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    appUserId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    flashCardId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    familiarity: {
      type: DataTypes.ENUM(
        Familiarity.KNOWIT,
        Familiarity.FAMILIAR,
        Familiarity.DONTKNOW,
      ),
      allowNull: true,
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
    tableName: 'flash_card_viewed',
    sequelize,
    timestamps: true,
  },
);

export { FlashCardViewedModel };
