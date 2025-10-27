import { z } from 'zod';
import { AppUserService } from '../services/admin/app-user.services';
import { CourseService } from '../services/admin/course.services';

const appUserService = new AppUserService()
const courseService = new CourseService()

const courseIdRule = z.string({ required_error: 'Course is required' })
                        .trim()
                        .max(255, { message: 'Course id cannot exceed 255 characters.' })

export const enrollAppUserToCourseSchema = z.object({
  appUserId: z
    .string({ required_error: 'App user is required' })
    .trim()
    .max(255, { message: 'App user id cannot exceed 255 characters.' }),
  courseIds: z.array(courseIdRule, {required_error: 'Courses is required.'}),
}).superRefine(async (data, ctx) => {
  const { appUserId, courseIds } = data;

  const appUserExists = await appUserService.userExistsById(appUserId)
  if (!appUserExists) {
    ctx.addIssue({
      code: 'custom',
      path: ['appUserId'],
      message: 'User not found.',
    });
  }

  let courseNotFound = false
  // let alreadyEnrolled = false
  for (let i = 0; i < courseIds.length; i++) {
    const courseId = courseIds[i];
    const courseExists = await courseService.courseExistsById(courseId)
    if (!courseExists && !courseNotFound) {
      ctx.addIssue({
        code: 'custom',
        path: ['courseIds'],
        message: 'One or more courses not found.',
      });
      courseNotFound = true
    }

    // const appUserCourseExists = await appUserCourseService.appUserCourseExistsByAppUserIdAndCourseId(appUserId, courseId)
    // if (appUserCourseExists && !alreadyEnrolled) {
    //   ctx.addIssue({
    //     code: 'custom',
    //     path: ['appUserIds'],
    //     message: 'User is already enrolled to one or more courses.',
    //   });
  
    //   ctx.addIssue({
    //     code: 'custom',
    //     path: ['courseIds'],
    //     message: 'User is already enrolled to one or more courses.',
    //   });
    //   alreadyEnrolled = true
    // }
  }
});