import { AppUserCourseWithCourseAndTimestamps, AppUserEnrolledCourseDetails, FormattedAppUserEnrolledCourseDetails } from '../types/app-user-course.type';
import { EnrolledCourses } from '../types/course.type';

export function formatViewEnrolledCourses(data: AppUserCourseWithCourseAndTimestamps[]): EnrolledCourses[] {
  const formattedData =
    data.map((userCourse: AppUserCourseWithCourseAndTimestamps) => {
      let lessonCount = 0
      userCourse.course.days.map((day) => {
        lessonCount += day.lessons.length
      })
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
        lessonCount: lessonCount,
        createdAt: userCourse.course.createdAt,
        updatedAt: userCourse.course.updatedAt,
      }
    });

  return formattedData;
}

// PREVIOUS VERSION OF formatViewEnrolledCourseDetails FORMATTER. KEEPING THIS HERE FOR SAFEKEEPING.
export function formatViewEnrolledCourseDetails(data: AppUserEnrolledCourseDetails): FormattedAppUserEnrolledCourseDetails {
  let totalDays = 0
  let daysCompleted = 0

  const currentDate = new Date()
  const dayStartDatetime = new Date(new Date(data.createdAt).setHours(0,0,0,0))
  const dayStartDatetimeArray: Date[] = []
  for(let i = 1; i <= data.course.totalDays; i++){
    dayStartDatetimeArray.push(new Date(dayStartDatetime))
    dayStartDatetime.setDate(dayStartDatetime.getDate()+1);
  }

  const formattedData = {
    id: data.id,
    appUserId: data.appUserId,
    courseId: data.courseId,
    progress: 0,
    totalDays: 0,
    daysCompleted: 0,
    course: {
      id: data.course.id,
      title: data.course.title,
      description: data.course.description,
      totalDays: data.course.totalDays,
      difficulty: data.course.difficulty,
      imagePath: data.course.imagePath,
      estimatedHours: data.course.estimatedHours,
      days: data.course.days.map((day) => {
        const totalLessonsCount = day.lessons.length
        let lessonsCompleted = 0
        totalDays++

        let dayData = {
          id: day.id,
          courseId: day.courseId,
          dayNumber: day.dayNumber,
          title: day.title,
          description: day.description,
          completed: false,
          unlocked: currentDate >= dayStartDatetimeArray[day.dayNumber-1],
          lessons: day.lessons.map((lesson) => {
            const totalFlashCardCount = lesson.flash_cards.length
            let flashCardsCompleted = 0

            let lessonData = {
              id: lesson.id,
              dayId: lesson.dayId,
              lessonOrder: lesson.lessonOrder,
              title: lesson.title,
              description: lesson.description,
              estimatedMinutes: lesson.estimatedMinutes,
              difficulty: lesson.difficulty,
              completed: false,
              flash_cards: lesson.flash_cards.map((flashCard) => {
                if(flashCard.flash_cards_viewed.length > 0)
                  flashCardsCompleted++

                const flashCardData = {
                  id: flashCard.id,
                  cardOrder: flashCard.cardOrder,
                  flashCardViewed: flashCard.flash_cards_viewed.length > 0 ? true : false,
                }

                return flashCardData
              })
            }

            if(totalFlashCardCount === flashCardsCompleted){
              lessonData = {...lessonData, completed: true }
              lessonsCompleted++
            }

            return lessonData
          })
        }

        if(totalLessonsCount === lessonsCompleted){
          dayData = {...dayData, completed: true }
          daysCompleted++
        }

        return dayData
      })
    }
  }

  const progress = daysCompleted/totalDays * 100
  formattedData.progress = Math.round(progress)
  formattedData.totalDays = totalDays
  formattedData.daysCompleted = daysCompleted

  return formattedData;
}