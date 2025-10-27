import { Op, Transaction } from 'sequelize';
import { LoginHistoryModel } from '../models';
import { LoginHistory, UpdateLoginHistoryData, StoreLoginHistory } from '../../../types/login-history.type';
import { datetimeYMDHis } from '../../../utils/datetime.utils';
import { UserClient } from '../../clients/postgres.client';

const sequelize = UserClient.getInstance();
export class LoginHistoryRepository {
  constructor() {}
  async findLoginHistoryById(id: string, select: string[]|null = null): Promise<LoginHistory> {
    const options: any = {
      where: {
        id: id,
        deletedAt:{
          [Op.eq]: null
        } 
      },
    }

    if(select && select.length > 0)
      options.attributes = select

    return (await LoginHistoryModel.findOne(options)) as unknown as LoginHistory;
  }

  async findLoginHistoryByIds(ids: string[]): Promise<LoginHistory[]> {
    return (await LoginHistoryModel.findAll({
      where: {
        id: {
          [Op.in]: ids,
          deletedAt:{
            [Op.eq]: null
          } 
        },
      },
    })) as unknown as LoginHistory[];
  }

  async loginHistoryExistsById(id: string): Promise<number> {
    return await LoginHistoryModel.count({
      where: {
        id: id,
        deletedAt:{
          [Op.eq]: null
        }
      },
    });
  }

  async getAllLoginHistories(): Promise<LoginHistory[]> {
    return (await LoginHistoryModel.findAll({
      where: {
        deletedAt: {
          [Op.eq]: null
        }
      },
      order: [['createdAt', 'DESC']],
    })) as unknown as LoginHistory[];
  }

  async getAllLoginHistoriesCount(): Promise<number> {
    return await LoginHistoryModel.count({
      where: {
        deletedAt: {
          [Op.eq]: null
        }
      },
    });
  }

  async storeLoginHistory(data: StoreLoginHistory, transaction?: Transaction): Promise<LoginHistory> {
    const options: any = {};

    if(transaction) options.transaction = transaction;

    return await LoginHistoryModel.create(data, options) as unknown as LoginHistory;
  }

  async updateLoginHistory(data: UpdateLoginHistoryData, id: string, transaction?: Transaction): Promise<LoginHistory> {
    const options: any = {
      where: {
        id: id,
      },
    };

    if(transaction) options.transaction = transaction;

    return (await LoginHistoryModel.update(data, options)) as unknown as LoginHistory;
  }

  async deleteLoginHistory(id: string, deletedBy: string, transaction?: Transaction): Promise<LoginHistory> {
    const options: any = {
      where: {
        id: id,
      },
    };

    if(transaction) options.transaction = transaction;

    return await LoginHistoryModel.update({ deletedAt: datetimeYMDHis(), deletedBy: deletedBy }, options) as unknown as LoginHistory;
  }

  async hardDeleteById(id: string, transaction?: Transaction): Promise<LoginHistory> {
    const options: any = {
      where: {
        id: id,
      },
    };

    if(transaction) options.transaction = transaction;

    return (await LoginHistoryModel.destroy(options)) as unknown as LoginHistory;
  }

  async getAllLoginHistoriesWithOptions(select: string[]|null = null): Promise<LoginHistory[]> {
    const options: any = {};

    if(select && select.length > 0)
      options.attributes = select

    return (await LoginHistoryModel.findAll(options));
  }

  async storeDailyLoginHistory(data: StoreLoginHistory, transaction?: Transaction): Promise<boolean> {
    const yesterdaysStartDatetime = datetimeYMDHis(null, 'days', 1, 'before', 'startOfDay');
    const yesterdaysEndDatetime = datetimeYMDHis(null, 'days', 1, 'before', 'endOfDay');

    const yesterdaysEntryexists = await LoginHistoryModel.findOne({
      where: {
        createdAt: {
          [Op.gte] : yesterdaysStartDatetime,
          [Op.lte] : yesterdaysEndDatetime,
        }
      }
    } as any);

    const startDatetime = datetimeYMDHis(null, 'days', 0, 'before', 'startOfDay');
    const endDatetime = datetimeYMDHis(null, 'days', 0, 'before', 'endOfDay');

    const todaysEntryexists = await LoginHistoryModel.findOne({
      where: {
        createdAt: {
          [Op.gte] : startDatetime,
          [Op.lte] : endDatetime,
        }
      }
    } as any);

    if(!todaysEntryexists){
      const streakOptions: any = {}
      if(transaction) streakOptions.transaction = transaction;

      if(yesterdaysEntryexists){
        const query = `UPDATE "app_users" SET "streak" = "streak" + 1 WHERE "id" = '${data.appUserId}';`;
        await sequelize.query(query, streakOptions);
      }
      else{
        const query = `UPDATE "app_users" SET "streak" = 0 WHERE "id" = '${data.appUserId}';`;
        await sequelize.query(query, streakOptions);
      }
    }

    if(todaysEntryexists) return true

    const options: any = {};

    if(transaction) options.transaction = transaction;

    await LoginHistoryModel.create(data, options);
    return false
  }

  async getLoginHistoryForAppUser(appUserId: string, afterDate?: string): Promise<LoginHistory> {
    let options: any = {
      where: {
        appUserId: appUserId,
        deletedAt: {
          [Op.eq]: null
        },
      },
      attributes: ['id', 'createdAt'],
    }

    if(afterDate)
      options.where = { ...options.where, createdAt: { [Op.gt]: afterDate } }

    return await LoginHistoryModel.findAll(options) as unknown as LoginHistory;
  }
}
