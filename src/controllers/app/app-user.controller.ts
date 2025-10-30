import { Response } from 'express';
import { CustomException } from '../../errors/CustomException.error';
import { AppAuthenticatedRequest } from '../../types/types/authenticate.type';
import { formattedErrorResponse, formattedSuccessResponse } from '../../formatter/formattedResponse.formatter';
import { getEnvVar } from '../../utils/common.utils';
import { AppUserService } from '../../services/app/app-user.service';
import { AnyType } from '../../types/types/common.type';

const appUserService = new AppUserService();

/**
 * Fetch all data from the "users" table
 *
 * @async
 * @function getAll
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<Response<any, Record<string, any>>>} Responds with JSON containing the created user and status message.
 * @throws {Error} Logs an error to the console if something goes wrong.
 */
export async function getAll(req: AppAuthenticatedRequest, res: Response) {
  try {
    const allUsers = await appUserService.getAll()

    return formattedSuccessResponse(res, 'All app users.', allUsers, 'users')
  } catch (error: AnyType) {
    if(getEnvVar('APP_ENV'))
      console.log('getAll', error)
    if (error instanceof CustomException)
      return formattedErrorResponse(res, error.message, error.statusCode)

    return formattedErrorResponse(res)
  }
}

/**
 * Find single user by Id from the "users" table
 *
 * @async
 * @function findUserById
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} Responds with JSON containing the user(if found) or null, and status message.
 * @throws {Error} Logs an error to the console if something goes wrong.
 */
export async function findUserById(req: AppAuthenticatedRequest, res: Response) {
  try {
    const id = req.params.id
    const user = await appUserService.findById(id)

    return formattedSuccessResponse(res, 'User found.', user, 'user')
  } catch (error: AnyType) {
    if(getEnvVar('APP_ENV'))
      console.log('getAll', error)
    if (error instanceof CustomException)
      return formattedErrorResponse(res, error.message, error.statusCode)

    return formattedErrorResponse(res)
  }
}

/**
 * Find users by an array of Ids from the "users" table
 *
 * @async
 * @function findUsersById
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} Responds with JSON containing the user(if found) or null, and status message.
 * @throws {Error} Logs an error to the console if something goes wrong.
 */
export async function findUsersByIds(req: AppAuthenticatedRequest, res: Response) {
  try {
    const ids = req.body.ids
    const allUsersByIds = await appUserService.findByIds(ids)

    return formattedSuccessResponse(res, 'App users by Ids.', allUsersByIds, 'users')
  } catch (error: AnyType) {
    if(getEnvVar('APP_ENV'))
      console.log('getAll', error)
    if (error instanceof CustomException)
      return formattedErrorResponse(res, error.message, error.statusCode)

    return formattedErrorResponse(res)
  }
}

/**
 * Creates a new user in the database.
 *
 * Validates the incoming request body, hashes the password, and inserts a new user record into the `users` table.
 *
 * @async
 * @function createAppUser
 * @param {import('express').Request} req - The Express request object, expected to contain validated user data in the body.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} Responds with JSON containing the created user and status message.
 * @throws {Error} Logs an error to the console if the insert fails.
 */
export async function createAppUser(req: AppAuthenticatedRequest, res: Response) {
  try {
    // const tx = await db.transaction();

    const newUser = await appUserService.storeAppUser(req.body)

    // await tx.commit();

    return formattedSuccessResponse(res, 'Created App User.', newUser, 'user', 201)
  } catch (error: AnyType) {
    if(getEnvVar('APP_ENV')) 
      console.log('createAppUser', error)
    if (error instanceof CustomException)
      return formattedErrorResponse(res, error.message, error.statusCode)

    return formattedErrorResponse(res)
  }
}

/**
 * Updates a user in the database.
 *
 * Validates the incoming request body, hashes the password, and inserts a new user record into the `users` table.
 *
 * @async
 * @function updateAppUser
 * @param {import('express').Request} req - The Express request object, expected to contain validated user data in the body.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} Responds with JSON containing the created user and status message.
 * @throws {Error} Logs an error to the console if the insert fails.
 */
export async function updateAppUser(req: AppAuthenticatedRequest, res: Response) {
  try {
    const userId = req.params.id

    const updatedUser = await appUserService.updateAppUser(req.body, userId)

    return formattedSuccessResponse(res, 'Updated App User.', updatedUser, 'user')
  } catch (error: AnyType) {
    if(getEnvVar('APP_ENV')) 
      console.log('updateAppUser', error);
    if (error instanceof CustomException)
      return formattedErrorResponse(res, error.message, error.statusCode)

    return formattedErrorResponse(res)
  }
}

/**
 * Updates a user in the database.
 *
 * Validates the incoming request body, hashes the password, and inserts a new user record into the `users` table.
 *
 * @async
 * @function deleteAppUser
 * @param {import('express').Request} req - The Express request object, expected to contain validated user data in the body.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} Responds with JSON containing the created user and status message.
 * @throws {Error} Logs an error to the console if the insert fails.
 */
export async function deleteAppUser(req: AppAuthenticatedRequest, res: Response) {
  try {
    const userId = req.params.id

    const updatedUser = await appUserService.updateAppUser(req.body, userId)

    return formattedSuccessResponse(res, 'Updated App User.', updatedUser, 'user')
  } catch (error: AnyType) {
    if(getEnvVar('APP_ENV')) 
      console.log('updateAppUser', error);
    if (error instanceof CustomException)
      return formattedErrorResponse(res, error.message, error.statusCode)

    return formattedErrorResponse(res)
  }
}