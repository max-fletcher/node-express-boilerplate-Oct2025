import { eq, inArray, sql } from 'drizzle-orm';
import { TAppUser, TAppUserCreate, TAppUserUpdate, TAppUserWithoutPassword } from '../../../types/types/app-user.type';
import { hashPassword } from '../../../utils/password.utils';
// import { datetimeYMDHis } from '../../../utils/datetime.utils';
import { users } from '../schema';
import { db } from '../../clients/postgres.client';
import { ICommonRepository } from '../../../types/class-interfaces/common.interfact';
import { TTransaction } from '../../../types/types/common.type';
import { selectColumns, excludeColumns } from '../../../utils/drizzle.utils';
// import { paginatedResults } from '../../../utils/common.utils';
// import { PaginationResult } from '../../../types/common.type';
export class AppUserRepository implements ICommonRepository<TAppUser, TAppUserCreate, TAppUserUpdate, TAppUserWithoutPassword> {
  async getAll(): Promise<TAppUserWithoutPassword[]> {
    return await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users).orderBy(users.createdAt)
  }

  async findById(id: string, select: (keyof typeof users['_']['columns'])[] | null = null): Promise<Partial<TAppUser>|TAppUserWithoutPassword|null> {
    const selectShape = select ? selectColumns(users, select) : excludeColumns(users, ['password']);

    const user = await db
                  .select(selectShape)
                  .from(users)
                  .where(eq(users.id, id))
                  .limit(1);

    return user[0] ?? null;
  }

  async findByIds(ids: string[], select: (keyof typeof users['_']['columns'])[] | null = null): Promise<Partial<TAppUser>[]|TAppUserWithoutPassword[]> {
    const selectShape = select ? selectColumns(users, select) : excludeColumns(users, ['password']);

    const usersData = await db
                      .select(selectShape)
                      .from(users)
                      .where(inArray(users.id, ids));

    return usersData
  }

  // async userExistsById(id: string): Promise<number> {
  //   return await AppUserModel.count({
  //     where: {
  //       id: id,
  //       deletedAt:{
  //         [Op.eq]: null
  //       }
  //     },
  //   });
  // }

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

  // async nullifyUserOtp(id: string): Promise<AppUser> {
  //   return (await AppUserModel.update(
  //     {
  //       otp: null,
  //       otp_expires_at: null,
  //     },
  //     {
  //       where: {
  //         id: id,
  //       },
  //     },
  //   )) as unknown as AppUser;
  // }

  // async setOtp(id: string, otp: string): Promise<AppUser> {
  //   const otp_validity = Number(getEnvVar('OTP_EXPIRY'));
  //   return (await AppUserModel.update(
  //     {
  //       // otp: otp,
  //       otp_expires_at: datetimeYMDHis(null, 'mins', otp_validity),
  //     },
  //     {
  //       where: {
  //         id: id,
  //       },
  //     },
  //   )) as unknown as AppUser;
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

  async create(data: TAppUserCreate, tx?: TTransaction): Promise<TAppUserWithoutPassword> {
    let newUser
    const selectData = {
                        id: users.id,
                        name: users.name,
                        email: users.email,
                        createdAt: users.createdAt,
                        updatedAt: users.updatedAt,
                      }

    if(tx){
      [newUser] = await tx.insert(users).values({
                        name: data.name,
                        email: data.email,
                        password: await hashPassword(data.password),
                      })
                      .returning(selectData);
    }
    else{
      [newUser] = await db.insert(users).values({
                        name: data.name,
                        email: data.email,
                        password: await hashPassword(data.password),
                      })
                      .returning(selectData);

    }

    return newUser
  }

  async update(data: TAppUserUpdate, id: string, tx?: TTransaction): Promise<TAppUserWithoutPassword> {
    let updatedUser
    let updateData = {...data, updatedAt: sql`now()`}
    const selectData = {
                        id: users.id,
                        name: users.name,
                        email: users.email,
                        createdAt: users.createdAt,
                        updatedAt: users.updatedAt,
                      }

    if(data.password)
      updateData = {...updateData, password: await hashPassword(data.password)}

    if(tx){
      [updatedUser] = await tx
                      .update(users)
                      .set(updateData)
                      .where(eq(users.id, id))
                      .returning(selectData);
    }
    else{
      [updatedUser] = await db
                            .update(users)
                            .set(updateData)
                            .where(eq(users.id, id))
                            .returning(selectData);
    }

    return updatedUser
  }

  // async deleteAppUser(id: string, deletedBy: string, transaction?: Transaction): Promise<AppUser> {
  //   const options: any = {
  //     where: {
  //       id: id,
  //     },
  //   };

  //   if(transaction) options.transaction = transaction;

  //   return await AppUserModel.update({ deletedAt: datetimeYMDHis(), deletedBy: deletedBy }, options) as unknown as AppUser;
  // }

  // async hardDeleteById(id: string, transaction?: Transaction): Promise<AppUser> {
  //   const options: any = {
  //     where: {
  //       id: id,
  //     },
  //   };

  //   if(transaction) options.transaction = transaction;

  //   return (await AppUserModel.destroy(options)) as unknown as AppUser;
  // }

  // async getAllAppUsersWithOptions(select: string[]|null = null): Promise<AppUser[]> {
  //   const options: any = {};

  //   if(select && select.length > 0)
  //     options.attributes = select

  //   return (await AppUserModel.findAll(options));
  // }

  // async getPaginatedAppUsersForCourseList(limit: number, offset: number, orderBy: string): Promise<AppUser[]> {
  //   const options: any = {
  //     limit: limit,
  //     offset: offset,
  //     orderBy: orderBy,
  //   };

  //   return await AppUserModel.findAll(options);
  // }
}
