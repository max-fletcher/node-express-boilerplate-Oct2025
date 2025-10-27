import express from 'express';
import { validateRequestBody } from '../../utils/validatiion.utils';
import { JwtMiddleware } from '../../middleware/jwt.middleware';
// import { editProfileSchema } from '../../schema/app-auth.schema';
import { createAppUser, getAppUsers, updateAppUser } from '../../controllers/app/app-user.controller';
import { createAppUserSchema, updateAppUserSchema } from '../../schema/app-user.schema';

const AppUserRouter = express.Router();
// const jwtMiddleware = new JwtMiddleware();

// Define Routes
AppUserRouter

.get('/', 
  // jwtMiddleware.verifyAppUserToken,
  getAppUsers)
.post('/',
  // jwtMiddleware.verifyAppUserToken,
  validateRequestBody(createAppUserSchema),
  createAppUser,
);
AppUserRouter.patch(
  '/:id',
  // jwtMiddleware.verifyAppUserToken,
  // appUserFileUploaderMiddleware,
  validateRequestBody(updateAppUserSchema),
  updateAppUser,
);
// AppUserRouter.post(
//   '/save-time-spent-data',
//   jwtMiddleware.verifyAppUserToken,
//   validateRequestBody(saveTimeSpentDataSchema),
//   saveTimeSpentData,
// );

export { AppUserRouter };
