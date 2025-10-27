import { Op, Transaction } from 'sequelize';
import { LanguageModel } from '../models';
import { datetimeYMDHis } from '../../../utils/datetime.utils';
import { Language, StoreLanguage, UpdateLanguageData } from '../../../types/language.type';
import { paginatedResults } from '../../../utils/common.utils';
import { PaginationResult } from '../../../types/common.type';
export class LanguageRepository {
  constructor() {}
  async findLanguageById(id: string, select: string[]|null = null): Promise<Language> {
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

    return (await LanguageModel.findOne(options)) as unknown as Language;
  }

  async findLanguageByIds(ids: string[]): Promise<Language[]> {
    return (await LanguageModel.findAll({
      where: {
        id: {
          [Op.in]: ids,
          deletedAt:{
            [Op.eq]: null
          } 
        },
      },
    })) as unknown as Language[];
  }

  async languageExistsById(id: string): Promise<number> {
    return await LanguageModel.count({
      where: {
        id: id,
        deletedAt:{
          [Op.eq]: null
        }
      },
    });
  }

  async getPaginatedLanguages(page: number = 1, limit: number = 10, sortOrder: string, sortBy: string, searchText?: string|null): Promise<PaginationResult<LanguageModel>> {
    const options: any = {
      where: {
        deletedAt: {
          [Op.eq]: null
        }
      },
      order: [[sortBy, sortOrder]]
    }

    if(searchText)
      options.where = { ...options.where, name: { [Op.iLike]: `%${searchText}%` }}

    return await paginatedResults(LanguageModel, options, page, limit) as PaginationResult<LanguageModel>; // use your actual pagination logic
  }

  async getAllLanguages(select: string[]|null = null): Promise<Language[]> {
    const options: any = {
      where: {
        deletedAt: {
          [Op.eq]: null
        },
      },
      order: [['createdAt', 'DESC']],
    }

    if(select && select.length > 0)
      options.attributes = select

    return (await LanguageModel.findAll(options)) as unknown as Language[];
  }
  
  async getAllLanguagesWithOptions(select: string[]|null = null): Promise<Language[]> {
    const options: any = {};

    if(select && select.length > 0)
      options.attributes = select

    return (await LanguageModel.findAll(options));
  }

  async storeLanguage(data: StoreLanguage, transaction?: Transaction): Promise<Language> {
    const options: any = {};

    if(transaction) options.transaction = transaction;

    return await LanguageModel.create(data, options) as unknown as Language;
  }

  async updateLanguage(data: UpdateLanguageData, id: string, transaction?: Transaction): Promise<Language> {
    const options: any = {
      where: {
        id: id,
      },
    };

    if(transaction) options.transaction = transaction;

    return (await LanguageModel.update(data, options)) as unknown as Language;
  }

  async deleteLanguage(id: string, deletedBy: string, transaction?: Transaction): Promise<Language> {
    const options: any = {
      where: {
        id: id,
      },
    };

    if(transaction) options.transaction = transaction;

    return await LanguageModel.update({ deletedAt: datetimeYMDHis(), deletedBy: deletedBy }, options) as unknown as Language;
  }

  async hardDeleteById(id: string, transaction?: Transaction): Promise<Language> {
    const options: any = {
      where: {
        id: id,
      },
    };

    if(transaction) options.transaction = transaction;

    return (await LanguageModel.destroy(options)) as unknown as Language;
  }

  async languageExistsByName(name: string, exceptId?: string): Promise<number> {
    let options: any = {
      where: {
        name: {
          [Op.iLike]: name
        },
        deletedAt:{
          [Op.eq]: null
        }
      },
    }

    if(exceptId)
    options.where = {...options.where, id: { [Op.ne]: exceptId }}

    return (await LanguageModel.count(options)) as unknown as number;
  }
}
