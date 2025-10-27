import { Transaction } from 'sequelize';
import { AppUserRepository } from '../../db/rdb/repositories/app-user.repository';
import { datetimeYMDHis } from '../../utils/datetime.utils';
import { NotFoundException } from '../../errors/NotFoundException.error';
import { AppUserOTPRepository } from '../../db/rdb/repositories/app-user-otp.repository';
import { generateId, generateOtp } from '../../utils/id.utils';
import { getOTPExpiry } from '../../utils/common.utils';
import { BadRequestException } from '../../errors/BadRequestException.error';
import { AppUser } from '../../types/app-user.type';
import { AppUserPayload } from '../../schema/token-payload.schema';

export class AppUserAuthService {
  private appUserRepo: AppUserRepository;
  private appUserOTPRepo: AppUserOTPRepository;

  constructor() {
    this.appUserRepo = new AppUserRepository();
    this.appUserOTPRepo = new AppUserOTPRepository();
  }

  async appUserLogin(phoneNumber: string, transaction?: Transaction) {
    const appUser = await this.appUserRepo.findUserByPhone(phoneNumber);
    if (!appUser)
      throw new NotFoundException('User with this phone number not found.')

    const otp_validity = getOTPExpiry();
    await this.appUserOTPRepo.deleteAppUserOTPByPhoneNo(phoneNumber, appUser.id, transaction); // Delete previous OTP if any exist

    const storeOTP = await this.appUserOTPRepo.storeAppUserOTP(
      {
        id: generateId(),
        phoneNumber: phoneNumber,
        otp: generateOtp(),
        otp_expires_at: datetimeYMDHis(new Date(), 'mins', otp_validity)
      },
      transaction,
    );
    if (!storeOTP)
      throw new NotFoundException('Failed to store OTP.')

    await this.appUserRepo.updateAppUser({ lastLoginAt: datetimeYMDHis() }, appUser.id, transaction); // update user

    return appUser
  }

  async verifyOTP(phoneNumber: string, otp: string, appUserId: string, transaction?: Transaction) {
    const verified = await this.appUserOTPRepo.verifyAppUserOTP(phoneNumber, otp, appUserId, transaction);
    if (!verified)
      throw new BadRequestException('Something went wrong. Please logout and try again.')

    return verified
  }

  async resendOTP(appUser: AppUserPayload, transaction?: Transaction) {
    const otp_validity = getOTPExpiry();
    await this.appUserOTPRepo.deleteAppUserOTPByPhoneNo(appUser.phoneNumber, appUser.id, transaction); // Delete previous OTP if any exist

    const storeOTP = await this.appUserOTPRepo.storeAppUserOTP(
      {
        id: generateId(),
        phoneNumber: appUser.phoneNumber,
        otp: generateOtp(),
        otp_expires_at: datetimeYMDHis(new Date(), 'mins', otp_validity)
      },
      transaction,
    );
    if (!storeOTP)
      throw new NotFoundException('Failed to store OTP.')

    await this.appUserRepo.updateAppUser({ lastLoginAt: datetimeYMDHis() }, appUser.id, transaction); // update user

    return appUser
  }
}