import { Transaction } from 'sequelize';
import { generateId } from '../../utils/id.utils';
import { StoreLoginHistoryData, UpdateLoginHistoryData } from '../../types/login-history.type';
import { LoginHistoryRepository } from '../../db/rdb/repositories/login-history.repository';

export class LoginHistoryService {
  private loginHistoryRepo: LoginHistoryRepository;

  constructor() {
    this.loginHistoryRepo = new LoginHistoryRepository();
  }

  async findLoginHistoryById(id: string, select: string[]|null = null) {
    return await this.loginHistoryRepo.findLoginHistoryById(id, select);
  }

  async loginHistoryExistsById(id: string) {
    return await this.loginHistoryRepo.loginHistoryExistsById(id);
  }

  async getAllLoginHistories() {
    return await this.loginHistoryRepo.getAllLoginHistories();
  }

  async getAllLoginHistoriesWithOptions(select: string[]|null = null) {
    return await this.loginHistoryRepo.getAllLoginHistoriesWithOptions(select);
  }

  async getAllLoginHistoriesCount() {
    return await this.loginHistoryRepo.getAllLoginHistoriesCount();
  }

  async storeLoginHistory(data: StoreLoginHistoryData, transaction?: Transaction) {
    return await this.loginHistoryRepo.storeLoginHistory({ id: generateId(), ...data }, transaction);
  }

  async updateLoginHistory(data: UpdateLoginHistoryData, id: string, transaction?: Transaction) {
    return await this.loginHistoryRepo.updateLoginHistory(data, id, transaction);
  }

  async deleteLoginHistory(id: string, deletedBy: string, transaction?: Transaction) {
    return await this.loginHistoryRepo.deleteLoginHistory(id, deletedBy, transaction);
  }

  async storeDailyLoginHistory(data: StoreLoginHistoryData, transaction?: Transaction) {
    return await this.loginHistoryRepo.storeDailyLoginHistory({ id: generateId(), ...data }, transaction);
  }

  async getLoginHistoryForAppUser(appUserId: string, afterDate?: string) {
    return await this.loginHistoryRepo.getLoginHistoryForAppUser(appUserId, afterDate);
  }
}
