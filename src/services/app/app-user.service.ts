import { AppUserRepository } from '../../db/rdb/repositories/app-user.repository';
import { appUsers } from '../../db/rdb/db-schema';
import { NotFoundException } from '../../errors/NotFoundException.error';
import { IAppUserServiceInterface } from '../../types/class-interfaces/app-user.interface';
import { TAppUserCreate, TAppUserUpdate,  } from '../../types/types/app-user.type';
import { TTransaction } from '../../types/types/common.type';
import { removeDuplicatesFromArray } from '../../utils/common.utils';

export class AppUserService implements IAppUserServiceInterface {
  private appUserRepo: AppUserRepository;

  constructor() {
    this.appUserRepo = new AppUserRepository();
  }

  /**
   * Fetch all data from the "$users" table
   *
   * @async
   * @function getAllAppUsers
   * @param {string[]} [select=null] select Select the fields that you want.
   * @param {boolean} [includeGlobals] - Override returning fields that are normally hidden i.e "deletedAt".
   * @returns {Promise<void>} Returns data from the repository
   */
  async getAll(select: (keyof typeof appUsers['_']['columns'])[] | null = null, includeGlobals?: boolean) {
    return await this.appUserRepo.getAll(select, includeGlobals);
  }

  /**
   * Find and fetch single data from the "$users" table
   *
   * @async
   * @function findById
   * @param {string} id - Id of the data being searched.
   * @param {string[]} [select=null] select Select the fields that you want.
   * @param {boolean} [includeGlobals] - Override returning fields that are normally hidden i.e "deletedAt".
   * @returns {Promise<void>} Returns data from the repository. Throws an error if not found.
   */
  async findById(id: string, select: (keyof typeof appUsers['_']['columns'])[] | null = null, includeGlobals?: boolean) {
    const user = await this.appUserRepo.findById(id, select, includeGlobals);

    if(!user)
      throw new NotFoundException('User not found.')

    return user
  }

  /**
   * Check if data exists in the "$users" table by id
   *
   * @async
   * @function existsById
   * @param {string} id - Id of the data being searched.
   * @returns {Promise<void>} Returns data from the repository. Throws an error if not found.
   */
  async existsById(id: string) {
    const exists = await this.appUserRepo.existsById(id);

    if(!exists)
      throw new NotFoundException('User not found.')

    return exists
  }

  /**
   * Find and fetch data matching the ids provided from the "$users" table
   *
   * @async
   * @function findByIds
   * @param {string[]} ids - Ids of the data being searched.
   * @param {string[]} [select=null] select Select the fields that you want.
   * @param {boolean} [includeGlobals] - Override returning fields that are normally hidden i.e "deletedAt".
   * @returns {Promise<void>} Returns data from the repository.
   */
  async findByIds(ids: string[], select: (keyof typeof appUsers['_']['columns'])[] | null = null, includeGlobals?: boolean) {
    ids = removeDuplicatesFromArray(ids)

    const users = await this.appUserRepo.findByIds(ids, select, includeGlobals);

    return users
  }

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

  /**
   * Creates a new $user in the database.
   *
   * @async
   * @function create
   * @param {TAppUserCreate} data - Data(usually validated) that is being stored in DB.
   * @param {TTransaction} [tx]  - DB transaction object. Used for DB commit & rollback.
   * @returns {Promise<void>} Returns data from the repository. Throws an error if something goes wrong.
   */
  async create(data: TAppUserCreate, tx?: TTransaction) {
    return await this.appUserRepo.create( data, tx);
  }

  /**
   * Update data matching the provided id from the "$users" table.
   *
   * @async
   * @function update
   * @param {TAppUserUpdate} data - Data(usually validated) that is being stored in DB.
   * @param {string} id - Id of the data being updated.
   * @param {TTransaction} [tx]  - DB transaction object. Used for DB commit & rollback.
   * @returns {Promise<void>} Returns data from the repository. Throws an error if something goes wrong.
   */
  async update(data: TAppUserUpdate, id: string, tx?: TTransaction) {
    const exists = await this.existsById(id)
    if(!exists)
      throw new NotFoundException('User not found');

    return await this.appUserRepo.update(data, id, tx);
  }

  /**
   * Soft delete data matching the provided id from the "$users" table.
   *
   * @async
   * @function deleteById
   * @param {string} id - Id of the data being soft deleted.
   * @param {string} deletedBy - Id of the admin who is deleting the data.
   * @param {TTransaction} [tx]  - DB transaction object. Used for DB commit & rollback.
   * @returns {Promise<void>} Returns data from the repository. Throws an error if something goes wrong.
   */
  async deleteById(id: string, deletedBy: string, tx?: TTransaction) {
    const exists = await this.existsById(id)
        if(!exists)
          throw new NotFoundException('User not found');

    return await this.appUserRepo.deleteById(id, deletedBy, tx);
  }

  /**
   * Hard delete data matching the provided id from the "$users" table.
   *
   * @async
   * @function hardDeleteById
   * @param {TAppUserUpdate} data - Data that is being stored in DB.
   * @param {TTransaction} [tx]  - DB transaction object. Used for DB commit & rollback.
   * @returns {Promise<void>} Returns data from the repository. Throws an error if something goes wrong.
   */
  async hardDeleteById(id: string, tx?: TTransaction) {
    const user = await this.appUserRepo.existsById(id, true);
    if(!user)
      throw new NotFoundException('User not found.')

    return await this.appUserRepo.hardDeleteById(id, tx);
  }
}
