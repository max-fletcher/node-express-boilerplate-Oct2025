import { Transaction } from 'sequelize';
import { generateId } from '../../utils/id.utils';
import { StoreTimeSpentData, UpdateTimeSpentData } from '../../types/time-spent.type';
import { TimeSpentRepository } from '../../db/rdb/repositories/time-spent.repository';

export class TimeSpentService {
  private timeSpentRepo: TimeSpentRepository;

  constructor() {
    this.timeSpentRepo = new TimeSpentRepository();
  }

  async findTimeSpentById(id: string, select: string[]|null = null) {
    return await this.timeSpentRepo.findTimeSpentById(id, select);
  }

  async timeSpentExistsById(id: string) {
    return await this.timeSpentRepo.timeSpentExistsById(id);
  }

  async storeTimeSpent(data: StoreTimeSpentData, transaction?: Transaction) {
    return await this.timeSpentRepo.storeTimeSpent({ id: generateId(), ...data }, transaction);
  }

  async updateTimeSpent(data: UpdateTimeSpentData, id: string, transaction?: Transaction) {
    return await this.timeSpentRepo.updateTimeSpent(data, id, transaction);
  }

  async deleteTimeSpent(id: string, transaction?: Transaction) {
    return await this.timeSpentRepo.deleteTimeSpent(id, transaction);
  }

  async findTimeSpentByAppUserId(appUserId: string) {
    return await this.timeSpentRepo.findTimeSpentByAppUserId(appUserId);
  }

  async timeSpentExistsByAppUserId(appUserId: string) {
    return await this.timeSpentRepo.timeSpentExistsByAppUserId(appUserId);
  }

  async incrementTimeSpentByAppUserId(appUserId: string, time: number) {
    return await this.timeSpentRepo.incrementTimeSpentByAppUserId(appUserId, time);
  }
}
