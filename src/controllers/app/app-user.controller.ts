import { Response } from 'express';
import { CustomException } from '../../errors/CustomException.error';
import { AppAuthenticatedRequest } from '../../types/authenticate.type';
// import { AppUserService } from '../../services/admin/app-user.services';
import { users } from '../../db/rdb/schema';
import { db } from '../../app';
import { hashPassword } from '../../utils/password.utils';

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
      const allUsers = await db.select().from(users);
  
    return res.json({
      data: {
        message: 'All app.',
        user: allUsers,
      },
      statusCode: 200,
    });
  } catch (error) {
    // console.log('getAppUsers', error);
    if (error instanceof CustomException) {
      return res.status(error.statusCode).json({
        error: {
          message: error.message,
        },
        code: error.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      statusCode: 500,
    });
  }
}

/**
 * Creates a new application user in the database.
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

      const newUser = await db.insert(users).values({
                        name: name,
                        email: email,
                        password: await hashPassword(password),
                      })
                      .returning();
  
    return res.json({
      data: {
        message: 'Created App User.',
        user: newUser,
      },
      statusCode: 200,
    });
  } catch (error) {
    console.log('createAppUser', error);
    if (error instanceof CustomException) {
      return res.status(error.statusCode).json({
        error: {
          message: error.message,
        },
        code: error.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      statusCode: 500,
    });
  }
}