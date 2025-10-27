import { Op, Transaction } from 'sequelize';
import { datetimeYMDHis } from '../../../utils/datetime.utils';
import { FlashCardModel } from '../models/flash-card.model';
import { FlashCard, StoreFlashCard, UpdateFlashCardData } from '../../../types/flash-card.type';
import { OptionalObjectAttributes } from '@aws-sdk/client-s3';
import { paginatedResults } from '../../../utils/common.utils';
import { PaginationResult } from '../../../types/common.type';
export class FlashCardRepository {
  constructor() {}
  async findFlashCardById(id: string, select: string[]|null = null, withRelations: boolean = false): Promise<FlashCard> {
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

    // # TODO: ESTABLISH ANY RELATIONS LATER IF NEED BE
    // if(withRelations){
    //   options.include = [
    //     {
    //       as: 'flashCards',
    //       model: FlashCardModel,
    //       where: {
    //         deletedAt: {
    //           [Op.eq]: null
    //         }
    //       }
    //     },
    //   ];
    // }

    return (await FlashCardModel.findOne(options)) as unknown as FlashCard;
  }

  async findFlashCardByIds(ids: string[]): Promise<FlashCard[]> {
    return (await FlashCardModel.findAll({
      where: {
        id: {
          [Op.in]: ids,
          deletedAt:{
            [Op.eq]: null
          } 
        },
      },
    })) as unknown as FlashCard[];
  }

  async flashCardExistsById(id: string): Promise<number> {
    return await FlashCardModel.count({
      where: {
        id: id,
        deletedAt:{
          [Op.eq]: null
        }
      },
    });
  }

  async getPaginatedFlashCards(page: number = 1, limit: number = 10, sortOrder: string, sortBy: string, searchText?: string|null): Promise<PaginationResult<FlashCardModel>> {
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
          frontText: {
            [Op.iLike]: `%${searchText}%` 
          },
          frontSubtext: {
            [Op.iLike]: `%${searchText}%` 
          },
          backText: {
            [Op.iLike]: `%${searchText}%` 
          },
          backSubtext: {
            [Op.iLike]: `%${searchText}%` 
          },
        }
      }
    }

    return await paginatedResults(FlashCardModel, options, page, limit) as PaginationResult<FlashCardModel>; // use your actual pagination logic
  }

  async getAllFlashCards(): Promise<FlashCard[]> {
    return (await FlashCardModel.findAll({
      where: {
        deletedAt: {
          [Op.eq]: null
        }
      },
      order: [['createdAt', 'DESC']],
    })) as unknown as FlashCard[];
  }

  async getAllFlashCardsCount(): Promise<number> {
    return await FlashCardModel.count({
      where: {
        deletedAt: {
          [Op.eq]: null
        }
      },
    });
  }

  async getAllAssociatedFlashCardsCount(lessonId: string): Promise<number> {
    return await FlashCardModel.count({
      where: {
        lessonId: lessonId,
        deletedAt: {
          [Op.eq]: null
        }
      },
    });
  }

  async storeFlashCard(data: StoreFlashCard, transaction?: Transaction): Promise<FlashCard> {
    const options: any = {};

    if(transaction) options.transaction = transaction;

    return await FlashCardModel.create(data, options) as unknown as FlashCard;
  }

  async updateFlashCard(data: UpdateFlashCardData, id: string, transaction?: Transaction): Promise<FlashCard> {
    const options: any = {
      where: {
        id: id,
      },
    };

    if(transaction) options.transaction = transaction;

    return (await FlashCardModel.update(data, options)) as unknown as FlashCard;
  }

  async deleteFlashCard(id: string, deletedBy: string, transaction?: Transaction): Promise<FlashCard> {
    const options: any = {
      where: {
        id: id,
      },
    };

    if(transaction) options.transaction = transaction;

    return await FlashCardModel.update({ deletedAt: datetimeYMDHis(), deletedBy: deletedBy }, options) as unknown as FlashCard;
  }

  async hardDeleteById(id: string, transaction?: Transaction): Promise<FlashCard> {
    const options: any = {
      where: {
        id: id,
      },
    };

    if(transaction) options.transaction = transaction;

    return (await FlashCardModel.destroy(options)) as unknown as FlashCard;
  }

  async getAllFlashCardsWithOptions(select: string[]|null = null): Promise<FlashCard[]> {
    const options: any = {};

    if(select && select.length > 0)
      options.attributes = select

    return (await FlashCardModel.findAll(options));
  }

  async lessonWithCardOrderExists(lessonId: string, cardOrder : number): Promise<number> {
    return await FlashCardModel.count({
      where: {
        lessonId: lessonId,
        cardOrder: cardOrder,
        deletedAt:{
          [Op.eq]: null
        }
      },
    });
  }
}
