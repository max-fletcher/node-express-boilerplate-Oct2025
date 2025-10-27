import { NextFunction, Request, Response } from "express";
import { multipleFileLocalUploader } from "../middleware/fileUploadLocal.middleware";
import multer from "multer";

const flashCardUploader = multipleFileLocalUploader(
  [
    { name: 'imageUrl', maxCount: 1 },
    { name: 'audioUrl', maxCount: 1 },
  ],
  'flash_cards',
  6291456, // 6 MB
)

export const flashCardFileUploaderMiddleware = (req: Request, res: Response, next: NextFunction) => {
  flashCardUploader(req, res, function (error) {
    // console.log('flashCardUploader', error);
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