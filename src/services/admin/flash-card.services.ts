import { Transaction } from 'sequelize';
import { generateId } from '../../utils/id.utils';
import { FlashCardRepository } from '../../db/rdb/repositories/flash-card.repository';
import { StoreFlashCardData, UpdateFlashCardData } from '../../types/flash-card.type';

export class FlashCardService {
  private flashCardRepo: FlashCardRepository;

  constructor() {
    this.flashCardRepo = new FlashCardRepository();
  }

  async findFlashCardById(id: string, select: string[]|null = null, withRelations: boolean = false) {
    return await this.flashCardRepo.findFlashCardById(id, select, withRelations);
  }

  async flashCardExistsById(id: string) {
    return await this.flashCardRepo.flashCardExistsById(id);
  }

  async getPaginatedFlashCards(page: number = 1, limit: number = 10, sortOrder: string, sortBy: string, searchText?: string|null) {
    return await this.flashCardRepo.getPaginatedFlashCards(page, limit, sortOrder, sortBy, searchText)
  }

  async getAllFlashCards() {
    return await this.flashCardRepo.getAllFlashCards();
  }

  async getAllFlashCardsWithOptions(select: string[]|null = null) {
    return await this.flashCardRepo.getAllFlashCardsWithOptions(select);
  }

  async getAllFlashCardsCount() {
    return await this.flashCardRepo.getAllFlashCardsCount();
  }

  async getAllAssociatedFlashCardsCount(lessonId: string) {
    return await this.flashCardRepo.getAllAssociatedFlashCardsCount(lessonId);
  }

  async storeFlashCard(data: StoreFlashCardData, transaction?: Transaction) {
    return await this.flashCardRepo.storeFlashCard({ id: generateId(), ...data }, transaction);
  }

  async updateFlashCard(data: UpdateFlashCardData, id: string, transaction?: Transaction) {
    return await this.flashCardRepo.updateFlashCard(data, id, transaction);
  }

  async deleteFlashCard(id: string, deletedBy: string, transaction?: Transaction) {
    return await this.flashCardRepo.deleteFlashCard(id, deletedBy, transaction);
  }

  async lessonWithCardOrderExists(dayId: string, flashCardOrder : number) {
    return await this.flashCardRepo.lessonWithCardOrderExists(dayId, flashCardOrder);
  }
}
