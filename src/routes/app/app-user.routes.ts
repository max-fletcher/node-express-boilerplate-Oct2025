import express from 'express';
import { validateRequestBody } from '../../utils/validatiion.utils';
import { JwtMiddleware } from '../../middleware/jwt.middleware';
import { editProfileSchema, saveTimeSpentDataSchema, updateAvtatarUrlSchama } from '../../schema/app-auth.schema';
import { editAvatar, editProfile, getProfile } from '../../controllers/app/app-user.controller';
import { appUserFileUploaderMiddleware } from '../../fileUploaders/app-user.fileUploaders';
import { saveTimeSpentData } from '../../controllers/app/time-spent.controller';

const AppUserProfileRouter = express.Router();
const jwtMiddleware = new JwtMiddleware();

// Define Routes
AppUserProfileRouter.get('/get-profile', jwtMiddleware.verifyAppUserToken, getProfile);
AppUserProfileRouter.patch(
  '/edit-profile',
  jwtMiddleware.verifyAppUserTokenWithoutOTPVerification,
  validateRequestBody(editProfileSchema),
  editProfile,
);
AppUserProfileRouter.patch(
  '/edit-avatar',
  jwtMiddleware.verifyAppUserToken,
  appUserFileUploaderMiddleware,
  validateRequestBody(updateAvtatarUrlSchama),
  editAvatar,
);
AppUserProfileRouter.post(
  '/save-time-spent-data',
  jwtMiddleware.verifyAppUserToken,
  validateRequestBody(saveTimeSpentDataSchema),
  saveTimeSpentData,
);

export { AppUserProfileRouter };
