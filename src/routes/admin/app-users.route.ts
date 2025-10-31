import express from 'express';
import { validateRequestBody } from '../../utils/validatiion.utils';
// import { JwtMiddleware } from '../../middleware/jwt.middleware';
import { createAppUser, deleteAppUser, findUserById, findUsersByIds, getAll, hardDeleteAppUser, updateAppUser } from '../../controllers/app/app-user.controller';
import { createAppUserSchema, updateAppUserSchema } from '../../schema/app-user.schema';
import { IdsSchema } from '../../schema/common.schema';

const AppUserRouter = express.Router();
// const jwtMiddleware = new JwtMiddleware();

// Define Routes
AppUserRouter
  .get('/', 
    // jwtMiddleware.verifyAppUserToken,
    getAll
  )
  .get('/:id', 
    // jwtMiddleware.verifyAppUserToken,
    findUserById
  )
  .post('/ids',
    // jwtMiddleware.verifyAppUserToken,
    validateRequestBody(IdsSchema),
    findUsersByIds
  )
  .post('/',
    // jwtMiddleware.verifyAppUserToken,
    validateRequestBody(createAppUserSchema),
    createAppUser,
  )
  .patch(
    '/:id',
    // jwtMiddleware.verifyAppUserToken,
    // appUserFileUploaderMiddleware,
    validateRequestBody(updateAppUserSchema),
    updateAppUser,
  )
  .delete('/:id',
    // jwtMiddleware.verifyAppUserToken,
    deleteAppUser,
  )
  .delete('/:id/hard-delete',
    // jwtMiddleware.verifyAppUserToken,
    hardDeleteAppUser,
  )

export { AppUserRouter };
