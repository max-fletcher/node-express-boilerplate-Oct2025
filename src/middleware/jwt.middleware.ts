import { NextFunction, Response } from 'express';
import { sign, verify } from 'jsonwebtoken';
import { AdminUserRepository } from '../db/rdb/repositories/admin-user.repository';
import { AppUserPayload, AdminUserPayload } from '../schema/token-payload.schema';
import {
  AppAuthenticatedRequest,
  AdminAuthenticatedRequest,
} from '../types/authenticate.type';
import { getEnvVar } from '../utils/common.utils';
import { AppUserRepository } from '../db/rdb/repositories/app-user.repository';
import { datetimeYMDHis } from '../utils/datetime.utils';
import { CustomException } from '../errors/CustomException.error';
import { UnauthorizedException } from '../errors/UnauthorizedException.error';

export class JwtMiddleware {
  generateToken(payload: AdminUserPayload): string {
    const expiresIn = Number(getEnvVar('JWT_EXPIRY'));
    return sign(payload, getEnvVar('JWT_SECRET'), {
      expiresIn: `${expiresIn} days`,
    });
  }

  async verifyToken(
    req: AdminAuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader?.startsWith('Bearer '))
        throw new UnauthorizedException('You are not logged in!')

      const token = authHeader.split(' ')[1];

      const payload = verify(token, getEnvVar('JWT_SECRET'));

      if (payload) {
        req.user = payload as AdminUserPayload;
        const adminRepo = new AdminUserRepository();
        const checkUser = await adminRepo.findAdminUserById(req.user.id);

        if (!checkUser)
          throw new UnauthorizedException('Invalid Token Data');

        return next();
      }

      throw new UnauthorizedException('Token Expired');
    } catch (e: any) {
      // console.log('verifyToken', e);
      if (e instanceof CustomException){
        return res.status(e.statusCode).json({
          error:{
            message: e.message,
          },
          statusCode: e.statusCode,
        });
      }

      return res.status(500).json({
        error:{
          message: 'Something went wrong! Please try again.',
        },
        statusCode: 500,
      });
    }
  }

  generateAppUserToken(payload: AppUserPayload): {
    token: string;
    validity: string;
  } {
    const expiresIn = Number(getEnvVar('JWT_EXPIRY'));
    return {
      token: sign(payload, getEnvVar('JWT_SECRET'), {
        expiresIn: `${expiresIn} days`,
      }),
      validity: datetimeYMDHis(null, 'days', expiresIn),
    };
  }

  async verifyAppUserTokenWithoutOTPVerification(
    req: AppAuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader?.startsWith('Bearer '))
        throw new UnauthorizedException('You are not logged in!')

      const token = authHeader.split(' ')[1];

      const payload = verify(token, getEnvVar('JWT_SECRET'));

      if (payload) {
        req.user = payload as AppUserPayload;
        const appUserRepo = new AppUserRepository();
        const checkUser = await appUserRepo.findUserById(req.user.id);

        if (!checkUser)
          throw new UnauthorizedException('Invalid token provided!')

        if (checkUser.deletedAt)
          throw new UnauthorizedException('This user has been deleted!')

        return next();
      }

      throw new UnauthorizedException('Auth token expired! Please login again.')
    } catch (e: any) {
      // console.log('verifyAppUserTokenWithoutOTPVerification', e);
      if (e instanceof CustomException) {
        return res.status(e.statusCode).json({
          error: {
            message: e.message,
          },
          statusCode: e.statusCode,
        });
      }

      return res.status(500).json({
        error: {
          message: 'Something went wrong! Please try again.'
        },
        statusCode: 500,
      });
    }
  }

  async verifyAppUserToken(
    req: AppAuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader?.startsWith('Bearer '))
        throw new UnauthorizedException('You are not logged in!')

      const token = authHeader.split(' ')[1];

      const payload = verify(token, getEnvVar('JWT_SECRET'));

      if (payload) {
        req.user = payload as AppUserPayload;
        if(!req.user.verified)
          return res.json({
            error: {
              message: 'Account unverified. Please verify OTP to proceed.',
              otpVerified: false,
            },
            statusCode: 403
          })

        const appUserRepo = new AppUserRepository();
        const checkUser = await appUserRepo.findUserById(req.user.id);

        if (!checkUser)
          throw new UnauthorizedException('Invalid token provided!')

        if (checkUser.deletedAt)
          throw new UnauthorizedException('This user has been deleted!')

        if(checkUser.isNewUser)
          return res.json({
            error: {
              message: 'First name and last name missing. Please update them to proceed.',
              isNewUser: checkUser.isNewUser,
            },
            statusCode: 403
          })

        return next();
      }

      throw new UnauthorizedException('Auth token expired! Please login again.')
    } catch (e: any) {
      // console.log('verifyAppUserToken', e);
      if (e instanceof CustomException) {
        return res.status(e.statusCode).json({
          error: {
            message: e.message,
          },
          statusCode: e.statusCode,
        });
      }

      return res.status(500).json({
        error: {
          message: 'Something went wrong! Please try again.'
        },
        statusCode: 500,
      });
    }
  }

  async optionalVerifyAppUserToken(
    req: AppAuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const authHeader = req.headers.authorization;

      if (authHeader && authHeader?.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];

        const payload = verify(token, getEnvVar('JWT_SECRET')) as any;
        if (payload) {
          req.user = payload as AppUserPayload;
          if (!payload.device_id) {
            const userRepo = new AppUserRepository();
            const checkUser = await userRepo.findUserById(req.user.id);

            if (!checkUser)
              throw new UnauthorizedException('Invalid token provided!')

            return next();
          }
        }
        throw new UnauthorizedException('Auth token expired! Please login again.');
      }

      return next();
    } catch (e: any) {
      // // console.log('optionalVerifyAppUserToken', e);
      if (e instanceof CustomException) {
        return res.status(e.statusCode).json({
          error: {
            message: e.message,
          },
          statusCode: e.statusCode,
        });
      }

      return res.status(500).json({
        error: {
          message: 'Something went wrong! Please try again.'
        },
        statusCode: 500,
      });
    }
  }
}
