import { Response } from 'express';
import { CustomException } from '../../errors/CustomException.error';
import { AdminAuthenticatedRequest } from '../../types/authenticate.type';
import { NotFoundException } from '../../errors/NotFoundException.error';
import { DayService } from '../../services/admin/day.services';
import { BadRequestException } from '../../errors/BadRequestException.error';
import { CourseService } from '../../services/admin/course.services';
import { LessonService } from '../../services/admin/lesson.services';
import { ForbiddenException } from '../../errors/ForbiddenException.error';

const courseService = new CourseService();
const dayService = new DayService();
const lessonService = new LessonService();

export async function getAllDays(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const page = req.query.page ? Number(req.query.page) : null
    const limit = req.query.limit ? Number(req.query.limit) : null
    const sortOrder = req.query.sortOrder ? req.query.sortOrder.toString() : 'ASC'
    const sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt'
    const searchText = req.query.searchText && req.query.searchText !== '' ? req.query.searchText.toString() : null

    if(sortOrder && sortOrder !== 'ASC' && sortOrder !== 'DESC')
      throw new BadRequestException('Sort order has to be ASC or DESC')

    let days = null
    if(page && limit)
      days = await dayService.getPaginatedDays(page, limit, sortOrder, sortBy, searchText);
    else
      days = await dayService.getAllDays();

    return res.status(200).json({
      data: {
        message: 'Day list fetched successfully!',
        days: days,
      },
      statusCode: 200,
    });
  } catch (error) {
    // console.log('getAllDays', error)
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

export async function getSingleDay(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const dayId = req.params.id
    const day = await dayService.findDayById(dayId, null, true);

    if(!day)
      throw new NotFoundException('Day not found.')
    if(day.deletedAt)
      throw new NotFoundException('Day not found.')

    return res.status(200).json({
      data: {
        message: 'Day fetched successfully!',
        day: day,
      },
      statusCode: 200,
    });
  } catch (error) {
    // console.log('getSingleAllDay', error)
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

export async function createDay(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const course = await courseService.findCourseById(req.body.courseId, ['id', 'totalDays'])
    if(!course)
      throw new NotFoundException('Course not found.')
    if(req.body.dayNumber > course.totalDays)
      throw new BadRequestException('Day number cannot exceed course\'s total days.')

    const data = { ...req.body, updatedBy: req.user!.id }
    const response = await dayService.storeDay(data);

    if(response)
      return res.status(201).json({
        data: {
          message: 'Day created successfully!',
          day: response,
        },
        statusCode: 201,
      });

    throw new CustomException('Something went wrong! Please try again.', 500)
  } catch (error) {
    // console.log('createDay', error)
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

export async function updateDay(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const dayId = req.params.id
    if(dayId !== req.body.id)
      throw new BadRequestException('Incorrect day id provided.')

    const day = await dayService.findDayById(dayId, ['id', 'deletedAt'])

    if(!day)
      throw new NotFoundException('Day not found.')
    if(day.deletedAt)
      throw new NotFoundException('Day not found.')

    const data = { ...req.body, updatedBy: req.user!.id }
    const response = await dayService.updateDay(data, dayId);

    if(response){
      const day = await dayService.findDayById(dayId);
      return res.json({
        data: {
          message: 'Day updated successfully!',
          day: day,
        },
        statusCode: 200,
      });
    }
    throw new CustomException('Something went wrong! Please try again.', 500)
  } catch (error) {
    // console.log('updateDay', error);
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

export async function deleteDay(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const dayId = req.params.id

    const day = await dayService.findDayById(dayId)
    if(!day)
      throw new NotFoundException('Day not found.')
    if(day.deletedAt)
      throw new NotFoundException('Day not found.')

    const associatedLessonsCount = await lessonService.getAllAssociatedLessonsCount(dayId)
    if(associatedLessonsCount)
      throw new ForbiddenException('This day has existing associated lessons. Please delete them first.')

    const response = await dayService.deleteDay(dayId, req.user!.id);

    if(response){
      return res.json({
        data: {
          message: 'Day deleted successfully!',
        },
        statusCode: 200,
      });
    }
    throw new CustomException('Something went wrong! Please try again.', 500)
  } catch (error) {
    // console.log('deleteDay', error);
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