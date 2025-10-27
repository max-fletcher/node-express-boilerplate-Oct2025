import { Op, Transaction } from 'sequelize';
import { CourseModel, DayModel, FlashCardViewedModel, LessonModel } from '../models';
import { FlashCardViewed, UpdateFlashCardViewedData, StoreFlashCardViewed } from '../../../types/flash-card-viewed.type';
import { datetimeYMDHis } from '../../../utils/datetime.utils';
import { FlashCardModel } from '../models/flash-card.model';
export class FlashCardViewedRepository {
  constructor() {}
  async findFlashCardViewedById(id: string, select: string[]|null = null): Promise<FlashCardViewed> {
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

    return (await FlashCardViewedModel.findOne(options)) as unknown as FlashCardViewed;
  }

  async findFlashCardViewedByFlashCardIdAndAppUserId(flashCardId: string, appUserId: string, select: string[]|null = null): Promise<FlashCardViewed> {
    const options: any = {
      where: {
        flashCardId: flashCardId,
        appUserId: appUserId,
        deletedAt:{
          [Op.eq]: null
        } 
      },
    }

    if(select && select.length > 0)
      options.attributes = select

    return (await FlashCardViewedModel.findOne(options)) as unknown as FlashCardViewed;
  }

  async findFlashCardViewedByIds(ids: string[]): Promise<FlashCardViewed[]> {
    return (await FlashCardViewedModel.findAll({
      where: {
        id: {
          [Op.in]: ids,
          deletedAt:{
            [Op.eq]: null
          } 
        },
      },
    })) as unknown as FlashCardViewed[];
  }

  async flashCardViewedExistsById(id: string): Promise<number> {
    return await FlashCardViewedModel.count({
      where: {
        id: id,
        deletedAt:{
          [Op.eq]: null
        }
      },
    });
  }

  async getAllFlashCardViewed(): Promise<FlashCardViewed[]> {
    return (await FlashCardViewedModel.findAll({
      where: {
        deletedAt: {
          [Op.eq]: null
        }
      },
      order: [['createdAt', 'DESC']],
    })) as unknown as FlashCardViewed[];
  }

  async getAllFlashCardViewedCount(): Promise<number> {
    return await FlashCardViewedModel.count({
      where: {
        deletedAt: {
          [Op.eq]: null
        }
      },
    });
  }

  async getAllFlashCardViewedByAppUserCount(appUserId: string): Promise<number> {
    return await FlashCardViewedModel.count({
      where: {
        appUserId: appUserId,
        deletedAt: {
          [Op.eq]: null
        }
      },
    });
  }

  async getFlashCardViewedByAppUser(appUserId: string, afterDate?: string): Promise<FlashCardViewed> {
    let options: any = {
      where: {
        appUserId: appUserId,
        deletedAt: {
          [Op.eq]: null
        },
      },
      attributes: ['id', 'createdAt'],
    }

    if(afterDate)
      options.where = { ...options.where, createdAt: { [Op.gt]: afterDate } }

    return await FlashCardViewedModel.findAll(options) as unknown as FlashCardViewed;
  }

  async getFlashCardCountByAppUser(appUserId: string): Promise<number> {
    return await FlashCardViewedModel.findAll({
      where: {
        appUserId: appUserId,
        deletedAt: {
          [Op.eq]: null
        },
      },
    }) as unknown as number;
  }

  async storeFlashCardViewed(data: StoreFlashCardViewed, transaction?: Transaction): Promise<FlashCardViewed> {
    const options: any = {};

    if(transaction) options.transaction = transaction;

    return await FlashCardViewedModel.create(data, options) as unknown as FlashCardViewed;
  }

  async updateFlashCardViewed(data: UpdateFlashCardViewedData, id: string, transaction?: Transaction): Promise<FlashCardViewed> {
    const options: any = {
      where: {
        id: id,
      },
    };

    if(transaction) options.transaction = transaction;

    return (await FlashCardViewedModel.update(data, options)) as unknown as FlashCardViewed;
  }

  async deleteFlashCardViewed(id: string, deletedBy: string, transaction?: Transaction): Promise<FlashCardViewed> {
    const options: any = {
      where: {
        id: id,
      },
    };

    if(transaction) options.transaction = transaction;

    return await FlashCardViewedModel.update({ deletedAt: datetimeYMDHis(), deletedBy: deletedBy }, options) as unknown as FlashCardViewed;
  }

  async hardDeleteById(id: string, transaction?: Transaction): Promise<FlashCardViewed> {
    const options: any = {
      where: {
        id: id,
      },
    };

    if(transaction) options.transaction = transaction;

    return (await FlashCardViewedModel.destroy(options)) as unknown as FlashCardViewed;
  }

  async findFlashCardViewedByAppUserIdWithFlashCardLessonDayAndCourse(appUserId: string): Promise<FlashCardViewed> {
    const options: any = {
      where: {
        appUserId: appUserId,
        deletedAt:{
          [Op.eq]: null
        },
      },
      order: [['createdAt', 'DESC']],
      include: [
        {
          as: 'flash_card',
          model: FlashCardModel,
          where: {
            deletedAt: {
              [Op.eq]: null,
            },
          },
          attributes: ['id'],
          include: [
            {
              as: 'lesson',
              model: LessonModel,
              where: {
                deletedAt: {
                  [Op.eq]: null,
                },
              },
              attributes: ['id', 'title', 'description', 'estimatedMinutes'],
              include: [
                {
                  as: 'day',
                  model: DayModel,
                  where: {
                    deletedAt: {
                      [Op.eq]: null,
                    },
                  },
                  attributes: ['id'],
                  include: [
                    {
                      as: 'course',
                      model: CourseModel,
                      where: {
                        deletedAt: {
                          [Op.eq]: null,
                        },
                      },
                      attributes: ['id', 'title'],
                    },
                  ],
                },
                
              ],
            },
          ],
        },
      ],
    }

    return (await FlashCardViewedModel.findOne(options)) as unknown as FlashCardViewed;
  }
}
