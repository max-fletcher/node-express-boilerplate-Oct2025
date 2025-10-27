import { Response } from 'express';
import { CustomException } from '../../errors/CustomException.error';
import { AdminAuthenticatedRequest } from '../../types/authenticate.type';
import { deleteMultipleFileLocal, multipleFileLocalFullPathResolver, rollbackMultipleFileLocalUpload } from '../../middleware/fileUploadLocal.middleware';
import { NotFoundException } from '../../errors/NotFoundException.error';
import { LessonService } from '../../services/admin/lesson.services';
import { BadRequestException } from '../../errors/BadRequestException.error';
import { ForbiddenException } from '../../errors/ForbiddenException.error';
import { FlashCardService } from '../../services/admin/flash-card.services';

const lessonService = new LessonService();
const flashCardsService = new FlashCardService();

export async function getAllLessons(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const page = req.query.page ? Number(req.query.page) : null
    const limit = req.query.limit ? Number(req.query.limit) : null
    const sortOrder = req.query.sortOrder ? req.query.sortOrder.toString() : 'ASC'
    const sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt'
    const searchText = req.query.searchText && req.query.searchText !== '' ? req.query.searchText.toString() : null

    if(sortOrder && sortOrder !== 'ASC' && sortOrder !== 'DESC')
      throw new BadRequestException('Sort order has to be ASC or DESC')

    let lessons = null
    if(page && limit)
      lessons = await lessonService.getPaginatedLessons(page, limit, sortOrder, sortBy, searchText);
    else
      lessons = await lessonService.getAllLessons();

    return res.status(200).json({
      data: {
        message: 'Lesson list fetched successfully!',
        lessons: lessons,
      },
      statusCode: 200,
    });
  } catch (error) {
    // console.log('getAllLessons', error)
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

export async function getSingleLesson(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const lessonId = req.params.id
    const lesson = await lessonService.findLessonById(lessonId, null, true);

    if(!lesson)
      throw new NotFoundException('Lesson not found.')
    if(lesson.deletedAt)
      throw new NotFoundException('Lesson not found.')

    return res.status(200).json({
      data: {
        message: 'Lesson fetched successfully!',
        lesson: lesson,
      },
      statusCode: 200,
    });
  } catch (error) {
    // console.log('getSingleAllLesson', error)
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

export async function createLesson(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const filesWithFullPaths = multipleFileLocalFullPathResolver(req)
    const data = { ...req.body, audioIntro: filesWithFullPaths?.audioIntro[0], updatedBy: req.user!.id }
    const response = await lessonService.storeLesson(data);

    if(response)
      return res.status(201).json({
        data: {
          message: 'Lesson created successfully!',
          lesson: response,
        },
        statusCode: 201,
      });

    throw new CustomException('Something went wrong! Please try again.', 500)
  } catch (error) {
    // console.log('createLesson', error)
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

export async function updateLesson(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const lessonId = req.params.id
    if(lessonId !== req.body.id)
      throw new BadRequestException('Incorrect lesson id provided.')
    const lesson = await lessonService.findLessonById(lessonId, ['id', 'audioIntro', 'deletedAt'])
    if(!lesson)
      throw new NotFoundException('Lesson not found.')
    if(lesson.deletedAt)
      throw new NotFoundException('Lesson not found.')

    let data = { ...req.body, updatedBy: req.user!.id }

    if(req.files?.audioIntro && req.files?.audioIntro.length > 0){
      if(lesson.audioIntro)
        deleteMultipleFileLocal(req, [lesson.audioIntro])

      const filesWithFullPaths = multipleFileLocalFullPathResolver(req)
      data = { ...data, audioIntro: filesWithFullPaths?.audioIntro[0] }
    }

    const response = await lessonService.updateLesson(data, lessonId);

    if(response){
      const lesson = await lessonService.findLessonById(lessonId);
      return res.json({
        data: {
          message: 'Lesson updated successfully!',
          lesson: lesson,
        },
        statusCode: 200,
      });
    }
    throw new CustomException('Something went wrong! Please try again.', 500)
  } catch (error) {
    // console.log('updateLesson', error);
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

export async function deleteLesson(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const lessonId = req.params.id

    const lesson = await lessonService.findLessonById(lessonId, ['id', 'audioIntro', 'deletedAt'])
    if(!lesson)
      throw new NotFoundException('Lesson not found.')
    if(lesson.deletedAt)
      throw new NotFoundException('Lesson not found.')

    const associatedFlashCardsCount = await flashCardsService.getAllAssociatedFlashCardsCount(lessonId)
      if(associatedFlashCardsCount)
        throw new ForbiddenException('This lesson has existing associated flash cards. Please delete them first.')

    if(lesson.audioIntro)
      deleteMultipleFileLocal(req, [lesson.audioIntro])

    const response = await lessonService.deleteLesson(lessonId, req.user!.id);

    if(response){
      return res.json({
        data: {
          message: 'Lesson deleted successfully!',
        },
        statusCode: 200,
      });
    }
    throw new CustomException('Something went wrong! Please try again.', 500)
  } catch (error) {
    // console.log('deleteLesson', error);
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