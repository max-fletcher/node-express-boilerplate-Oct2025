import { Transaction } from 'sequelize';
import { generateId } from '../../utils/id.utils';
import { StoreFlashCardViewedData, UpdateFlashCardViewedData } from '../../types/flash-card-viewed.type';
import { FlashCardViewedRepository } from '../../db/rdb/repositories/flash-card-viewed.repository';

export class FlashCardViewedService {
  private flashCardViewedRepo: FlashCardViewedRepository;

  constructor() {
    this.flashCardViewedRepo = new FlashCardViewedRepository();
  }

  async findFlashCardViewedById(id: string, select: string[]|null = null) {
    return await this.flashCardViewedRepo.findFlashCardViewedById(id, select);
  }

  async findFlashCardViewedByFlashCardIdAndAppUserId(flashCardId: string, appUserId: string, select: string[]|null = null) {
    return await this.flashCardViewedRepo.findFlashCardViewedByFlashCardIdAndAppUserId(flashCardId, appUserId, select);
  }

  async flashCardViewedExistsById(id: string) {
    return await this.flashCardViewedRepo.flashCardViewedExistsById(id);
  }

  async getAllFlashCardVieweds() {
    return await this.flashCardViewedRepo.getAllFlashCardViewed();
  }

  async getAllFlashCardViewedCount() {
    return await this.flashCardViewedRepo.getAllFlashCardViewedCount();
  }

  async getAllFlashCardViewedByAppUserCount(appUserId: string) {
    return await this.flashCardViewedRepo.getAllFlashCardViewedByAppUserCount(appUserId);
  }

  async storeFlashCardViewed(data: StoreFlashCardViewedData, transaction?: Transaction) {
    return await this.flashCardViewedRepo.storeFlashCardViewed({ id: generateId(), ...data }, transaction);
  }

  async updateFlashCardViewed(data: UpdateFlashCardViewedData, id: string, transaction?: Transaction) {
    return await this.flashCardViewedRepo.updateFlashCardViewed(data, id, transaction);
  }

  async deleteFlashCardViewed(id: string, deletedBy: string, transaction?: Transaction) {
    return await this.flashCardViewedRepo.deleteFlashCardViewed(id, deletedBy, transaction);
  }
}
