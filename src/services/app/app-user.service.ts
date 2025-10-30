import { AppUserRepository } from '../../db/rdb/repositories/app-user.repository';
import { users } from '../../db/rdb/schema';
import { TAppUserCreate, TAppUserUpdate } from '../../types/types/app-user.type';
import { TTransaction } from '../../types/types/common.type';

export class AppUserService {
  private appUserRepo: AppUserRepository;

  constructor() {
    this.appUserRepo = new AppUserRepository();
  }

  /**
   * Fetch all data from the "users" table
   *
   * @async
   * @function getAllAppUsers
   * @param {import('express').Request} req - The Express request object.
   * @param {import('express').Response} res - The Express response object.
   * @returns {Promise<void>} Responds with JSON containing the created user and status message.
   * @throws {Error} Logs an error to the console if something goes wrong.
   */
  async getAll() {
    return await this.appUserRepo.getAll();
  }

  async findById(id: string, select: (keyof typeof users['_']['columns'])[] | null = null) {
    return await this.appUserRepo.findById(id, select);
  }

  async findByIds(ids: string[], select: (keyof typeof users['_']['columns'])[] | null = null) {
    return await this.appUserRepo.findByIds(ids, select);
  }

  // async userExistsById(id: string) {
  //   return await this.appUserRepo.userExistsById(id);
  // }

  // async findUserByEmail(email: string) {
  //   return await this.appUserRepo.findUserByEmail(email);
  // }

  // async userExistsByEmail(email: string, exceptId: string | null = null) {
  //   return await this.appUserRepo.userExistsByEmail(email, exceptId);
  // }

  // async findUserByPhone(phoneNumber: string, exceptId: string | null = null, select: string[]|null = null) {
  //   return await this.appUserRepo.findUserByPhone(phoneNumber, exceptId, select);
  // }

  // async userExistsByPhone(phoneNumber: string, exceptId: string | null = null) {
  //   return await this.appUserRepo.userExistsByPhone(phoneNumber, exceptId);
  // }

  // async getAllAppUsersWithOptions(select: string[]|null = null) {
  //   return await this.appUserRepo.getAllAppUsersWithOptions(select);
  // }

  // async getPaginatedAppUsersForCourseList(limit: number|string, offset: number|string, orderBy: string) {
  //   limit = Number(limit)
  //   offset = Number(offset)
  //   return await this.appUserRepo.getPaginatedAppUsersForCourseList(limit, offset, orderBy);
  // }

  async storeAppUser(data: TAppUserCreate, tx?: TTransaction) {
    return await this.appUserRepo.create( data, tx);
  }

  async updateAppUser(data: TAppUserUpdate, id: string, tx?: TTransaction) {
    return await this.appUserRepo.update(data, id, tx);
  }

  // async deleteAppUser(id: string, deletedBy: string, transaction?: Transaction) {
  //   return await this.appUserRepo.deleteAppUser(id, deletedBy, transaction);
  // }
}
