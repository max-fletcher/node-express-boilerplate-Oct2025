import { Response } from 'express';
import { CustomException } from '../../errors/CustomException.error';
import { AppAuthenticatedRequest } from '../../types/authenticate.type';
import { TimeSpentService } from '../../services/app/time-spent.services';
import { generateId } from '../../utils/id.utils';

const timeSpentService = new TimeSpentService();

export async function saveTimeSpentData(req: AppAuthenticatedRequest, res: Response) {
  try {
    const { timeSpent } = req.body
    const exists = await timeSpentService.timeSpentExistsByAppUserId(req.user!.id)
    if(!exists){
      const data = {
        id: generateId(),
        appUserId: req.user!.id,
        timeSpent: timeSpent,
      }
      await timeSpentService.storeTimeSpent(data)

      return res.json({
        data: {
          message: 'App user\'s time spent stored successfully.',
        },
        statusCode: 201,
      });
    }

    await timeSpentService.incrementTimeSpentByAppUserId(req.user!.id, timeSpent)

    return res.json({
      data: {
        message: 'App user\'s time spent updated successfully.',
      },
      statusCode: 200,
    });
  } catch (error) {
    // console.log('saveTimeSpentData', error);
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