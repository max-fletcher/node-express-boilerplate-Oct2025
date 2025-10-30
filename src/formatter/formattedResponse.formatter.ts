import { Response } from "express"
import { AnyType } from "../types/types/common.type";

/**
 * Send a consistent, formatted success response.
 * @param res - Express response object
 * @param message - Message describing the action
 * @param dataKey - Key name for the response data (e.g., 'user', 'users')
 * @param data - The payload data
 * @param statusCode - HTTP status code (defaults to 200)
 */
export function formattedSuccessResponse(res: Response, message: string, data?: AnyType, dataKey?: string, statusCode?: number){
  return res.status(statusCode ?? 200).json({
    data: {
      message: message,
      [dataKey ?? data]: data,
    },
    code: statusCode ?? 200,
  });
}

/**
 * Send a consistent, formatted success response.
 * @param res - Express response object
 * @param message - Message describing the action
 * @param data - The payload data
 * @param statusCode - HTTP status code (defaults to 200)
 */
export function formattedSuccessResponseDataObj(res: Response, message: string, data?: AnyType, statusCode?: number){
  return res.status(statusCode ?? 200).json({
    data: {
      message: message,
      data,
    },
    code: statusCode ?? 200,
  });
}

/**
 * Send a consistent, formatted error response.
 * @param res - Express response object
 * @param message - Message describing the error
 * @param statusCode - HTTP status code (defaults to 500)
 */
export function formattedErrorResponse(res: Response, message?: string, statusCode?: number){
  return res.status(statusCode ?? 500).json({
    error: {
      message: message ?? 'Something went wrong! Please try again.',
    },
    code: statusCode ?? 500,
  });
}
