import { Transaction } from 'sequelize';
import { generateId } from '../../utils/id.utils';
import { LessonRepository } from '../../db/rdb/repositories/lesson.repository';
import { StoreLessonData, UpdateLessonData } from '../../types/lesson.type';

export class LessonService {
  private lessonRepo: LessonRepository;

  constructor() {
    this.lessonRepo = new LessonRepository();
  }

  async findLessonById(id: string, select: string[]|null = null, withRelations: boolean = false) {
    return await this.lessonRepo.findLessonById(id, select, withRelations);
  }

  async lessonExistsById(id: string) {
    return await this.lessonRepo.lessonExistsById(id);
  }

  async getPaginatedLessons(page: number = 1, limit: number = 10, sortOrder: string, sortBy: string, searchText?: string|null) {
    return await this.lessonRepo.getPaginatedLessons(page, limit, sortOrder, sortBy, searchText)
  }

  async getAllLessons() {
    return await this.lessonRepo.getAllLessons();
  }

  async getAllLessonsWithOptions(select: string[]|null = null) {
    return await this.lessonRepo.getAllLessonsWithOptions(select);
  }

  async getAllLessonsCount() {
    return await this.lessonRepo.getAllLessonsCount();
  }

  async getAllAssociatedLessonsCount(dayId: string) {
    return await this.lessonRepo.getAllAssociatedLessonsCount(dayId);
  }

  async storeLesson(data: StoreLessonData, transaction?: Transaction) {
    return await this.lessonRepo.storeLesson({ id: generateId(), ...data }, transaction);
  }

  async updateLesson(data: UpdateLessonData, id: string, transaction?: Transaction) {
    return await this.lessonRepo.updateLesson(data, id, transaction);
  }

  async deleteLesson(id: string, deletedBy: string, transaction?: Transaction) {
    return await this.lessonRepo.deleteLesson(id, deletedBy, transaction);
  }

  async dayWithLessonOrderExists(dayId: string, lessonOrder : number) {
    return await this.lessonRepo.dayWithLessonOrderExists(dayId, lessonOrder);
  }

  async viewFlashCards(lessonId: string, appUserId: string) {
    return await this.lessonRepo.viewFlashCards(lessonId, appUserId);
  }

  async nextLesson(lessonId: string) {
    return await this.lessonRepo.nextLesson(lessonId);
  }
}
