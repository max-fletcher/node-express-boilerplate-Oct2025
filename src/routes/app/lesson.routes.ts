import express from 'express';
import { JwtMiddleware } from '../../middleware/jwt.middleware';
import { storeFlashCardViewed, viewFlashCards } from '../../controllers/app/lesson.controller';
import { validateRequestBody } from '../../utils/validatiion.utils';
import { createFlashCardViewedSchema } from '../../schema/flash-card-viewed.schema';

const AppLessonRouter = express.Router();
const jwtMiddleware = new JwtMiddleware();

// Define Routes
AppLessonRouter.get('/show-lesson-flash-cards/:lessonId', jwtMiddleware.verifyAppUserToken, viewFlashCards);
AppLessonRouter.post(
  '/store-flash-card-viewed',
  jwtMiddleware.verifyAppUserToken,
  validateRequestBody(createFlashCardViewedSchema),
  storeFlashCardViewed,
);

export { AppLessonRouter };
