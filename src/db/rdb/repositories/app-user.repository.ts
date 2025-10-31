import { and, eq, inArray, isNull, sql } from 'drizzle-orm';
import { TAppUser, TAppUserCreate, TAppUserUpdate, TAppUserWithoutPassword } from '../../../types/types/app-user.type';
import { hashPassword } from '../../../utils/password.utils';
import { appUsers } from '../db-schema';
import { db } from '../../clients/postgres.client';
import { TTransaction } from '../../../types/types/common.type';
import { selectColumns, excludeColumns } from '../../../utils/drizzle.utils';
import { IAppUserRepositoryInterface } from '../../../types/class-interfaces/app-user.interface';
import { datetimeYMDHis } from '../../../utils/datetime.utils';
export class AppUserRepository implements IAppUserRepositoryInterface {
  private selectData = {
    id: appUsers.id,
    name: appUsers.name,
    email: appUsers.email,
    createdAt: appUsers.createdAt,
    updatedAt: appUsers.updatedAt,
  };

  /**
   * Fetch all data from the "$users" table
   *
   * @async
   * @function getAll
   * @param {string[]|null} select Select the fields that you want.
   * @returns {Promise<Partial<TAppUser>[]|TAppUserWithoutPassword[]>} Responds with JSON containing the created $user and status message.
   */
  async getAll(select: (keyof typeof appUsers['_']['columns'])[] | null = null, includeGlobals?: boolean): Promise<Partial<TAppUser>[]|TAppUserWithoutPassword[]> {
    const selectShape = select ? selectColumns(appUsers, select, includeGlobals) : excludeColumns(appUsers, ['password'], includeGlobals);

    return await db.select(selectShape).from(appUsers)
                    .where(isNull(appUsers.deletedAt))
                    .orderBy(appUsers.createdAt)
  }

  /**
   * Find and fetch single data from the "$users" table
   *
   * @async
   * @function findById
   * @param {string} id - Id of the data being searched.
   * @param {string[]|null} select Select the fields that you want.
   * @returns {Promise<Partial<TAppUser>|TAppUserWithoutPassword|null>} Returns data from the repository. Throws an error if not found.
   */
  async findById(id: string, select: (keyof typeof appUsers['_']['columns'])[] | null = null, includeGlobals?: boolean): Promise<Partial<TAppUser>|TAppUserWithoutPassword|null> {
    const selectShape = select ? selectColumns(appUsers, select, includeGlobals) : excludeColumns(appUsers, ['password'], includeGlobals);

    const user = await db.select(selectShape).from(appUsers)
                    .where(and(eq(appUsers.id, id), isNull(appUsers.deletedAt)))
                    .limit(1);

    return user[0] ?? null;
  }

  /**
   * Check if data exists in the "$users" table by id
   *
   * @async
   * @function existsById
   * @param {string} id - Id of the data being searched.
   * @returns {Promise<boolean>} Returns data from the repository. Throws an error if not found.
   */
  async existsById(id: string, hardDeleted: boolean = false): Promise<boolean> {
    let result
    if(hardDeleted){
      result = await db
                .select({ count: sql<number>`count(*)` })
                .from(appUsers)
                .where(eq(appUsers.id, id));
    }
    else{
      result = await db
                .select({ count: sql<number>`count(*)` })
                .from(appUsers)
                .where(and(eq(appUsers.id, id), isNull(appUsers.deletedAt)));
    }

    return Number(result[0]?.count ?? 0) > 0;
  }

  /**
   * Find and fetch data matching the ids provided from the "$users" table
   *
   * @async
   * @function findByIds
   * @param {string[]} ids - Ids of the data being searched.
   * @param {string[]|null} select Select the fields that you want.
   * @returns {Promise<Partial<TAppUser>[]|TAppUserWithoutPassword[]>} Returns data from the repository.
   */
  async findByIds(ids: string[], select: (keyof typeof appUsers['_']['columns'])[] | null = null, includeGlobals?: boolean): Promise<Partial<TAppUser>[]|TAppUserWithoutPassword[]> {
    const selectShape = select ? selectColumns(appUsers, select, includeGlobals) : excludeColumns(appUsers, ['password'], includeGlobals);

    const appUsersData = await db.select(selectShape).from(appUsers)
                        .where(and(isNull(appUsers.deletedAt), inArray(appUsers.id, ids)));

    return appUsersData
  }

  // async findUserByEmail(email: string, exceptId: string | null = null): Promise<AppUser> {
  //   const options: any = {
  //     where: {
  //       email: email,
  //       deletedAt:{
  //         [Op.eq]: null
  //       }
  //     },
  //   };

  //   if (exceptId) options.where.id = { [Op.ne]: exceptId };

  //   return (await AppUserModel.findOne(options)) as unknown as AppUser;
  // }

  // async userExistsByEmail(email: string, exceptId: string | null = null): Promise<AppUser> {
  //   const options: any = {
  //     where: {
  //       email: email,
  //       deletedAt:{
  //         [Op.eq]: null
  //       }
  //     },
  //   };
  //   if (exceptId) options.where.id = { [Op.ne]: exceptId };

