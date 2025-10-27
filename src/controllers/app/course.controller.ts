import { Response } from 'express';
import { CustomException } from '../../errors/CustomException.error';
import { AppAuthenticatedRequest } from '../../types/authenticate.type';
import { AppUserCourseService } from '../../services/admin/app-user-course.services';
import { formatViewEnrolledCourseDetails, formatViewEnrolledCourses } from '../../formatter/app-user-course.formatter';
import { NotFoundException } from '../../errors/NotFoundException.error';
import { AppUserEnrolledCourseDetails } from '../../types/app-user-course.type';
import { LanguageService } from '../../services/admin/language.services';

const appUserCourseService = new AppUserCourseService();
const languageService = new LanguageService();

export async function viewAllanguages(req: AppAuthenticatedRequest, res: Response) {
  try {
    const data = await languageService.getAllLanguages(['id', 'name']);
  
    return res.json({
      data: {
        message: 'Languages list.',
        langauges: data
      },
      statusCode: 200,
    });
  } catch (error) {
    // console.log('viewAllanguages', error);
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

export async function viewEnrolledCourses(req: AppAuthenticatedRequest, res: Response) {
  try {
    const languageId = (req.query.languageId && req.query.languageId !== '') ? req.query.languageId.toString() : null
    const searchText = (req.query.searchText && req.query.searchText !== '') ? req.query.searchText.toString() : null
    const page = req.query.page ? Number(req.query.page) : 1
    const number = req.query.number ? Number(req.query.number) : 10
    const limit = number
    const offset = (page - 1) * number

    const { next, data } = await appUserCourseService.viewEnrolledCourses(req.user!.id, limit, offset, languageId, searchText);
  
    return res.json({
      data: {
        message: 'App user\'s enrolled course list.',
        next: next,
        courses: formatViewEnrolledCourses(data)
      },
      statusCode: 200,
    });
  } catch (error) {
    // console.log('viewEnrolledCourses', error);
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

export async function viewEnrolledCourseDetails(req: AppAuthenticatedRequest, res: Response) {
  try {
    const { courseId } = req.params
    const response = await appUserCourseService.viewEnrolledCourseDetails(courseId, req.user!.id)

    if(!response)
      throw new NotFoundException('You are not enrolled to this course.')

    response.course.days = response.course.days
    .sort((a, b) => a.dayNumber - b.dayNumber)
    .map((day) => {
      const sortedLessons = day.lessons
        .sort((a, b) => a.lessonOrder - b.lessonOrder)
        .map((lesson) => {
          let lessonCompleted = true;
          const sortedFlashCards = lesson.flash_cards
            .sort((a, b) => a.cardOrder - b.cardOrder)
            .map((flashCard) => {
              if (flashCard.flash_cards_viewed.length === 0) {
                lessonCompleted = false;
              }
              return flashCard;
            });

          return {
            ...lesson,
            completed: lessonCompleted,
            flash_cards: sortedFlashCards,
          };
        });

      return {
        ...day,
        lessons: sortedLessons,
      };
    });

    // CONVERTING TO PLAIN JS OBJ ELSE THIS DOESN"T WORK AS IT REFUSES MUTATION
    const plain = response as any
    const plainResponse = plain.get({ plain: true }) as unknown as AppUserEnrolledCourseDetails;

    return res.json({
      data: {
        message: 'App user\'s enrolled course details.',
        course: formatViewEnrolledCourseDetails(plainResponse),
      },
      statusCode: 200,
    });
  } catch (error) {
    // console.log('viewEnrolledCourses', error);
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