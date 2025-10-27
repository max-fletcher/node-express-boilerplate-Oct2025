import { NextFunction, Request, Response } from "express";
import { multipleFileLocalUploader } from "../middleware/fileUploadLocal.middleware";
import multer from "multer";

const appUserUploader = multipleFileLocalUploader(
  [
    { name: 'avatarUrl', maxCount: 1 },
  ],
  'users',
  5242880, // 5 MB
)

export const appUserFileUploaderMiddleware = (req: Request, res: Response, next: NextFunction) => {
  appUserUploader(req, res, function (error) {
    // console.log('appUserUploader', error);
    const statusCode = error && error.statusCode ? error.statusCode : 400
    const message = error && error.message ? error.message : 'Something went wrong.'
    if (error instanceof multer.MulterError) {
      return res.status(statusCode).json({
        error: {
          message: `Multer Error: ${message}`,
        },
        statusCode: statusCode,
      });
    }
    else if(error){
      return res.status(500).json({
        error: {
          message: `Multer Error: ${message}`,
        },
        statusCode: 500,
      });
    }

    next()
  })
}