import { AppUserRepository } from "../../db/rdb/repositories/app-user.repository";
import { FlashCardViewedRepository } from "../../db/rdb/repositories/flash-card-viewed.repository";

export class HomepageService {
  private appUserRepo: AppUserRepository;
  private flashCardViewedRepo: FlashCardViewedRepository;

  constructor() {
    this.appUserRepo = new AppUserRepository();
    this.flashCardViewedRepo = new FlashCardViewedRepository();
  }

  async viewAppUserHomepage(appUserId: string) {
    const appUser =  await this.appUserRepo.findUserById(appUserId, ['id', 'streak'])
    const wordsLearned = await this.flashCardViewedRepo.getAllFlashCardViewedByAppUserCount(appUserId)

    const data = await this.flashCardViewedRepo.findFlashCardViewedByAppUserIdWithFlashCardLessonDayAndCourse(appUserId) as any // Need to define later
    let formattedContinueLearningData = null
    if(data)
      formattedContinueLearningData = {
        course: {
          id: data.flash_card.lesson.day.course.id,
          title: data.flash_card.lesson.day.course.title,
        },
        lesson: {
          id: data.flash_card.lesson.id,
          title: data.flash_card.lesson.title,
          description: data.flash_card.lesson.description,
          estimatedMinutes: data.flash_card.lesson.estimatedMinutes,
        },
      }

    return { streak: appUser.streak, wordsLearned: wordsLearned, continueLearningData: formattedContinueLearningData  }
  }
}
