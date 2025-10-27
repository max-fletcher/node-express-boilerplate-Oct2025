import { Response } from 'express';
import { CustomException } from '../../errors/CustomException.error';
import { AppAuthenticatedRequest } from '../../types/authenticate.type';
// import { AppUserService } from '../../services/admin/app-user.services';
import { users } from '../../db/rdb/schema';
import { db } from '../../app';
import { hashPassword } from '../../utils/password.utils';
import { formattedErrorResponse, formattedSuccessResponse } from '../../formatter/formattedResponse.formatter';
import { AnyType } from '../../types/common.type';
import { getEnvVar } from '../../utils/common.utils';
import { eq, sql } from 'drizzle-orm';

// const appUserService = new AppUserService();

/**
 * Fetch all data from the "users" table
 *
 * @async
 * @function getAppUsers
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} Responds with JSON containing the created user and status message.
 * @throws {Error} Logs an error to the console if something goes wrong.
 */
export async function getAppUsers(req: AppAuthenticatedRequest, res: Response) {
  try {
    const allUsers = await db.select().from(users).orderBy(users.createdAt)

    return formattedSuccessResponse(res, 'All app users.', allUsers, 'users')
  } catch (error: AnyType) {
    if(getEnvVar('APP_ENV'))
      console.log('getAppUsers', error)
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
 * @param {import('express').Request} req - The Express request object, expected to contain `name`, `email`, and `password` in the body.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} Responds with JSON containing the created user and status message.
 * @throws {Error} Logs an error to the console if the insert fails.
 */
export async function createAppUser(req: AppAuthenticatedRequest, res: Response) {
  try {
    const {name, email, password} = req.body

    const [newUser] = await db.insert(users).values({
                      name: name,
                      email: email,
                      password: await hashPassword(password),
                    })
                    .returning();

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
 * @param {import('express').Request} req - The Express request object, expected to contain `name`, `email`, and `password` in the body.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} Responds with JSON containing the created user and status message.
 * @throws {Error} Logs an error to the console if the insert fails.
 */
export async function updateAppUser(req: AppAuthenticatedRequest, res: Response) {
  try {
    const userId = req.params.id
    const { password } = req.body.password

    const [updatedUser] = await db
                            .update(users)
                            .set({
                              ...req.body,
                              password: await hashPassword(password),
                              updatedAt: sql`now()`,
                            })
                            .where(eq(users.id, userId))
                            .returning({
                              id: users.id,
                              name: users.name,
                              email: users.email,
                              createdAt: users.createdAt,
                              updatedAt: users.updatedAt,
                          });


    return formattedSuccessResponse(res, 'Updated App User.', updatedUser, 'user')
  } catch (error: AnyType) {
    if(getEnvVar('APP_ENV')) 
      console.log('updateAppUser', error);
    if (error instanceof CustomException)
      return formattedErrorResponse(res, error.message, error.statusCode)

    return formattedErrorResponse(res)
  }
}