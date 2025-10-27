import express from 'express';
import { JwtMiddleware } from '../../middleware/jwt.middleware';
import { validateRequestBody } from '../../utils/validatiion.utils';
import { createFlashCardSchema, updateFlashCardSchema } from '../../schema/flash-card.schema';
import { flashCardFileUploaderMiddleware } from '../../fileUploaders/flash-card.fileUploaders';
import { createFlashCard, deleteFlashCard, getAllFlashCards, getSingleFlashCard, updateFlashCard } from '../../controllers/admin/flash-card.controller';

const FlashCardRouter = express.Router();
const jwtMiddleware = new JwtMiddleware();

FlashCardRouter.get('/', jwtMiddleware.verifyToken, getAllFlashCards);
FlashCardRouter.get('/:id', jwtMiddleware.verifyToken, getSingleFlashCard);
FlashCardRouter.post(
  '/',
  jwtMiddleware.verifyToken,
  flashCardFileUploaderMiddleware,
  validateRequestBody(createFlashCardSchema),
  createFlashCard,
);
FlashCardRouter.patch(
  '/:id',
  jwtMiddleware.verifyToken,
  flashCardFileUploaderMiddleware,
  validateRequestBody(updateFlashCardSchema),
  updateFlashCard,
);

FlashCardRouter.delete('/:id', jwtMiddleware.verifyToken, deleteFlashCard);

export { FlashCardRouter };