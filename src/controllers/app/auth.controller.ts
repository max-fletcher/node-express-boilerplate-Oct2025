import { AppUserPayload } from '../../schema/token-payload.schema';
import { generateToken } from '../../utils/jwt.utils';
import { Request, Response } from 'express';
import { CustomException } from '../../errors/CustomException.error';
import { AppUserAuthService } from '../../services/app/auth.service';
import { UserClient } from '../../db/clients/postgres.client';
import { AppAuthenticatedRequest } from '../../types/authenticate.type';
import { AppUserService } from '../../services/admin/app-user.services';
import { BadRequestException } from '../../errors/BadRequestException.error';
import { getEnvVar } from '../../utils/common.utils';
import { LoginHistoryService } from '../../services/app/login-history.services';

const appUserAuthService = new AppUserAuthService();
const appUserervice = new AppUserService();
const loginHistoryervice = new LoginHistoryService();

const sequelize = UserClient.getInstance();

export async function login(req: Request, res: Response) {
  const transaction = await sequelize.transaction();
  try {
    const { phoneNo } = req.body // NOTE: using phoneNo instead of phoneNumber because of some obscure error
    const response = await appUserAuthService.appUserLogin(phoneNo, transaction);

    await loginHistoryervice.storeDailyLoginHistory({ appUserId: response.id }, transaction)

    await transaction.commit()

    const user = {
      id: response.id,
      phoneNumber: response.phoneNumber,
      firstName: response.firstName,
      lastName: response.lastName,
      email: response.email,
      verified: false,
    } as AppUserPayload

    const token = generateToken(user);
  
    return res.json({
      data: {
        message: 'Login successful.',
        jwt: token,
        user: response,
      },
      statusCode: 200,
    });
  } catch (error) {
    // console.log('app user login', error);
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

export async function verifyOTP(req: AppAuthenticatedRequest, res: Response) {
  try {
    const { otp } = req.body

    const appUser = await appUserervice.findUserByPhone(req.user!.phoneNumber, null, ['id','phoneNumber','firstName','lastName','email', 'isNewUser', 'lastLoginAt']);
    if(!appUser)
      throw new BadRequestException('Something went wrong. Please logout and try again.')

    if(getEnvVar('APP_ENV') !== 'local'){
      const response = await appUserAuthService.verifyOTP(req.user!.phoneNumber, otp, req.user!.id);
  
      if(!response)
        throw new CustomException('Something went wrong! Please try again.', 500)
    }
    else if(otp !== '000000'){
      throw new BadRequestException('OTP mismatch.');
    }

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
        message: 'OTP verified successful.',
        jwt: token,
        user: appUser,
      },
      statusCode: 200,
    });
  } catch (error) {
    // console.log('verifyOTP', error);
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

export async function resendOTP(req: AppAuthenticatedRequest, res: Response) {
  try {
    const appUser = await appUserervice.findUserByPhone(req.user!.phoneNumber, null, ['id','phoneNumber','firstName','lastName','email', 'isNewUser', 'lastLoginAt']);
    if(!appUser)
      throw new BadRequestException('Something went wrong. Please logout and try again.')

    const response = await appUserAuthService.resendOTP(req.user!);
  
    if(!response)
      throw new CustomException('Something went wrong! Please try again.', 500)
  
    return res.json({
      data: {
        message: 'OTP resent.'
      },
      statusCode: 200,
    });
  } catch (error) {
    // console.log('resendOTP', error);
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