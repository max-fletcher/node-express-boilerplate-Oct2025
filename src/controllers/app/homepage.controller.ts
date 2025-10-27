import { Response } from 'express';
import { CustomException } from '../../errors/CustomException.error';
import { AppAuthenticatedRequest } from '../../types/authenticate.type';
import { HomepageService } from '../../services/app/homepage.services';

const homepageService = new HomepageService();

export async function viewAppUserHomepage(req: AppAuthenticatedRequest, res: Response) {
  try {
    const { streak, wordsLearned, continueLearningData } = await homepageService.viewAppUserHomepage(req.user!.id);
  
    return res.json({
      data: {
        message: 'App user\'s enrolled course list.',
        streak: streak,
        wordsLearned: wordsLearned,
        continueLearningData: continueLearningData
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