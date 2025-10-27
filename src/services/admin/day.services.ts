import { Transaction } from 'sequelize';
import { generateId } from '../../utils/id.utils';
import { StoreDayData, UpdateDayData } from '../../types/day.type';
import { DayRepository } from '../../db/rdb/repositories/day.repository';

export class DayService {
  private dayRepo: DayRepository;

  constructor() {
    this.dayRepo = new DayRepository();
  }

  async findDayById(id: string, select: string[]|null = null, withRelations: boolean = false) {
    return await this.dayRepo.findDayById(id, select, withRelations);
  }

  async dayExistsById(id: string) {
    return await this.dayRepo.dayExistsById(id);
  }

  async getPaginatedDays(page: number = 1, limit: number = 10, sortOrder: string, sortBy: string, searchText?: string|null) {
    return await this.dayRepo.getPaginatedDays(page, limit, sortOrder, sortBy, searchText)
  }

  async getAllDays() {
    return await this.dayRepo.getAllDays();
  }

  async getAllDaysWithOptions(select: string[]|null = null) {
    return await this.dayRepo.getAllDaysWithOptions(select);
  }

  async getAllDaysCount() {
    return await this.dayRepo.getAllDaysCount();
  }

  async getAllAssociatedDaysCount(courseId: string) {
    return await this.dayRepo.getAllAssociatedDaysCount(courseId);
  }

  async storeDay(data: StoreDayData, transaction?: Transaction) {
    return await this.dayRepo.storeDay({ id: generateId(), ...data }, transaction);
  }

  async updateDay(data: UpdateDayData, id: string, transaction?: Transaction) {
    return await this.dayRepo.updateDay(data, id, transaction);
  }

  async deleteDay(id: string, deletedBy: string, transaction?: Transaction) {
    return await this.dayRepo.deleteDay(id, deletedBy, transaction);
  }

  async courseWithDayExists(courseId: string, dayNumber: number) {
    return await this.dayRepo.courseWithDayExists(courseId, dayNumber);
  }

  async daysGreaterThanNewTotalDaysCount(courseId: string, totalDays: number) {
    return await this.dayRepo.daysGreaterThanNewTotalDaysCount(courseId, totalDays);
  }
}
