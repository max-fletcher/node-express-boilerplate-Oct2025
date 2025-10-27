import { Op, Transaction } from 'sequelize';
import { AppUserCourseModel, CourseModel, DayModel, FlashCardViewedModel, LessonModel } from '../models';
import { Lesson, UpdateLessonData, StoreLesson, LessonWithFlashCards } from '../../../types/lesson.type';
import { datetimeYMDHis } from '../../../utils/datetime.utils';
import { FlashCardModel } from '../models/flash-card.model';
import { NotFoundException } from '../../../errors/NotFoundException.error';
import { PaginationResult } from '../../../types/common.type';
import { paginatedResults } from '../../../utils/common.utils';
export class LessonRepository {
  constructor() {}
  async findLessonById(id: string, select: string[]|null = null, withRelations: boolean = false): Promise<Lesson> {
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
          as: 'flash_cards',
          model: FlashCardModel,
          required: false,
          where: {
            deletedAt: {
              [Op.eq]: null
            }
          }
        },
      ];
    }

    return (await LessonModel.findOne(options)) as unknown as Lesson;
  }

  async findLessonByIds(ids: string[]): Promise<Lesson[]> {
    return (await LessonModel.findAll({
      where: {
        id: {
          [Op.in]: ids,
          deletedAt:{
            [Op.eq]: null
          } 
        },
      },
    })) as unknown as Lesson[];
  }

  async lessonExistsById(id: string): Promise<number> {
    return await LessonModel.count({
      where: {
        id: id,
        deletedAt:{
          [Op.eq]: null
        }
      },
    });
  }

  async getPaginatedLessons(page: number = 1, limit: number = 10, sortOrder: string, sortBy: string, searchText?: string|null): Promise<PaginationResult<LessonModel>> {
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

    return await paginatedResults(LessonModel, options, page, limit) as PaginationResult<LessonModel>; // use your actual pagination logic
  }

  async getAllLessons(): Promise<Lesson[]> {
    return (await LessonModel.findAll({
      where: {
        deletedAt: {
          [Op.eq]: null
        }
      },
      order: [['createdAt', 'DESC']],
    })) as unknown as Lesson[];
  }

  async getAllLessonsCount(): Promise<number> {
    return await LessonModel.count({
      where: {
        deletedAt: {
          [Op.eq]: null
        }
      },
    });
  }

  async getAllAssociatedLessonsCount(dayId: string): Promise<number> {
    return await LessonModel.count({
      where: {
        dayId: dayId,
        deletedAt: {
          [Op.eq]: null
        }
      },
    });
  }

  async storeLesson(data: StoreLesson, transaction?: Transaction): Promise<Lesson> {
    const options: any = {};

    if(transaction) options.transaction = transaction;

    return await LessonModel.create(data, options) as unknown as Lesson;
  }

  async updateLesson(data: UpdateLessonData, id: string, transaction?: Transaction): Promise<Lesson> {
    const options: any = {
      where: {
        id: id,
      },
    };

    if(transaction) options.transaction = transaction;

    return (await LessonModel.update(data, options)) as unknown as Lesson;
  }

  async deleteLesson(id: string, deletedBy: string, transaction?: Transaction): Promise<Lesson> {
    const options: any = {
      where: {
        id: id,
      },
    };

    if(transaction) options.transaction = transaction;

    return await LessonModel.update({ deletedAt: datetimeYMDHis(), deletedBy: deletedBy }, options) as unknown as Lesson;
  }

  async hardDeleteById(id: string, transaction?: Transaction): Promise<Lesson> {
    const options: any = {
      where: {
        id: id,
      },
    };

    if(transaction) options.transaction = transaction;

    return (await LessonModel.destroy(options)) as unknown as Lesson;
  }

  async getAllLessonsWithOptions(select: string[]|null = null): Promise<Lesson[]> {
    const options: any = {};

    if(select && select.length > 0)
      options.attributes = select

    return (await LessonModel.findAll(options));
  }

  async dayWithLessonOrderExists(dayId: string, lessonOrder : number): Promise<number> {
    return await LessonModel.count({
      where: {
        dayId: dayId,
        lessonOrder: lessonOrder,
        deletedAt:{
          [Op.eq]: null
        }
      },
    });
  }

  async viewFlashCards(lessonId: string, appUserId: string): Promise<LessonWithFlashCards> {
    const lesson =  await LessonModel.findOne({
      where: {
        id: lessonId,
        deletedAt:{
          [Op.eq]: null
        },
      },
      attributes: ['id', 'dayId', 'lessonOrder', 'title', 'description', 'estimatedMinutes', 'difficulty', 'audioIntro'],
      include: [
        {
          as: 'day',
          model: DayModel,
          where: {
            deletedAt: {
              [Op.eq]: null,
            },
          },
          attributes: ['id', 'courseId'],
          include: [
            {
              as: 'course',
              model: CourseModel,
              where: {
                deletedAt: {
                  [Op.eq]: null,
                },
              },
              required: false,
              attributes: ['id'],
              include: [
                {
                  as: 'user_courses',
                  model: AppUserCourseModel,
                  where: {
                    appUserId: appUserId,
                    deletedAt: {
                      [Op.eq]: null,
                    },
                  },
                  required: false,
                  attributes: ['id', 'appUserId', 'courseId'],
                },
              ],
            },
          ],
        },
        {
          as: 'flash_cards',
          model: FlashCardModel,
          required: false,
          where: {
            deletedAt: {
              [Op.eq]: null,
            },
          },
          attributes: ['id', 'lessonId', 'cardOrder', 'frontText', 'frontSubtext', 'backText', 'backSubtext', 'example', 'exampleTranslation', 'usageNotes', 'imageUrl', 'audioUrl'],
          include: [
            {
              as: 'flash_cards_viewed',
              model: FlashCardViewedModel,
              where: {
                deletedAt: {
                  [Op.eq]: null,
                },
              },
              required: false,
              attributes: ['id', 'appUserId', 'flashCardId'],
            },
          ],
        },
      ],
    }) as unknown as LessonWithFlashCards;

    return lesson
  }

  async nextLesson(lessonId: string): Promise<{ id: string, dayId: string, lessonOrder: number } | null> {
    const lesson =  await LessonModel.findOne({
      where: {
        id: lessonId,
        deletedAt:{
          [Op.eq]: null
        },
      },
      attributes: ['id', 'dayId', 'lessonOrder'],
    }) as unknown as LessonWithFlashCards;

    if(!lesson)
      throw new NotFoundException('Lesson not found.')

    const nextLesson =  await LessonModel.findOne({
      where: {
        dayId: lesson.dayId,
        lessonOrder: {
          [Op.gt]: lesson.lessonOrder
        },
        deletedAt:{
          [Op.eq]: null
        },
      },
      attributes: ['id', 'dayId', 'lessonOrder'],
    })

    return nextLesson
  }
}