  //   return (await AppUserModel.count(options)) as unknown as AppUser;
  // }

  // async findUserByPhone(phoneNumber: string, exceptId: string | null = null, select: string[]|null = null): Promise<AppUser> {
  //   const options: any = {
  //     where: {
  //       phoneNumber: phoneNumber,
  //       deletedAt:{
  //         [Op.eq]: null
  //       }
  //     },
  //   };
  //   if (exceptId) options.where.id = { [Op.ne]: exceptId };

  //   if(select && select.length > 0)
  //     options.attributes = select

  //   return (await AppUserModel.findOne(options)) as unknown as AppUser;
  // }

  // async userExistsByPhone(phoneNumber: string, exceptId: string | null = null) {
  //   const options: any = {
  //     where: {
  //       phoneNumber: phoneNumber,
  //       deletedAt:{
  //         [Op.eq]: null
  //       }
  //     },
  //   };
  //   if (exceptId) options.where.id = { [Op.ne]: exceptId };

  //   return (await AppUserModel.count(options));
  // }

  // async getPaginatedAppUsers(page: number = 1, limit: number = 10, sortOrder: string, sortBy: string, searchText?: string|null): Promise<PaginationResult<AppUserModel>> {
  //   const options: any = {
  //     where: {
  //       deletedAt: {
  //         [Op.eq]: null
  //       }
  //     },
  //     order: [[sortBy, sortOrder]]
  //   }

  //   if(searchText){
  //     options.where = {
  //       ...options.where, 
  //       [Op.or]: {
  //         phoneNumber: {
  //           [Op.iLike]: `%${searchText}%` 
  //         },
  //         firstName: {
  //           [Op.iLike]: `%${searchText}%` 
  //         },
  //         lastName: {
  //           [Op.iLike]: `%${searchText}%` 
  //         },
  //         email: {
  //           [Op.iLike]: `%${searchText}%` 
  //         },
  //       }
  //     }
  //   }

  //   return await paginatedResults(AppUserModel, options, page, limit) as PaginationResult<AppUserModel>; // use your actual pagination logic
  // }

  /**
   * Creates a new $user in the database.
   *
   * @async
   * @function create
   * @param {data} TAppUserCreate Data that is used to create a $user
   * @param {TTransaction} [tx]  - DB transaction object. Used for DB commit & rollback.
   * @returns {Promise<TAppUserWithoutPassword>} Returns data after the query executes.
   */
  async create(data: TAppUserCreate, tx?: TTransaction): Promise<TAppUserWithoutPassword> {
    const executor = tx ?? db
    const [newUser] = await executor.insert(appUsers).values({
                          name: data.name,
                          email: data.email,
                          password: await hashPassword(data.password),
                        })
                        .returning(this.selectData);

    return newUser
  }

  /**
   * Update data matching the provided id from the "$users" table.
   *
   * @async
   * @function update
   * @param {data} TAppUserUpdate Data that is used to update a $user
   * @param {string} id - Id of the data being updated.
   * @param {TTransaction} [tx]  - DB transaction object. Used for DB commit & rollback.
   * @returns {Promise<TAppUserWithoutPassword>} Returns data after the query executes.
   */
  async update(data: TAppUserUpdate, id: string, tx?: TTransaction): Promise<TAppUserWithoutPassword> {
    const executor = tx ?? db
    let updateData: TAppUserUpdate = {...data, updatedAt: new Date() }

    if(data.password)
      updateData = {...updateData, password: await hashPassword(data.password)}

    const [updatedUser] = await executor
                            .update(appUsers)
                            .set(updateData)
                            .where(eq(appUsers.id, id))
                            .returning(this.selectData);

    return updatedUser
  }

  /**
   * Soft delete data matching the provided id from the "$users" table.
   *
   * @async
   * @function deleteById
   * @param {string} id - Id of the data being soft deleted.
   * @param {string} deletedBy - Id of the admin who is deleting the data.
   * @param {TTransaction} [tx]  - DB transaction object. Used for DB commit & rollback.
   * @returns {Promise<TAppUserWithoutPassword>} Returns data after the query executes.
   */
  async deleteById(id: string, deletedBy: string, tx?: TTransaction): Promise<TAppUserWithoutPassword> {
    const executor = tx ?? db
    const softDeleteDataObj = { deletedAt: new Date(), deletedBy }

    const [deletedUser] = await executor
                            .update(appUsers)
                            .set(softDeleteDataObj)
                            .where(eq(appUsers.id, id))
                            .returning(this.selectData);

    return deletedUser
  }

  /**
   * Hard delete data matching the provided id from the "$users" table.
   *
   * @async
   * @function hardDeleteById
   * @param {string} id - Id of the data being hard deleted.
   * @param {TTransaction} [tx]  - DB transaction object. Used for DB commit & rollback.
   * @returns {Promise<TAppUserWithoutPassword>} Returns data after the query executes.
   */
  async hardDeleteById(id: string, tx?: TTransaction): Promise<TAppUserWithoutPassword> {
    const executor = tx ?? db

    const [deletedUser] = await executor.delete(appUsers).where(eq(appUsers.id, id)).returning(this.selectData);

    return deletedUser
  }
}
