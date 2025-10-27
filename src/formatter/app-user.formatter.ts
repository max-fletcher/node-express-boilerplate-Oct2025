import { AppUserCoursesWithCourseForAdminViewSingleAppUser, AppUserCourseWithCourseAndTimestamps } from '../types/app-user-course.type';
import { AdminViewSingleAppUserWithAppUserCoursesWithCourse, AppUserWithAppUserCoursesWithCourse, AppUserWithCourses, AppUserWithCoursesForAdminViewSingleAppUser } from '../types/app-user.type';

export function formatAdminViewSingleAppUserWithCourses(data: AdminViewSingleAppUserWithAppUserCoursesWithCourse): AppUserWithCoursesForAdminViewSingleAppUser {

  const formattedData = {
    id: data.id,
    phoneNumber: data.phoneNumber,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    streak: data.streak,
    avatarUrl: data.avatarUrl,
    isNewUser: data.isNewUser,
    lastLoginAt: data.lastLoginAt,
    deletedAt: data.deletedAt,
    deletedBy: data.deletedBy,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    courses: data.user_courses.map((userCourse: AppUserCoursesWithCourseForAdminViewSingleAppUser) => {
      return {
        id: userCourse.course.id,
        title: userCourse.course.title,
      }
    })
  };

  return formattedData;
}

export function formatAppUserWithCourses(data: AppUserWithAppUserCoursesWithCourse): AppUserWithCourses {

  const formattedData = {
    id: data.id,
    phoneNumber: data.phoneNumber,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    streak: data.streak,
    avatarUrl: data.avatarUrl,
    isNewUser: data.isNewUser,
    lastLoginAt: data.lastLoginAt,
    deletedAt: data.deletedAt,
    deletedBy: data.deletedBy,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    courses: data.user_courses.map((userCourse: AppUserCourseWithCourseAndTimestamps) => {
      return {
        id: userCourse.course.id,
        title: userCourse.course.title,
        description: userCourse.course.description,
        totalDays: userCourse.course.totalDays,
        language: {
          id: userCourse.course.language.id,
          name: userCourse.course.language.name,
        },
        targetLanguage: {
          id: userCourse.course.target_language.id,
          name: userCourse.course.target_language.name,
        },
        difficulty: userCourse.course.difficulty,
        imagePath: userCourse.course.imagePath,
        estimatedHours: userCourse.course.estimatedHours,
        updatedBy: userCourse.course.updatedBy,
        deletedAt: userCourse.course.deletedAt,
        deletedBy: userCourse.course.deletedBy,
        createdAt: userCourse.course.createdAt,
        updatedAt: userCourse.course.updatedAt,
      }
    })
  };

  return formattedData;
}
