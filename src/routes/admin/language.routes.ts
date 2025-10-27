import express from 'express';
import { JwtMiddleware } from '../../middleware/jwt.middleware';
import { validateRequestBody } from '../../utils/validatiion.utils';
import { createLanguage, deleteLanguage, getAllLanguages, getSingleLanguage, updateLanguage } from '../../controllers/admin/language.controller';
import { createLanguageSchema, updateLanguageSchema } from '../../schema/language.schema';

const LanguageRouter = express.Router();
const jwtMiddleware = new JwtMiddleware();

LanguageRouter.get('/', jwtMiddleware.verifyToken, getAllLanguages);
LanguageRouter.get('/:id', jwtMiddleware.verifyToken, getSingleLanguage);
LanguageRouter.post(
  '/',
  jwtMiddleware.verifyToken,
  validateRequestBody(createLanguageSchema),
  createLanguage,
);
LanguageRouter.patch(
  '/:id',
  jwtMiddleware.verifyToken,
  validateRequestBody(updateLanguageSchema),
  updateLanguage,
);
LanguageRouter.delete('/:id', jwtMiddleware.verifyToken, deleteLanguage);

export { LanguageRouter };
