import type { SessionsSummary } from 'viewModels'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import { HmppsAuthClient } from '../data'
import toSessionsSummary from '../data/mappers/sessionsSummaryMapper'
import logger from '../../logger'

export default class SessionService {
  constructor(
    private readonly educationAndWorkPlanClient: EducationAndWorkPlanClient,
    private readonly hmppsAuthClient: HmppsAuthClient,
  ) {}

  async getSessionsSummary(prisonId: string, username: string): Promise<SessionsSummary> {
    try {
      const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

      const sessionSummaryResponse = await this.educationAndWorkPlanClient.getSessionSummary(prisonId, systemToken)
      return toSessionsSummary(sessionSummaryResponse)
    } catch (error) {
      logger.error(`Error retrieving Sessions Summary for prison [${prisonId}] from Education And Work Plan API`, error)
      return {
        problemRetrievingData: true,
      } as SessionsSummary
    }
  }
}
