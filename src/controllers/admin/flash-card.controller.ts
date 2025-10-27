import { Response } from 'express';
import { CustomException } from '../../errors/CustomException.error';
import { AdminAuthenticatedRequest } from '../../types/authenticate.type';
import { deleteMultipleFileLocal, multipleFileLocalFullPathResolver, rollbackMultipleFileLocalUpload } from '../../middleware/fileUploadLocal.middleware';
import { NotFoundException } from '../../errors/NotFoundException.error';
import { FlashCardService } from '../../services/admin/flash-card.services';
import { BadRequestException } from '../../errors/BadRequestException.error';

const flashCardService = new FlashCardService();

export async function getAllFlashCards(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const page = req.query.page ? Number(req.query.page) : null
    const limit = req.query.limit ? Number(req.query.limit) : null
    const sortOrder = req.query.sortOrder ? req.query.sortOrder.toString() : 'ASC'
    const sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt'
    const searchText = req.query.searchText && req.query.searchText !== '' ? req.query.searchText.toString() : null

    if(sortOrder && sortOrder !== 'ASC' && sortOrder !== 'DESC')
      throw new BadRequestException('Sort order has to be ASC or DESC')

    let flashCards = null
    if(page && limit)
      flashCards = await flashCardService.getPaginatedFlashCards(page, limit, sortOrder, sortBy, searchText);
    else
      flashCards = await flashCardService.getAllFlashCards();

    return res.status(200).json({
      data: {
        message: 'Flash card list fetched successfully!',
        flash_cards: flashCards,
      },
      statusCode: 200,
    });
  } catch (error) {
    // console.log('getAllFlashCards', error)
    if (error instanceof CustomException) {
      return res.status(error.statusCode).json({
        error: {
          message: error.message,
        },
        statusCode: error.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      statusCode: 500,
    });
  }
}

export async function getSingleFlashCard(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const flashCardId = req.params.id
    const flashCard = await flashCardService.findFlashCardById(flashCardId, null, true);

    if(!flashCard)
      throw new NotFoundException('Flash card not found.')
    if(flashCard.deletedAt)
      throw new NotFoundException('Flash card not found.')

    return res.status(200).json({
      data: {
        message: 'Flash card fetched successfully!',
        flash_card: flashCard,
      },
      statusCode: 200,
    });
  } catch (error) {
    // console.log('getSingleAllFlashCard', error)
    if (error instanceof CustomException) {
      return res.status(error.statusCode).json({
        error: {
          message: error.message,
        },
        statusCode: error.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      statusCode: 500,
    });
  }
}

export async function createFlashCard(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const filesWithFullPaths = multipleFileLocalFullPathResolver(req)
    const data = { 
      ...req.body, 
      audioUrl: filesWithFullPaths?.audioUrl && filesWithFullPaths?.audioUrl[0] ? filesWithFullPaths?.audioUrl[0] : null, 
      imageUrl: filesWithFullPaths?.imageUrl && filesWithFullPaths?.imageUrl[0] ? filesWithFullPaths?.imageUrl[0] : null, 
      updatedBy: req.user!.id, 
    }
    const response = await flashCardService.storeFlashCard(data);

    if(response)
      return res.status(201).json({
        data: {
          message: 'Flash card created successfully!',
          flash_card: response,
        },
        statusCode: 201,
      });

    throw new CustomException('Something went wrong! Please try again.', 500)
  } catch (error) {
    // console.log('createFlashCard', error)
    rollbackMultipleFileLocalUpload(req)
    if (error instanceof CustomException) {
      return res.status(error.statusCode).json({
        error: {
          message: error.message,
        },
        statusCode: error.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      statusCode: 500,
    });
  }
}

export async function updateFlashCard(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const flashCardId = req.params.id
    if(flashCardId !== req.body.id)
      throw new BadRequestException('Incorrect flash card id provided.')
    const flashCard = await flashCardService.findFlashCardById(flashCardId, ['id', 'imageUrl', 'audioUrl', 'deletedAt'])
    if(!flashCard)
      throw new NotFoundException('Flash card not found.')
    if(flashCard.deletedAt)
      throw new NotFoundException('Flash card not found.')

    let data = { ...req.body, audioUrl: flashCard.audioUrl , imageUrl: flashCard.imageUrl, updatedBy: req.user!.id }

    if(req.files?.imageUrl && req.files?.imageUrl.length > 0){
      if(flashCard.imageUrl)
        deleteMultipleFileLocal(req, [flashCard.imageUrl])

      const filesWithFullPaths = multipleFileLocalFullPathResolver(req)
      data = { ...data, imageUrl: filesWithFullPaths?.imageUrl[0] }
    }

    if(req.files?.audioUrl && req.files?.audioUrl.length > 0){
      if(flashCard.audioUrl)
        deleteMultipleFileLocal(req, [flashCard.audioUrl])

      const filesWithFullPaths = multipleFileLocalFullPathResolver(req)
      data = { ...data, audioUrl: filesWithFullPaths?.audioUrl[0] }
    }

    const response = await flashCardService.updateFlashCard(data, flashCardId);

    if(response){
      const flashCard = await flashCardService.findFlashCardById(flashCardId);
      return res.json({
        data: {
          message: 'Flash card updated successfully!',
          flash_card: flashCard,
        },
        statusCode: 200,
      });
    }
    throw new CustomException('Something went wrong! Please try again.', 500)
  } catch (error) {
    // console.log('updateFlashCard', error);
    rollbackMultipleFileLocalUpload(req)
    if (error instanceof CustomException) {
      return res.status(error.statusCode).json({
        error: {
          message: error.message,
        },
        statusCode: error.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      statusCode: 500,
    });
  }
}

export async function deleteFlashCard(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const flashCardId = req.params.id

    const flashCard = await flashCardService.findFlashCardById(flashCardId)
    if(!flashCard)
      throw new NotFoundException('Flash card not found.')
    if(flashCard.deletedAt)
      throw new NotFoundException('Flash card not found.')

    if(flashCard.imageUrl)
      deleteMultipleFileLocal(req, [flashCard.imageUrl])

    if(flashCard.audioUrl)
      deleteMultipleFileLocal(req, [flashCard.audioUrl])

    const response = await flashCardService.deleteFlashCard(flashCardId, req.user!.id);

    if(response){
      return res.json({
        data: {
          message: 'Flash card deleted successfully!',
        },
        statusCode: 200,
      });
    }
    throw new CustomException('Something went wrong! Please try again.', 500)
  } catch (error) {
    // console.log('deleteFlashCard', error);
    if (error instanceof CustomException) {
      return res.status(error.statusCode).json({
        error: {
          message: error.message,
        },
        statusCode: error.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      statusCode: 500,
    });
  }
}