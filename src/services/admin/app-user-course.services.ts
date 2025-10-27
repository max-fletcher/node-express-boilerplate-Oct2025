import { Transaction } from 'sequelize';
import { generateId } from '../../utils/id.utils';
import { BulkStoreAppUserCourseData, StoreAppUserCourse, StoreAppUserCourseData, UpdateAppUserCourseData } from '../../types/app-user-course.type';
import { AppUserCourseRepository } from '../../db/rdb/repositories/app-user-course.repository';

export class AppUserCourseService {
  private appUserCourseRepo: AppUserCourseRepository;

  constructor() {
    this.appUserCourseRepo = new AppUserCourseRepository();
  }

  async findAppUserCourseById(id: string, select: string[]|null = null, withRelations: boolean = false) {
    return await this.appUserCourseRepo.findAppUserCourseById(id, select, withRelations);
  }

  async appUserCourseExistsById(id: string) {
    return await this.appUserCourseRepo.appUserCourseExistsById(id);
  }

  async getAllAppUserCourses() {
    return await this.appUserCourseRepo.getAllAppUserCourses();
  }

  async getAllAppUserCoursesWithOptions(select: string[]|null = null) {
    return await this.appUserCourseRepo.getAllAppUserCoursesWithOptions(select);
  }

  async bulkStoreAppUserCourse(data: BulkStoreAppUserCourseData[], fields?: ("id" | "appUserId" | "courseId" | "updatedBy" | "deletedAt" | "deletedBy")[], transaction?: Transaction) {
    for (let i = 0; i < data.length; i++) {
      const id = generateId()
      data[i].id = id
    }
    return await this.appUserCourseRepo.bulkStoreAppUserCourse(data as StoreAppUserCourse[], fields, transaction);
  }

  async storeAppUserCourse(data: StoreAppUserCourseData, transaction?: Transaction) {
    return await this.appUserCourseRepo.storeAppUserCourse({ id: generateId(), ...data }, transaction);
  }

  async updateAppUserCourse(data: UpdateAppUserCourseData, id: string, transaction?: Transaction) {
    return await this.appUserCourseRepo.updateAppUserCourse(data, id, transaction);
  }

  async deleteAppUserCourse(id: string, deletedBy: string, transaction?: Transaction) {
    return await this.appUserCourseRepo.deleteAppUserCourse(id, deletedBy, transaction);
  }

  async findAppUserCourseByAppUserIdAndCourseId(appUserId: string, courseId: string) {
    return await this.appUserCourseRepo.findAppUserCourseByAppUserIdAndCourseId(appUserId, courseId);
  }

  async appUserCourseExistsByAppUserIdAndCourseId(appUserId: string, courseId: string) {
    return await this.appUserCourseRepo.appUserCourseExistsByAppUserIdAndCourseId(appUserId, courseId);
  }

  async findAppUserWithCoursesById(id: string, select: string[]|null = null) {
    return await this.appUserCourseRepo.findAppUserWithCoursesById(id, select);
  }

  async viewEnrolledCourses(appUserId: string, limit: number, offset: number, languageId?: string|null, searchText?: string|null) {
    return await this.appUserCourseRepo.viewEnrolledCourses(appUserId, limit, offset, languageId, searchText);
  }

  async viewEnrolledCourseDetails(courseId: string, appUserId: string) {
    return await this.appUserCourseRepo.viewEnrolledCourseDetails(courseId, appUserId);
  }
}
