import { Op, Transaction } from 'sequelize';
import { AppUserCourseModel, AppUserModel, CourseModel, LanguageModel } from '../models';
import {
  AppUser,
  UpdateAppUserData,
  StoreAppUser,
  AdminViewSingleAppUserWithAppUserCoursesWithCourse,
} from '../../../types/app-user.type';
import { datetimeYMDHis } from '../../../utils/datetime.utils';
import { paginatedResults } from '../../../utils/common.utils';
import { PaginationResult } from '../../../types/common.type';
export class AppUserRepository {
  constructor() {}
  async createUser(user: StoreAppUser, transaction?: Transaction): Promise<AppUser> {
      const createdUser = await AppUserModel.create(user, {
        transaction: transaction,
      });
      return createdUser;
  }

  async findUserById(id: string, select: string[]|null = null, withEnrolledCourses: boolean = false): Promise<AppUser|AdminViewSingleAppUserWithAppUserCoursesWithCourse> {
    const options: any = {
      where: {
        id: id,
        deletedAt:{
          [Op.eq]: null
        } 
      },
    }

    if(withEnrolledCourses)
      options.include = [
        {
          as: 'user_courses',
          model: AppUserCourseModel,
          required: false,
          where: {
            deletedAt: {
              [Op.eq]: null
            }
          },
          attributes: ['id', 'appUserId', 'courseId'],
          include: [
            {
              as: 'course',
              model: CourseModel,
              where: {
                deletedAt: {
                  [Op.eq]: null
                }
              },
              attributes: ['id','title'],
              include: [
                {
                  as: 'language',
                  model: LanguageModel,
                  where: {
                    deletedAt: {
                      [Op.eq]: null
                    }
                  },
                  attributes: ['id','name']
                },
                {
                  as: 'target_language',
                  model: LanguageModel,
                  where: {
                    deletedAt: {
                      [Op.eq]: null,
                    },
                  },
                  attributes: ['id', 'name']
                },
              ]
            },
          ]
        },
      ]

    if(select && select.length > 0)
      options.attributes = select

    return (await AppUserModel.findOne(options)) as unknown as AppUser|AdminViewSingleAppUserWithAppUserCoursesWithCourse;
  }

  async findUserByIds(ids: string[]): Promise<AppUser[]> {
    return (await AppUserModel.findAll({
      where: {
        id: {
          [Op.in]: ids,
          deletedAt:{
            [Op.eq]: null
          } 
        },
      },
    })) as unknown as AppUser[];
  }

  async userExistsById(id: string): Promise<number> {
    return await AppUserModel.count({
      where: {
        id: id,
        deletedAt:{
          [Op.eq]: null
        }
      },
    });
  }

  async findUserByEmail(email: string, exceptId: string | null = null): Promise<AppUser> {
    const options: any = {
      where: {
        email: email,
        deletedAt:{
          [Op.eq]: null
        }
      },
    };

    if (exceptId) options.where.id = { [Op.ne]: exceptId };

    return (await AppUserModel.findOne(options)) as unknown as AppUser;
  }

  async userExistsByEmail(email: string, exceptId: string | null = null): Promise<AppUser> {
    const options: any = {
      where: {
        email: email,
        deletedAt:{
          [Op.eq]: null
        }
      },
    };
    if (exceptId) options.where.id = { [Op.ne]: exceptId };

    return (await AppUserModel.count(options)) as unknown as AppUser;
  }

  async findUserByPhone(phoneNumber: string, exceptId: string | null = null, select: string[]|null = null): Promise<AppUser> {
    const options: any = {
      where: {
        phoneNumber: phoneNumber,
        deletedAt:{
          [Op.eq]: null
        }
      },
    };
    if (exceptId) options.where.id = { [Op.ne]: exceptId };

    if(select && select.length > 0)
      options.attributes = select

    return (await AppUserModel.findOne(options)) as unknown as AppUser;
  }

  async userExistsByPhone(phoneNumber: string, exceptId: string | null = null) {
    const options: any = {
      where: {
        phoneNumber: phoneNumber,
        deletedAt:{
          [Op.eq]: null
        }
      },
    };
    if (exceptId) options.where.id = { [Op.ne]: exceptId };

    return (await AppUserModel.count(options));
  }

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

    async getPaginatedAppUsers(page: number = 1, limit: number = 10, sortOrder: string, sortBy: string, searchText?: string|null): Promise<PaginationResult<AppUserModel>> {
      const options: any = {
        where: {
          deletedAt: {
            [Op.eq]: null
          }
        },
        order: [[sortBy, sortOrder]]
      }

      if(searchText){
        options.where = {
          ...options.where, 
          [Op.or]: {
            phoneNumber: {
              [Op.iLike]: `%${searchText}%` 
            },
            firstName: {
              [Op.iLike]: `%${searchText}%` 
            },
            lastName: {
              [Op.iLike]: `%${searchText}%` 
            },
            email: {
              [Op.iLike]: `%${searchText}%` 
            },
          }
        }
      }

      return await paginatedResults(AppUserModel, options, page, limit) as PaginationResult<AppUserModel>; // use your actual pagination logic
    }

  async getAllAppUsers(): Promise<AppUser[]> {
    return (await AppUserModel.findAll({
      where: {
        deletedAt: {
          [Op.eq]: null
        }
      },
      order: [['createdAt', 'DESC']],
    })) as unknown as AppUser[];
  }

  async storeAppUser(data: StoreAppUser, transaction?: Transaction): Promise<AppUser> {
    const options: any = {};

    if(transaction) options.transaction = transaction;

    return await AppUserModel.create(data, options) as unknown as AppUser;
  }

  async updateAppUser(data: UpdateAppUserData, id: string, transaction?: Transaction): Promise<AppUser> {
    const options: any = {
      where: {
        id: id,
      },
    };

    if(transaction) options.transaction = transaction;

    return (await AppUserModel.update(data, options)) as unknown as AppUser;
  }

  async deleteAppUser(id: string, deletedBy: string, transaction?: Transaction): Promise<AppUser> {
    const options: any = {
      where: {
        id: id,
      },
    };

    if(transaction) options.transaction = transaction;

    return await AppUserModel.update({ deletedAt: datetimeYMDHis(), deletedBy: deletedBy }, options) as unknown as AppUser;
  }

  async hardDeleteById(id: string, transaction?: Transaction): Promise<AppUser> {
    const options: any = {
      where: {
        id: id,
      },
    };

    if(transaction) options.transaction = transaction;

    return (await AppUserModel.destroy(options)) as unknown as AppUser;
  }

  async getAllAppUsersWithOptions(select: string[]|null = null): Promise<AppUser[]> {
    const options: any = {};

    if(select && select.length > 0)
      options.attributes = select

    return (await AppUserModel.findAll(options));
  }

  async getPaginatedAppUsersForCourseList(limit: number, offset: number, orderBy: string): Promise<AppUser[]> {
    const options: any = {
      limit: limit,
      offset: offset,
      orderBy: orderBy,
    };

    return await AppUserModel.findAll(options);
  }
}
