import { Transaction } from 'sequelize';
import { AppUserRepository } from '../../db/rdb/repositories/app-user.repository';
import { StoreAppUserData, UpdateAppUserData } from '../../types/app-user.type';
import { generateId } from '../../utils/id.utils';

export class AppUserService {
  private appUserRepo: AppUserRepository;

  constructor() {
    this.appUserRepo = new AppUserRepository();
  }

  async findUserById(id: string, select: string[]|null = null, withEnrolledCourses: boolean = false) {
    return await this.appUserRepo.findUserById(id, select, withEnrolledCourses);
  }

  async userExistsById(id: string) {
    return await this.appUserRepo.userExistsById(id);
  }

  async findUserByEmail(email: string) {
    return await this.appUserRepo.findUserByEmail(email);
  }

  async userExistsByEmail(email: string, exceptId: string | null = null) {
    return await this.appUserRepo.userExistsByEmail(email, exceptId);
  }

  async findUserByPhone(phoneNumber: string, exceptId: string | null = null, select: string[]|null = null) {
    return await this.appUserRepo.findUserByPhone(phoneNumber, exceptId, select);
  }

  async userExistsByPhone(phoneNumber: string, exceptId: string | null = null) {
    return await this.appUserRepo.userExistsByPhone(phoneNumber, exceptId);
  }

  async getPaginatedAppUsers(page: number = 1, limit: number = 10, sortOrder: string, sortBy: string, searchText?: string|null) {
    return await this.appUserRepo.getPaginatedAppUsers(page, limit, sortOrder, sortBy, searchText)
  }

  async getAllAppUsers() {
    return await this.appUserRepo.getAllAppUsers();
  }

  async getAllAppUsersWithOptions(select: string[]|null = null) {
    return await this.appUserRepo.getAllAppUsersWithOptions(select);
  }

  async getPaginatedAppUsersForCourseList(limit: number|string, offset: number|string, orderBy: string) {
    limit = Number(limit)
    offset = Number(offset)
    return await this.appUserRepo.getPaginatedAppUsersForCourseList(limit, offset, orderBy);
  }

  async storeAppUser(data: StoreAppUserData, transaction?: Transaction) {
    return await this.appUserRepo.storeAppUser({ id: generateId(), ...data }, transaction);
  }

  async updateAppUser(data: UpdateAppUserData, id: string, transaction?: Transaction) {
    return await this.appUserRepo.updateAppUser(data, id, transaction);
  }

  async deleteAppUser(id: string, deletedBy: string, transaction?: Transaction) {
    return await this.appUserRepo.deleteAppUser(id, deletedBy, transaction);
  }
}
