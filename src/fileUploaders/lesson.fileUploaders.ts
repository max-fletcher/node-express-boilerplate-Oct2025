import { NextFunction, Request, Response } from "express";
import { multipleFileLocalUploader } from "../middleware/fileUploadLocal.middleware";
import multer from "multer";

const lessonUploader = multipleFileLocalUploader(
  [
    { name: 'audioIntro', maxCount: 1 },
  ],
  'lessons',
  5242880, // 5 MB
)

export const lessonFileUploaderMiddleware = (req: Request, res: Response, next: NextFunction) => {
  lessonUploader(req, res, function (error) {
    console.log('lessonUploader', error);
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