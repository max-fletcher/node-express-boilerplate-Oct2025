import { AppUserModel } from '../db/rdb/models/app-user.model';
import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { AppUserCoursesWithCourseForAdminViewSingleAppUser, AppUserCourseWithCourseAndTimestamps } from './app-user-course.type';
import { CourseWithTimestamps } from './course.type';

export type AppUser = InferAttributes<AppUserModel>;

export type AppUserWithTimeStamps = {
  id: string
  phoneNumber: string
  firstName: string
  lastName: string
  email?: string | null
  password: string
  streak: number
  xpPoints: number
  avatarUrl: string | null
  nativeLanguage: string
  learningGoal: string
  proficiencyLevel: string | null
  isNewUser: boolean
  lastLoginAt: string
  verified: string
  createdAt?: string | null
  updatedAt?: string | null
};

export type StoreAppUser = Partial<InferCreationAttributes<AppUserModel>> & {
  id: string;
  phoneNumber: string;
};

export type StoreAppUserData = Omit<StoreAppUser, 'id'>;

export type UpdateAppUserData = Partial<StoreAppUserData>;

export type AppUserGenerateToken = {
  id: string
  phoneNumber: string
  name: string | null
  email: string | null
  avatarUrl: string | null
};

export type AppUserWithTimestamps = AppUser & {
  createdAt: string
  updatedAt: string
};

export type AppUserWithAppUserCoursesWithCourse = AppUserWithTimestamps & {
  user_courses: AppUserCourseWithCourseAndTimestamps[]
};

export type AppUserWithCoursesWithLanguageAndTargetLanguage = Omit<CourseWithTimestamps, 'languageId'|'targetLanguageId'> & {
  language: {
    id: string
    name: string
  },
  targetLanguage: {
    id: string
    name: string
  },
}

export type AppUserWithCourses = AppUserWithTimestamps & {
  courses: AppUserWithCoursesWithLanguageAndTargetLanguage[]
};

// export type AppUserWithCoursesWithLanguageAndTargetLanguage = Omit<CourseWithTimestamps, 'languageId'|'targetLanguageId'> & {
//   language: string,
//   targetLanguage: string,
// }

// export type AppUserWithCourses = AppUserWithTimestamps & {
//   courses: AppUserWithCoursesWithLanguageAndTargetLanguage[]
// };

export type AdminViewSingleAppUserWithAppUserCoursesWithCourse = AppUserWithTimestamps & {
  user_courses: AppUserCoursesWithCourseForAdminViewSingleAppUser[]
};

export type AppUserWithCoursesForAdminViewSingleAppUser = AppUserWithTimestamps & {
  courses: Omit<CourseWithTimestamps, 'description'|'totalDays'|'languageId'|'targetLanguageId'|'difficulty'|'imagePath'|'estimatedHours'|'updatedBy'|'deletedAt'|'deletedBy'|'createdAt'|'updatedAt'>[]
};