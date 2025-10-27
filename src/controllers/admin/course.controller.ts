import { Response } from 'express';
import { CustomException } from '../../errors/CustomException.error';
import { AdminAuthenticatedRequest } from '../../types/authenticate.type';
import { CourseService } from '../../services/admin/course.services';
import { deleteMultipleFileLocal, multipleFileLocalFullPathResolver, rollbackMultipleFileLocalUpload } from '../../middleware/fileUploadLocal.middleware';
import { NotFoundException } from '../../errors/NotFoundException.error';
import { DayService } from '../../services/admin/day.services';
import { BadRequestException } from '../../errors/BadRequestException.error';
import { ForbiddenException } from '../../errors/ForbiddenException.error';

const courseService = new CourseService();
const dayService = new DayService();

export async function getAllCourses(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const page = req.query.page ? Number(req.query.page) : null
    const limit = req.query.limit ? Number(req.query.limit) : null
    const sortOrder = req.query.sortOrder ? req.query.sortOrder.toString() : 'ASC'
    const sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt'
    const searchText = req.query.searchText && req.query.searchText !== '' ? req.query.searchText.toString() : null

    if(sortOrder && sortOrder !== 'ASC' && sortOrder !== 'DESC')
      throw new BadRequestException('Sort order has to be ASC or DESC')

    let courses = null
    if(page && limit)
      courses = await courseService.getPaginatedCourses(page, limit, sortOrder, sortBy, searchText);
    else
      courses = await courseService.getAllCourses();

    return res.status(200).json({
      data: {
        message: 'Course list fetched successfully!',
        courses: courses,
      },
      statusCode: 200,
    });
  } catch (error) {
    // console.log('getAllCourses', error)
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

export async function getSingleCourse(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const courseId = req.params.id
    const course = await courseService.findCourseById(courseId, null, true);

    if(!course)
      throw new NotFoundException('Course not found.')
    if(course.deletedAt)
      throw new NotFoundException('Course not found.')

    return res.status(200).json({
      data: {
        message: 'Course fetched successfully!',
        course: course,
      },
      statusCode: 200,
    });
  } catch (error) {
    // console.log('getSingleAllCourse', error)
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

export async function createCourse(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const filesWithFullPaths = multipleFileLocalFullPathResolver(req)
    const data = { ...req.body, imagePath: filesWithFullPaths?.imagePath[0], updatedBy: req.user!.id }
    const response = await courseService.storeCourse(data);

    if(response){
      const courseCourse = await courseService.findCourseById(response.id, null, true);
      return res.status(201).json({
        data: {
          message: 'Course created successfully!',
          course: courseCourse,
        },
        statusCode: 201,
      });
    }

    throw new CustomException('Something went wrong! Please try again.', 500)
  } catch (error) {
    // console.log('createCourse', error)
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

export async function updateCourse(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const courseId = req.params.id
    const course = await courseService.findCourseById(courseId, ['id', 'imagePath', 'deletedAt'])
    if(!course)
      throw new NotFoundException('Course not found.')
    if(course.deletedAt)
      throw new NotFoundException('Course not found.')

    const daysGreaterThanNewTotalDaysCount = await dayService.daysGreaterThanNewTotalDaysCount(courseId, req.body.totalDays)
    if(daysGreaterThanNewTotalDaysCount)
      throw new BadRequestException('This lesson has days that has day number greater than the new total days.')

    let data = { ...req.body, updatedBy: req.user!.id }

    if(req.files?.imagePath && req.files?.imagePath.length > 0){
      if(course.imagePath)
        deleteMultipleFileLocal(req, [course.imagePath])

      const filesWithFullPaths = multipleFileLocalFullPathResolver(req)
      data = { ...data, imagePath: filesWithFullPaths?.imagePath[0] }
    }

    const response = await courseService.updateCourse(data, courseId);

    if(response){
      const updatedCourse = await courseService.findCourseById(courseId, null, true);
      return res.json({
        data: {
          message: 'Course updated successfully!',
          course: updatedCourse,
        },
        statusCode: 200,
      });
    }
    throw new CustomException('Something went wrong! Please try again.', 500)
  } catch (error) {
    // console.log('updateCourse', error);
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

export async function deleteCourse(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const courseId = req.params.id

    const course = await courseService.findCourseById(courseId)
    if(!course)
      throw new NotFoundException('Course not found.')
    if(course.deletedAt)
      throw new NotFoundException('Course not found.')

    const associatedDaysCount = await dayService.getAllAssociatedDaysCount(courseId)
    if(associatedDaysCount)
      throw new ForbiddenException('This course has existing assocaited days. Please delete them first.')

    if(course.imagePath)
      deleteMultipleFileLocal(req, [course.imagePath])

    const response = await courseService.deleteCourse(courseId, req.user!.id);

    if(response){
      return res.json({
        data: {
          message: 'Course deleted successfully!',
        },
        statusCode: 200,
      });
    }
    throw new CustomException('Something went wrong! Please try again.', 500)
  } catch (error) {
    // console.log('deleteCourse', error);
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