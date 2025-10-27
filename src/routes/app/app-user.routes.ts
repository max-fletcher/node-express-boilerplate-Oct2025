import express from 'express';
import { validateRequestBody } from '../../utils/validatiion.utils';
import { JwtMiddleware } from '../../middleware/jwt.middleware';
// import { editProfileSchema } from '../../schema/app-auth.schema';
import { createAppUser, getAppUsers } from '../../controllers/app/app-user.controller';
import { createAppUserSchema } from '../../schema/app-user.schema';

const AppUserRouter = express.Router();
const jwtMiddleware = new JwtMiddleware();

// Define Routes
AppUserRouter
// , jwtMiddleware.verifyAppUserToken
.get('/users', getAppUsers)
// jwtMiddleware.verifyAppUserTokenWithoutOTPVerification,
.post('/users',
  validateRequestBody(createAppUserSchema),
  createAppUser,
);
// AppUserRouter.patch(
//   '/edit-avatar',
//   jwtMiddleware.verifyAppUserToken,
//   appUserFileUploaderMiddleware,
//   validateRequestBody(updateAvtatarUrlSchama),
//   editAvatar,
// );
// AppUserRouter.post(
//   '/save-time-spent-data',
//   jwtMiddleware.verifyAppUserToken,
//   validateRequestBody(saveTimeSpentDataSchema),
//   saveTimeSpentData,
// );

export { AppUserRouter };
