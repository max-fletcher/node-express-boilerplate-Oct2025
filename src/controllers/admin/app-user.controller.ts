import { Response } from 'express';
import { CustomException } from '../../errors/CustomException.error';
import { AdminAuthenticatedRequest } from '../../types/authenticate.type';
import { AppUserService } from '../../services/admin/app-user.services';
import { deleteMultipleFileLocal, multipleFileLocalFullPathResolver, rollbackMultipleFileLocalUpload } from '../../middleware/fileUploadLocal.middleware';
import { BadRequestException } from '../../errors/BadRequestException.error';
import { NotFoundException } from '../../errors/NotFoundException.error';
import { AppUserCourseService } from '../../services/admin/app-user-course.services';
import { formatAdminViewSingleAppUserWithCourses, formatAppUserWithCourses } from '../../formatter/app-user.formatter';
import { AdminViewSingleAppUserWithAppUserCoursesWithCourse, AppUserWithAppUserCoursesWithCourse } from '../../types/app-user.type';

const appUserService = new AppUserService();
const appUserCourseService = new AppUserCourseService();

export async function getAllAppUsers(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const page = req.query.page ? Number(req.query.page) : null
    const limit = req.query.limit ? Number(req.query.limit) : null
    const sortOrder = req.query.sortOrder ? req.query.sortOrder.toString() : 'ASC'
    const sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt'
    const searchText = req.query.searchText && req.query.searchText !== '' ? req.query.searchText.toString() : null

    if(sortOrder && sortOrder !== 'ASC' && sortOrder !== 'DESC')
      throw new BadRequestException('Sort order has to be ASC or DESC')

    let users = null
    if(page && limit)
      users = await appUserService.getPaginatedAppUsers(page, limit, sortOrder, sortBy, searchText);
    else
      users = await appUserService.getAllAppUsers();

    return res.status(200).json({
      data: {
        message: 'User list fetched successfully!',
        users: users,
      },
      statusCode: 200,
    });
  } catch (error) {
    // console.log('getAllAppUsers', error)
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

export async function getPaginatedAppUsersForCourseList(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const { limit, offset, orderBy } = req.params
    const users = await appUserService.getPaginatedAppUsersForCourseList(limit, offset, orderBy);

    return res.status(200).json({
      data: {
        message: 'User list fetched successfully!',
        users: users,
      },
      statusCode: 200,
    });
  } catch (error) {
    // console.log('getAllAppUsers', error)
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

export async function getSingleAppUser(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const appUserId = req.params.id
    const user = await appUserService.findUserById(appUserId, null, true);

    if(!user)
      throw new NotFoundException('User not found.')
    if(user.deletedAt)
      throw new NotFoundException('User not found.')

    return res.status(200).json({
      data: {
        message: 'User fetched successfully!',
        user: formatAdminViewSingleAppUserWithCourses(user as AdminViewSingleAppUserWithAppUserCoursesWithCourse),
      },
      statusCode: 200,
    });
  } catch (error) {
    // console.log('getSingleAllAppUser', error)
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

export async function createAppUser(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const { phoneNumber, firstName, lastName, email } = req.body

    const phoneNumberExists = await appUserService.userExistsByPhone(phoneNumber)
    if(phoneNumberExists)
      throw new BadRequestException('Phone number already taken.')

    if(email){
      const emailExists = await appUserService.userExistsByEmail(req.body.email)
      if(emailExists)
        throw new BadRequestException('Email already taken.')
    }

    const filesWithFullPaths = multipleFileLocalFullPathResolver(req)
    const data = { ...req.body, isNewUser: firstName && lastName ? false : true, avatarUrl: filesWithFullPaths?.avatarUrl[0] }
    const response = await appUserService.storeAppUser(data);

    if(response)
      return res.status(201).json({
        data: {
          message: 'User created successfully!',
          user: response,
        },
        statusCode: 201,
      });

    throw new CustomException('Something went wrong! Please try again.', 500)
  } catch (error) {
    // console.log('createAppUser', error)
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

export async function updateAppUser(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const appUserId = req.params.id
    const user = await appUserService.findUserById(appUserId, ['id', 'avatarUrl', 'deletedAt'])
    if(!user)
      throw new NotFoundException('User not found.')
    if(user.deletedAt)
      throw new NotFoundException('User not found.')

    if(req.body.phoneNumber){
      const phoneNumberExists = await appUserService.userExistsByPhone(req.body.phoneNumber, appUserId)
      if(phoneNumberExists)
        throw new BadRequestException('Phone number already taken.')
    }

    if(req.body.email){
      const emailExists = await appUserService.userExistsByEmail(req.body.email, appUserId)
      if(emailExists)
        throw new BadRequestException('Email already taken.')
    }

    let data = { ...req.body }

    if(req.files?.avatarUrl && req.files?.avatarUrl.length > 0){
      if(user.avatarUrl)
        deleteMultipleFileLocal(req, [user.avatarUrl])

      const filesWithFullPaths = multipleFileLocalFullPathResolver(req)
      data = { ...data, avatarUrl: filesWithFullPaths?.avatarUrl[0] }
    }

    const response = await appUserService.updateAppUser(data, appUserId);

    if(response){
      const user = await appUserService.findUserById(appUserId);
      return res.json({
        data: {
          message: 'User updated successfully!',
          user: user,
        },
        statusCode: 200,
      });
    }
    throw new CustomException('Something went wrong! Please try again.', 500)
  } catch (error) {
    // console.log('updateAppUser', error);
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

export async function deleteAppUser(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const appUserId = req.params.id

    const user = await appUserService.findUserById(appUserId)
    if(!user)
      throw new NotFoundException('User not found.')
    if(user.deletedAt)
      throw new NotFoundException('User not found.')

    if(user.avatarUrl)
      deleteMultipleFileLocal(req, [user.avatarUrl])

    const response = await appUserService.deleteAppUser(appUserId, req.user!.id);

    if(response){
      return res.json({
        data: {
          message: 'User deleted successfully!',
        },
        statusCode: 200,
      });
    }
    throw new CustomException('Something went wrong! Please try again.', 500)
  } catch (error) {
    // console.log('updateAppUser', error);
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

export async function enrollAppUserToCourse(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const appUserId = req.body.appUserId
    let courseIds = req.body.courseIds
    courseIds = [...new Set(courseIds)] as string[];

    const data = []
    for (let i = 0; i < courseIds.length; i++) {
      const enrolled = await appUserCourseService.appUserCourseExistsByAppUserIdAndCourseId(appUserId, courseIds[i]);
      if(!enrolled)
        data.push({ appUserId: req.body.appUserId, courseId: courseIds[i], updatedBy: req.user!.id, deletedAt: null, deletedBy: null })
    }

    const response = await appUserCourseService.bulkStoreAppUserCourse(data);

    if(response){
      return res.json({
        data: {
          message: 'App user enrolled successfully!',
          enrolled: response,
        },
        statusCode: 200,
      });
    }
    throw new CustomException('Something went wrong! Please try again.', 500)
  } catch (error) {
    // console.log('enrollAppUserToCourse', error);
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

export async function appUserEnrolled(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params

    const appUserWithCourses = await appUserCourseService.findAppUserWithCoursesById(id) as AppUserWithAppUserCoursesWithCourse
    if(!appUserWithCourses)
      throw new NotFoundException('App user not found.')

    if(appUserWithCourses){
      return res.json({
        data: {
          message: 'User with enrolled courses list.',
          appUser: formatAppUserWithCourses(appUserWithCourses),
        },
        statusCode: 200,
      });
    }
    throw new CustomException('Something went wrong! Please try again.', 500)
  } catch (error) {
    // console.log('enrollAppUserToCourse', error);
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