import { FlashCardViewedRepository } from "../../db/rdb/repositories/flash-card-viewed.repository";
import { LoginHistoryRepository } from "../../db/rdb/repositories/login-history.repository";
import { datetimeYMDHis } from "../../utils/datetime.utils";

export class AppUserStatisticsService {
  private flashCardViewedRepositoryRepository: FlashCardViewedRepository;
  private loginHistoryRepo: LoginHistoryRepository;

  constructor() {
    this.flashCardViewedRepositoryRepository = new FlashCardViewedRepository();
    this.loginHistoryRepo = new LoginHistoryRepository();
  }

  async getStatistics(appUserId: string) {
    const wordsLearnedCount = await this.flashCardViewedRepositoryRepository.getAllFlashCardViewedByAppUserCount(appUserId);

    const afterDate = datetimeYMDHis(null, 'days', 7, 'before', 'startOfDay');
    const wordsLearned = await this.flashCardViewedRepositoryRepository.getFlashCardViewedByAppUser(appUserId, afterDate);
    const loginHistories = await this.loginHistoryRepo.getLoginHistoryForAppUser(appUserId, afterDate)

    return { wordsLearnedCount, wordsLearned, loginHistories }
  }
}
