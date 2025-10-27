import { Op, Transaction } from 'sequelize';
import { TimeSpentModel } from '../models';
import { TimeSpent, UpdateTimeSpentData, StoreTimeSpent } from '../../../types/time-spent.type';
import { UserClient } from '../../clients/postgres.client';

const sequelize = UserClient.getInstance();

export class TimeSpentRepository {
  constructor() {}
  async findTimeSpentById(id: string, select: string[]|null = null): Promise<TimeSpent> {
    const options: any = {
      where: {
        id: id,
      },
    }

    if(select && select.length > 0)
      options.attributes = select

    return (await TimeSpentModel.findOne(options)) as unknown as TimeSpent;
  }

  async findTimeSpentByIds(ids: string[]): Promise<TimeSpent[]> {
    return (await TimeSpentModel.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    })) as unknown as TimeSpent[];
  }

  async timeSpentExistsById(id: string): Promise<number> {
    return await TimeSpentModel.count({
      where: {
        id: id
      },
    });
  }

  async storeTimeSpent(data: StoreTimeSpent, transaction?: Transaction): Promise<TimeSpent> {
    const options: any = {};

    if(transaction) options.transaction = transaction;

    return await TimeSpentModel.create(data, options) as unknown as TimeSpent;
  }

  async updateTimeSpent(data: UpdateTimeSpentData, id: string, transaction?: Transaction): Promise<TimeSpent> {
    const options: any = {
      where: {
        id: id,
      },
    };

    if(transaction) options.transaction = transaction;

    return (await TimeSpentModel.update(data, options)) as unknown as TimeSpent;
  }

  async deleteTimeSpent(id: string, transaction?: Transaction): Promise<TimeSpent> {
    const options: any = {
      where: {
        id: id,
      },
    };

    if(transaction) options.transaction = transaction;

    return (await TimeSpentModel.destroy(options)) as unknown as TimeSpent;
  }

  async findTimeSpentByAppUserId(appUserId: string, select: string[]|null = null): Promise<TimeSpent> {
    const options: any = {
      where: {
        appUserId: appUserId
      },
    }

    if(select && select.length > 0)
      options.attributes = select

    return (await TimeSpentModel.findOne(options)) as unknown as TimeSpent;
  }

  async timeSpentExistsByAppUserId(appUserId: string): Promise<number> {
    return await TimeSpentModel.count({
      where: {
        appUserId: appUserId
      },
    });
  }

  async incrementTimeSpentByAppUserId(appUserId: string, time: number): Promise<any> {
    const options: any = {
      where: {
        appUserId: appUserId
      },
    }

    const query = `UPDATE "time_spent" SET "timeSpent" = "timeSpent" + ${time} WHERE "appUserId" = '${appUserId}';`;
    return await sequelize.query(query, options);
  }
}
