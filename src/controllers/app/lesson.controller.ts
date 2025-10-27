import { Response } from 'express';
import { CustomException } from '../../errors/CustomException.error';
import { AppAuthenticatedRequest } from '../../types/authenticate.type';
import { LessonService } from '../../services/admin/lesson.services';
import { NotFoundException } from '../../errors/NotFoundException.error';
import { BadRequestException } from '../../errors/BadRequestException.error';
import { FlashCardViewedService } from '../../services/app/flash-cards-viewed.services';
import { FlashCardService } from '../../services/admin/flash-card.services';

const lessonService = new LessonService();
const flashCardService = new FlashCardService();
const flashCardViewedService = new FlashCardViewedService();

export async function viewFlashCards(req: AppAuthenticatedRequest, res: Response) {
  try {
    const { lessonId } = req.params
    const lesson = await lessonService.viewFlashCards(lessonId, req.user!.id)
    if(!lesson)
      throw new NotFoundException('Lesson not found.')
    if(lesson.day.course.user_courses.length === 0)
      throw new BadRequestException('You are not part of this course.')

    lesson.flash_cards = lesson.flash_cards.sort((a, b) => a.cardOrder - b.cardOrder)

    const nextLesson = await lessonService.nextLesson(lessonId)

    return res.json({
      data: {
        message: 'Lesson flash cards list.',
        nextLessonId: nextLesson ? nextLesson.id : null,
        lesson: lesson,
      },
      statusCode: 200,
    });
  } catch (error) {
    // console.log('viewFlashCards', error);
    if (error instanceof CustomException) {
      return res.status(error.statusCode).json({
        error: {
          message: error.message,
        },
        code: error.statusCode,
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

export async function storeFlashCardViewed(req: AppAuthenticatedRequest, res: Response) {
  try {
    const { flashCardId, familiarity } = req.body
    const flashCard = await flashCardService.flashCardExistsById(flashCardId)
    if(!flashCard)
      throw new NotFoundException('Flash card not found.')

    const flashCardViewed = await flashCardViewedService.findFlashCardViewedByFlashCardIdAndAppUserId(flashCardId, req.user!.id)
    if(flashCardViewed)
      return res.json({
        data: {
          message: 'Flash card viewed already stored.',
          flashCardViewed: flashCardViewed
        },
        statusCode: 200,
      });

    const storeData = {
      appUserId: req.user!.id,
      flashCardId: flashCardId,
      familiarity: familiarity
    }
    const storeflashCard = await flashCardViewedService.storeFlashCardViewed(storeData)
    if(!storeflashCard)
      throw new CustomException('Failed to store flash card viewed.', 500)

    return res.json({
      data: {
        message: 'Stored new flash card viewed.',
        flashCardViewed: storeflashCard
      },
      statusCode: 200,
    });
  } catch (error) {
    // console.log('storeFlashCardViewed', error);
    if (error instanceof CustomException) {
      return res.status(error.statusCode).json({
        error: {
          message: error.message,
        },
        code: error.statusCode,
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