import { Transaction } from 'sequelize';
import { generateId } from '../../utils/id.utils';
import { LanguageRepository } from '../../db/rdb/repositories/language.repository';
import { StoreLanguageData, UpdateLanguageData } from '../../types/language.type';

export class LanguageService {
  private languageRepo: LanguageRepository;

  constructor() {
    this.languageRepo = new LanguageRepository();
  }

  async findLanguageById(id: string, select: string[]|null = null) {
    return await this.languageRepo.findLanguageById(id, select);
  }

  async languageExistsById(id: string) {
    return await this.languageRepo.languageExistsById(id);
  }

  async getPaginatedLanguages(page: number = 1, limit: number = 10, sortOrder: string, sortBy: string, searchText?: string|null) {
    return await this.languageRepo.getPaginatedLanguages(page, limit, sortOrder, sortBy, searchText)
  }

  async getAllLanguages(select: string[]|null = null) {
    return await this.languageRepo.getAllLanguages(select);
  }

  async getAllLanguagesWithOptions(select: string[]|null = null) {
    return await this.languageRepo.getAllLanguagesWithOptions(select);
  }

  async storeLanguage(data: StoreLanguageData, transaction?: Transaction) {
    return await this.languageRepo.storeLanguage({ id: generateId(), ...data }, transaction);
  }

  async updateLanguage(data: UpdateLanguageData, id: string, transaction?: Transaction) {
    return await this.languageRepo.updateLanguage(data, id, transaction);
  }

  async deleteLanguage(id: string, deletedBy: string, transaction?: Transaction) {
    return await this.languageRepo.deleteLanguage(id, deletedBy, transaction);
  }

  async languageExistsByName(name: string, exceptId?: string) {
    return await this.languageRepo.languageExistsByName(name, exceptId);
  }
}
