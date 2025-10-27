import { InferAttributes, InferCreationAttributes } from 'sequelize'
import { AppUserCourseModel } from '../db/rdb/models'
import { CourseWithTimestamps } from './course.type'
import { DayWithTimestamps } from './day.type'
import { LessonWithTimestamps } from './lesson.type'

export type AppUserCourse = InferAttributes<AppUserCourseModel>

export type StoreAppUserCourse = InferCreationAttributes<AppUserCourseModel> & {
  id: string
  appUserId: string
  courseId: string
  updatedBy: string
  createdAt?: string | null
  updatedAt?: string | null
}

export type StoreAppUserCourseData = Omit<StoreAppUserCourse, 'id'>

export type BulkStoreAppUserCourseData = Omit<StoreAppUserCourse, 'id'> & {
  id?: string
}

export type AppUserCourseWithCourseAndTimestamps = AppUserCourse & {
  createdAt: string
  updatedAt: string
  course: CourseWithTimestamps & {
    language: {
      id: string,
      name: string,
    },
    target_language: {
      id: string,
      name: string,
    },
    days: { 
      id: string 
      lessons: {
        id: string 
      }[]
    }[]
  }
}

export type AppUserCoursesWithCourseForAdminViewSingleAppUser = {
  id: string
  appUserId: string
  courseId: string 
  course: {
    id: string
    title: string
    language: {
      id: string
      name: string
    }
  }
}

export type UpdateAppUserCourseData = Partial<StoreAppUserCourseData>


// FOR ENROLLED COURSE DETAILS
export type LessonsForEnrollCourseDetails = Omit<LessonWithTimestamps, 'audioIntro'|'updatedBy'|'deletedAt'|'deletedBy'|'createdAt'|'updatedAt'> & {
  flash_cards: 
    {
      id: string
      cardOrder: number
      flash_cards_viewed: {
        id: string
      }[]
    }[],
}
export type DaysForEnrollCourseDetails = Omit<DayWithTimestamps, 'updatedBy'|'deletedAt'|'deletedBy'|'createdAt'|'updatedAt'> & {
  lessons: LessonsForEnrollCourseDetails[]
}

export type AppUserEnrolledCourseDetails = Omit<AppUserCourse, 'updatedBy'|'deletedAt'|'deletedBy'|'updatedAt'> & {
  createdAt: string,
  course: Omit<CourseWithTimestamps, 'languageId'|'targetLanguageId'|'updatedBy'|'deletedAt'|'deletedBy'|'createdAt'|'updatedAt'> & {
    language: {
      id: string
      name: string
    }
    targetLanguage: {
      id: string
      name: string
    }
    days: DaysForEnrollCourseDetails[]
  }
}


export type FormattedAppUserEnrolledCourseDetails = {
  id: string
  appUserId: string
  courseId: string
  progress?: number
  totalDays: number
  daysCompleted: number
  course: {
    id: string
    title: string
    description: string | null
    totalDays: number
    difficulty: string | null
    imagePath: string
    estimatedHours: number | null
    days: {
      id: string
      courseId: string
      dayNumber: number
      title: string
      description: string | null
      completed: boolean
      lessons: {
        id: string
        dayId: string
        lessonOrder: number
        title: string
        description: string | null
        estimatedMinutes: number
        difficulty: string
        completed: boolean
        flash_cards: {
          id: string
          cardOrder: number
          flashCardViewed: boolean
        }[]
      }[]
    }[]
  }
}