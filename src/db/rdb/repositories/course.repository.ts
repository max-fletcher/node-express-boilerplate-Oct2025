import { Model, Op, Transaction } from 'sequelize';
import { CourseModel, DayModel, LanguageModel } from '../models';
import { Course, UpdateCourseData, StoreCourse } from '../../../types/course.type';
import { datetimeYMDHis } from '../../../utils/datetime.utils';
import { PaginationResult } from '../../../types/common.type';
import { paginatedResults } from '../../../utils/common.utils';
export class CourseRepository {
  constructor() {}
  async findCourseById(id: string, select: string[]|null = null, withRelations: boolean = false): Promise<Course> {
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
          as: 'days',
          model: DayModel,
          required: false,
          where: {
            deletedAt: {
              [Op.eq]: null
            }
          }
        },
        {
          as: 'language',
          model: LanguageModel,
          where: {
            deletedAt: {
              [Op.eq]: null,
            },
          },
          attributes: ['id', 'name']
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
      ];
    }

    return (await CourseModel.findOne(options)) as unknown as Course;
  }

  async findCourseByIds(ids: string[]): Promise<Course[]> {
    return (await CourseModel.findAll({
      where: {
        id: {
          [Op.in]: ids,
          deletedAt:{
            [Op.eq]: null
          } 
        },
      },
      include: [
        {
          as: 'language',
          model: LanguageModel,
          where: {
            deletedAt: {
              [Op.eq]: null,
            },
          },
          attributes: ['id', 'name']
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
      ],
    })) as unknown as Course[];
  }

  async courseExistsById(id: string): Promise<number> {
    return await CourseModel.count({
      where: {
        id: id,
        deletedAt:{
          [Op.eq]: null
        }
      },
    });
  }

  async getPaginatedCourses(page: number = 1, limit: number = 10, sortOrder: string, sortBy: string, searchText?: string|null): Promise<PaginationResult<CourseModel>> {
    let order
    if(sortBy === 'language')
      order = [['language', 'name', sortOrder]]
    else if(sortBy === 'targetLanguage')
      order = [['target_language', 'name', sortOrder]]
    else
      order = [[sortBy, sortOrder]]

    const options: any = {
      where: {
        deletedAt: {
          [Op.eq]: null
        }
      },
      include: [
        {
          as: 'language',
          model: LanguageModel,
          where: {
            deletedAt: {
              [Op.eq]: null,
            },
          },
          attributes: ['id', 'name']
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
      ],
      order: order
    }

    if(searchText)
      options.where = {...options.where, title: { [Op.iLike]: `%${searchText}%` }}

    return await paginatedResults(CourseModel, options, page, limit) as PaginationResult<CourseModel>; // use your actual pagination logic
  }

  async getAllCourses(): Promise<Course[]> {
    return (await CourseModel.findAll({
      where: {
        deletedAt: {
          [Op.eq]: null
        }
      },
      include: [
        {
          as: 'language',
          model: LanguageModel,
          where: {
            deletedAt: {
              [Op.eq]: null,
            },
          },
          attributes: ['id', 'name']
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
      ],
      order: [['createdAt', 'DESC']],
    })) as unknown as Course[];
  }
  
  async getAllCoursesWithOptions(select: string[]|null = null): Promise<Course[]> {
    const options: any = {};

    if(select && select.length > 0)
      options.attributes = select

    return (await CourseModel.findAll(options));
  }

  async storeCourse(data: StoreCourse, transaction?: Transaction): Promise<Course> {
    const options: any = {};

    if(transaction) options.transaction = transaction;

    return await CourseModel.create(data, options) as unknown as Course;
  }

  async updateCourse(data: UpdateCourseData, id: string, transaction?: Transaction): Promise<Course> {
    const options: any = {
      where: {
        id: id,
      },
    };

    if(transaction) options.transaction = transaction;

    return (await CourseModel.update(data, options)) as unknown as Course;
  }

  async deleteCourse(id: string, deletedBy: string, transaction?: Transaction): Promise<Course> {
    const options: any = {
      where: {
        id: id,
      },
    };

    if(transaction) options.transaction = transaction;

    return await CourseModel.update({ deletedAt: datetimeYMDHis(), deletedBy: deletedBy }, options) as unknown as Course;
  }

  async hardDeleteById(id: string, transaction?: Transaction): Promise<Course> {
    const options: any = {
      where: {
        id: id,
      },
    };

    if(transaction) options.transaction = transaction;

    return (await CourseModel.destroy(options)) as unknown as Course;
  }
}
