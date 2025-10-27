import { Op, Transaction } from 'sequelize';
import { DayModel, LessonModel } from '../models';
import { Day, UpdateDayData, StoreDay } from '../../../types/day.type';
import { datetimeYMDHis } from '../../../utils/datetime.utils';
import { paginatedResults } from '../../../utils/common.utils';
import { PaginationResult } from '../../../types/common.type';
export class DayRepository {
  constructor() {}
  async findDayById(id: string, select: string[]|null = null, withRelations: boolean = false): Promise<Day> {
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

    if(withRelations){
      options.include = [
        {
          as: 'lessons',
          model: LessonModel,
          required: false,
          where: {
            deletedAt: {
              [Op.eq]: null
            }
          }
        },
      ];
    }

    return (await DayModel.findOne(options)) as unknown as Day;
  }

  async findDayByIds(ids: string[]): Promise<Day[]> {
    return (await DayModel.findAll({
      where: {
        id: {
          [Op.in]: ids,
          deletedAt:{
            [Op.eq]: null
          } 
        },
      },
    })) as unknown as Day[];
  }

  async dayExistsById(id: string): Promise<number> {
    return await DayModel.count({
      where: {
        id: id,
        deletedAt:{
          [Op.eq]: null
        }
      },
    });
  }

  async getPaginatedDays(page: number = 1, limit: number = 10, sortOrder: string, sortBy: string, searchText?: string|null): Promise<PaginationResult<DayModel>> {
    const options: any = {
      where: {
        deletedAt: {
          [Op.eq]: null
        }
      },
      order: [[sortBy, sortOrder]]
    }

    if(searchText)
      options.where = {...options.where, title: { [Op.iLike]: `%${searchText}%` }}

    return await paginatedResults(DayModel, options, page, limit) as PaginationResult<DayModel>; // use your actual pagination logic
  }

  async getAllDays(): Promise<Day[]> {
    return (await DayModel.findAll({
      where: {
        deletedAt: {
          [Op.eq]: null
        }
      },
      order: [['createdAt', 'DESC']],
    })) as unknown as Day[];
  }

  async getAllDaysCount(): Promise<number> {
    return await DayModel.count({
      where: {
        deletedAt: {
          [Op.eq]: null
        }
      },
    });
  }

  async getAllAssociatedDaysCount(courseId: string): Promise<number> {
    return await DayModel.count({
      where: {
        courseId: courseId,
        deletedAt: {
          [Op.eq]: null
        }
      },
    });
  }

  async storeDay(data: StoreDay, transaction?: Transaction): Promise<Day> {
    const options: any = {};

    if(transaction) options.transaction = transaction;

    return await DayModel.create(data, options) as unknown as Day;
  }

  async updateDay(data: UpdateDayData, id: string, transaction?: Transaction): Promise<Day> {
    const options: any = {
      where: {
        id: id,
      },
    };

    if(transaction) options.transaction = transaction;

    return (await DayModel.update(data, options)) as unknown as Day;
  }

  async deleteDay(id: string, deletedBy: string, transaction?: Transaction): Promise<Day> {
    const options: any = {
      where: {
        id: id,
      },
    };

    if(transaction) options.transaction = transaction;

    return await DayModel.update({ deletedAt: datetimeYMDHis(), deletedBy: deletedBy }, options) as unknown as Day;
  }

  async hardDeleteById(id: string, transaction?: Transaction): Promise<Day> {
    const options: any = {
      where: {
        id: id,
      },
    };

    if(transaction) options.transaction = transaction;

    return (await DayModel.destroy(options)) as unknown as Day;
  }

  async getAllDaysWithOptions(select: string[]|null = null): Promise<Day[]> {
    const options: any = {};

    if(select && select.length > 0)
      options.attributes = select

    return (await DayModel.findAll(options));
  }

  async courseWithDayExists(courseId: string, dayNumber: number): Promise<number> {
    return await DayModel.count({
      where: {
        courseId: courseId,
        dayNumber: dayNumber,
        deletedAt:{
          [Op.eq]: null
        }
      },
    });
  }

  async daysGreaterThanNewTotalDaysCount(courseId: string, totalDays: number): Promise<number> {
    return await DayModel.count({
      where: {
        courseId: courseId,
        dayNumber: {
          [Op.gt] : totalDays
        },
        deletedAt:{
          [Op.eq]: null
        }
      },
    });
  }
}
