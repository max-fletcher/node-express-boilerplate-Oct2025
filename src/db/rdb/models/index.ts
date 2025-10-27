import { AdminUserModel } from './admin-users.model';
import { AppUserModel } from './app-user.model';
import { AppUserOTPModel } from './app-user-otp.model';
import { CourseModel } from './course.model';
import { DayModel } from './days.model';
import { LessonModel } from './lesson.model';
import { FlashCardModel } from './flash-card.model';
import { AppUserCourseModel } from './app-user-course.model';
import { FlashCardViewedModel } from './flash-card-viewed.model';
import { TimeSpentModel } from './time-spent.model';
import { LoginHistoryModel } from './login-history.model';
import { LanguageModel } from './language.model';


// LANGUAGE ASSOCIATIONS
LanguageModel.hasMany(CourseModel, {
  as: 'course',
  foreignKey: 'languageId',
});
CourseModel.belongsTo(LanguageModel, {
  as: 'language',
  foreignKey: 'languageId',
});

LanguageModel.hasMany(CourseModel, {
  as: 'target_course',
  foreignKey: 'targetLanguageId',
});
CourseModel.belongsTo(LanguageModel, {
  as: 'target_language',
  foreignKey: 'targetLanguageId',
});


// ADMIN USER ASSOCIATIONS
AdminUserModel.hasMany(AppUserModel, {
  as: 'deleted_app_user',
  foreignKey: 'deletedBy',
});
AppUserModel.belongsTo(AdminUserModel, {
  as: 'deleted_by',
  foreignKey: 'deletedBy',
});

AdminUserModel.hasMany(CourseModel, {
  as: 'updated_courses',
  foreignKey: 'updatedBy',
});
CourseModel.belongsTo(AdminUserModel, {
  as: 'admin_user',
  foreignKey: 'updatedBy',
});

AdminUserModel.hasMany(CourseModel, {
  as: 'deleted_courses',
  foreignKey: 'deletedBy',
});
CourseModel.belongsTo(AdminUserModel, {
  as: 'deleted_by',
  foreignKey: 'deletedBy',
});

AdminUserModel.hasMany(DayModel, {
  as: 'updated_days',
  foreignKey: 'updatedBy',
});
DayModel.belongsTo(AdminUserModel, {
  as: 'admin_user',
  foreignKey: 'updatedBy',
});

AdminUserModel.hasMany(DayModel, {
  as: 'deleted_days',
  foreignKey: 'deletedBy',
});
DayModel.belongsTo(AdminUserModel, {
  as: 'deleted_by',
  foreignKey: 'deletedBy',
});

AdminUserModel.hasMany(LessonModel, {
  as: 'updated_lessons',
  foreignKey: 'updatedBy',
});
LessonModel.belongsTo(AdminUserModel, {
  as: 'admin_user',
  foreignKey: 'updatedBy',
});

AdminUserModel.hasMany(LessonModel, {
  as: 'deleted_lessons',
  foreignKey: 'deletedBy',
});
LessonModel.belongsTo(AdminUserModel, {
  as: 'deleted_by',
  foreignKey: 'deletedBy',
});

AdminUserModel.hasMany(FlashCardModel, {
  as: 'deleted_flash_card',
  foreignKey: 'deletedBy',
});
FlashCardModel.belongsTo(AdminUserModel, {
  as: 'deleted_by',
  foreignKey: 'deletedBy',
});


// COURSE ASSOCIATIONS
CourseModel.hasMany(DayModel, {
  as: 'days',
  foreignKey: 'courseId',
});
DayModel.belongsTo(CourseModel, {
  as: 'course',
  foreignKey: 'courseId',
});


// FLASH CARDS ASSOCIATIONS
DayModel.hasMany(LessonModel, {
  as: 'lessons',
  foreignKey: 'dayId',
});
LessonModel.belongsTo(DayModel, {
  as: 'day',
  foreignKey: 'dayId',
});


// DAY ASSOCIATIONS
LessonModel.hasMany(FlashCardModel, {
  as: 'flash_cards',
  foreignKey: 'lessonId',
});
FlashCardModel.belongsTo(LessonModel, {
  as: 'lesson',
  foreignKey: 'lessonId',
});


// APP USER COURSE ASSOCIATIONS
CourseModel.hasMany(AppUserCourseModel, {
  as: 'user_courses',
  foreignKey: 'courseId',
});
AppUserCourseModel.belongsTo(CourseModel, {
  as: 'course',
  foreignKey: 'courseId',
});

AppUserModel.hasMany(AppUserCourseModel, {
  as: 'user_courses',
  foreignKey: 'appUserId',
});
AppUserCourseModel.belongsTo(AppUserModel, {
  as: 'app_user',
  foreignKey: 'appUserId',
});


// APP USER COURSE ASSOCIATIONS
FlashCardModel.hasMany(FlashCardViewedModel, {
  as: 'flash_cards_viewed',
  foreignKey: 'flashCardId',
});
FlashCardViewedModel.belongsTo(FlashCardModel, {
  as: 'flash_card',
  foreignKey: 'flashCardId',
});


// FLASH CARD VIEWED ASSOCIATIONS
AppUserModel.hasMany(FlashCardViewedModel, {
  as: 'app_user_flash_cards_viewed',
  foreignKey: 'appUserId',
});
FlashCardViewedModel.belongsTo(AppUserModel, {
  as: 'app_user',
  foreignKey: 'appUserId',
});


// TIME SPENT ASSOCIATIONS
AppUserModel.hasOne(TimeSpentModel, {
  as: 'time_spent',
  foreignKey: 'appUserId',
});
TimeSpentModel.belongsTo(AppUserModel, {
  as: 'app_user',
  foreignKey: 'appUserId',
});

// LOGIN HISTORY ASSOCIATIONS
AppUserModel.hasMany(LoginHistoryModel, {
  as: 'login_histories',
  foreignKey: 'appUserId',
});
LoginHistoryModel.belongsTo(AppUserModel, {
  as: 'app_user',
  foreignKey: 'appUserId',
});

export {
  AppUserModel,
  AdminUserModel,
  AppUserOTPModel,
  CourseModel,
  DayModel,
  LessonModel,
  AppUserCourseModel,
  // DayCompletedModel,
  // LessonCompletedModel,
  FlashCardViewedModel,
  TimeSpentModel,
  LoginHistoryModel,
  LanguageModel,
};
