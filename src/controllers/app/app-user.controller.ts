import { AppUserPayload } from '../../schema/token-payload.schema';
import { generateToken } from '../../utils/jwt.utils';
import { Response } from 'express';
import { CustomException } from '../../errors/CustomException.error';
import { AppAuthenticatedRequest } from '../../types/authenticate.type';
import { AppUserService } from '../../services/admin/app-user.services';
import { NotFoundException } from '../../errors/NotFoundException.error';
import { deleteMultipleFileLocal, multipleFileLocalFullPathResolver } from '../../middleware/fileUploadLocal.middleware';

const appUserService = new AppUserService();

export async function getProfile(req: AppAuthenticatedRequest, res: Response) {
  try {
    const appUser = await appUserService.findUserById(req.user!.id, ['id', 'phoneNumber', 'firstName', 'lastName', 'email', 'isNewUser', 'lastLoginAt', 'avatarUrl']);
    if(!appUser)
      throw new NotFoundException('App user not found.')
  
    return res.json({
      data: {
        message: 'App user\'s profile.',
        user: appUser,
      },
      statusCode: 200,
    });
  } catch (error) {
    // console.log('getProfile', error);
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

export async function editProfile(req: AppAuthenticatedRequest, res: Response) {
  try {
    const { firstName, lastName } = req.body

    const exists = await appUserService.userExistsById(req.user!.id);
    if(!exists)
      throw new NotFoundException('App user not found.')

    const update = await appUserService.updateAppUser({ firstName: firstName, lastName: lastName, isNewUser: false }, req.user!.id);
    if(!update)
      throw new CustomException('Failed to update.', 500)

    const appUser = await appUserService.findUserById(req.user!.id, ['id', 'phoneNumber', 'firstName', 'lastName', 'email', 'isNewUser', 'lastLoginAt', 'avatarUrl']);

    const user = {
      id: appUser.id,
      phoneNumber: appUser.phoneNumber,
      firstName: appUser.firstName,
      lastName: appUser.lastName,
      email: appUser.email,
      verified: true,
    } as AppUserPayload

    const token = generateToken(user);
  
    return res.json({
      data: {
        message: 'Profile edited successfully.',
        jwt: token,
        user: appUser,
      },
      statusCode: 200,
    });
  } catch (error) {
    // console.log('editProfile', error);
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

export async function editAvatar(req: AppAuthenticatedRequest, res: Response) {
  try {
    let appUser = await appUserService.findUserById(req.user!.id);
    if(!appUser)
      throw new NotFoundException('App user not found.')

    if(req.files?.avatarUrl && req.files?.avatarUrl.length > 0){
      if(appUser.avatarUrl)
        deleteMultipleFileLocal(req, [appUser.avatarUrl])
    }

    const filesWithFullPaths = multipleFileLocalFullPathResolver(req)
    const update = await appUserService.updateAppUser({ avatarUrl: filesWithFullPaths?.avatarUrl[0] }, req.user!.id);
    if(!update)
      throw new CustomException('Failed to update.', 500)

    appUser = await appUserService.findUserById(req.user!.id, ['id', 'phoneNumber', 'firstName', 'lastName', 'email', 'isNewUser', 'lastLoginAt', 'avatarUrl']);
  
    return res.json({
      data: {
        message: 'Avatar edited successfully.',
        user: appUser,
      },
      statusCode: 200,
    });
  } catch (error) {
    // console.log('editAvatar', error);
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