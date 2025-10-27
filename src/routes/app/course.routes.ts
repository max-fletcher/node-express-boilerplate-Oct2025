import express from 'express';
import { validateRequestBody } from '../../utils/validatiion.utils';
import { JwtMiddleware } from '../../middleware/jwt.middleware';
import { viewAllanguages, viewEnrolledCourseDetails, viewEnrolledCourses } from '../../controllers/app/course.controller';
import { viewEnrolledCoursesFilterSchema } from '../../schema/app-user-enrolled-course.schema';

const AppCourseRouter = express.Router();
const jwtMiddleware = new JwtMiddleware();

// Define Routes
AppCourseRouter.get('/view-all-languages', jwtMiddleware.verifyAppUserToken, viewAllanguages);
AppCourseRouter.get('/view-enrolled-courses', jwtMiddleware.verifyAppUserToken, validateRequestBody(viewEnrolledCoursesFilterSchema), viewEnrolledCourses);
AppCourseRouter.get('/view-enrolled-course-details/:courseId', jwtMiddleware.verifyAppUserToken, viewEnrolledCourseDetails);

export { AppCourseRouter };
