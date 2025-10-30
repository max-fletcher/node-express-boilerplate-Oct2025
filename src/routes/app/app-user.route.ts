import express from 'express';
import { validateRequestBody } from '../../utils/validatiion.utils';
// import { JwtMiddleware } from '../../middleware/jwt.middleware';
// import { editProfileSchema } from '../../schema/app-auth.schema';
import { createAppUser, findUserById, findUsersByIds, getAll, updateAppUser } from '../../controllers/app/app-user.controller';
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
  // .delete('/:id',
  //   // jwtMiddleware.verifyAppUserToken,
  //   createAppUser,
  // )

export { AppUserRouter };
