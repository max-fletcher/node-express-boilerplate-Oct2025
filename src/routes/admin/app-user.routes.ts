import express from 'express';
import { JwtMiddleware } from '../../middleware/jwt.middleware';
import { appUserEnrolled, createAppUser, deleteAppUser, enrollAppUserToCourse, getAllAppUsers, getSingleAppUser, updateAppUser } from '../../controllers/admin/app-user.controller';
import { validateRequestBody } from '../../utils/validatiion.utils';
import { createAppUserSchema, updateAppUserSchema } from '../../schema/app-user.schema';
import { appUserFileUploaderMiddleware } from '../../fileUploaders/app-user.fileUploaders';
import { enrollAppUserToCourseSchema } from '../../schema/enroll-app-user-to-course.schema';

const AppUserRouter = express.Router();
const jwtMiddleware = new JwtMiddleware();

AppUserRouter.get('/', jwtMiddleware.verifyToken, getAllAppUsers);
AppUserRouter.get('/:id', jwtMiddleware.verifyToken, getSingleAppUser);
AppUserRouter.post(
  '/',
  jwtMiddleware.verifyToken,
  appUserFileUploaderMiddleware,
  validateRequestBody(createAppUserSchema),
  createAppUser,
);
AppUserRouter.patch(
  '/:id',
  jwtMiddleware.verifyToken,
  appUserFileUploaderMiddleware,
  validateRequestBody(updateAppUserSchema),
  updateAppUser,
);
AppUserRouter.delete('/:id', jwtMiddleware.verifyToken, deleteAppUser);

AppUserRouter.post(
  '/enroll',
  jwtMiddleware.verifyToken,
  validateRequestBody(enrollAppUserToCourseSchema),
  enrollAppUserToCourse,
);

AppUserRouter.get(
  '/enrolled-courses/:id',
  jwtMiddleware.verifyToken,
  appUserEnrolled,
);

export { AppUserRouter };
