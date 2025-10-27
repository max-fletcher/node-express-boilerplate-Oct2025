import { Op, Transaction } from 'sequelize';
import { AppUserCourseModel } from '../models';
import { datetimeYMDHis } from '../../../utils/datetime.utils';
import { AppUserCourse, StoreAppUserCourse, UpdateAppUserCourseData } from '../../../types/app-user-course.type';
export class UserCourseRepository {
  constructor() {}
  async findUserCourseById(id: string, select: string[]|null = null): Promise<AppUserCourse> {
    const options: any = {
      where: {
        id: id,
        deletedAt:{
          [Op.eq]: null
        } 
      },
    }

    if(select && select.length > 0)
      options.attributes = select

    return (await AppUserCourseModel.findOne(options)) as unknown as AppUserCourse;
  }

  async findUserCourseByIds(ids: string[]): Promise<AppUserCourse[]> {
    return (await AppUserCourseModel.findAll({
      where: {
        id: {
          [Op.in]: ids,
          deletedAt:{
            [Op.eq]: null
          } 
        },
      },
    })) as unknown as AppUserCourse[];
  }

  async userCourseExistsById(id: string): Promise<number> {
    return await AppUserCourseModel.count({
      where: {
        id: id,
        deletedAt:{
          [Op.eq]: null
        }
      },
    });
  }

  async getAllUserCourses(): Promise<AppUserCourse[]> {
    return (await AppUserCourseModel.findAll({
      where: {
        deletedAt: {
          [Op.eq]: null
        }
      },
      order: [['createdAt', 'DESC']],
    })) as unknown as AppUserCourse[];
  }

  async storeUserCourse(data: StoreAppUserCourse, transaction?: Transaction): Promise<AppUserCourse> {
    const options: any = {};

    if(transaction) options.transaction = transaction;

    return await AppUserCourseModel.create(data, options) as unknown as AppUserCourse;
  }

  async updateUserCourse(data: UpdateAppUserCourseData, id: string, transaction?: Transaction): Promise<AppUserCourse> {
    const options: any = {
      where: {
        id: id,
      },
    };

    if(transaction) options.transaction = transaction;

    return (await AppUserCourseModel.update(data, options)) as unknown as AppUserCourse;
  }

  async deleteUserCourse(id: string, deletedBy: string, transaction?: Transaction): Promise<AppUserCourse> {
    const options: any = {
      where: {
        id: id,
      },
    };

    if(transaction) options.transaction = transaction;

    return await AppUserCourseModel.update({ deletedAt: datetimeYMDHis(), deletedBy: deletedBy }, options) as unknown as AppUserCourse;
  }

  async hardDeleteById(id: string, transaction?: Transaction): Promise<AppUserCourse> {
    const options: any = {
      where: {
        id: id,
      },
    };

    if(transaction) options.transaction = transaction;

    return (await AppUserCourseModel.destroy(options)) as unknown as AppUserCourse;
  }

  async getAllUserCoursesWithOptions(select: string[]|null = null): Promise<AppUserCourse[]> {
    const options: any = {};

    if(select && select.length > 0)
      options.attributes = select

    return (await AppUserCourseModel.findAll(options));
  }

  async findUserCourseByAppUserIdAndCourseId(userId: string, courseId: string, select: string[]|null = null): Promise<AppUserCourse> {
    const options: any = {
      where: {
        userId: userId,
        courseId: courseId,
        deletedAt:{
          [Op.eq]: null
        } 
      },
    }

    if(select && select.length > 0)
      options.attributes = select

    return (await AppUserCourseModel.findOne(options)) as unknown as AppUserCourse;
  }

  async userCourseExistsByAppUserIdAndCourseId(appUserId: string, courseId: string): Promise<number> {
    return await AppUserCourseModel.count({
      where: {
        appUserId: appUserId,
        courseId: courseId,
        deletedAt:{
          [Op.eq]: null
        } 
      },
    });
  }
}
