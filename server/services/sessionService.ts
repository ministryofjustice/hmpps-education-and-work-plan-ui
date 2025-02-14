import type { Sessions, SessionsSummary } from 'viewModels'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import { HmppsAuthClient } from '../data'
import toSessionsSummary from '../data/mappers/sessionsSummaryMapper'
import logger from '../../logger'
import SessionStatusValue from '../enums/sessionStatusValue'
import toPrisonerSessions from '../data/mappers/prisonerSessionMapper'

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

  async getSessionsInStatusForPrisoners(
    prisonNumbers: string[],
    status: SessionStatusValue,
    username: string,
  ): Promise<Sessions> {
    try {
      const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)
      const sessionsResponse = await this.educationAndWorkPlanClient.getSessions(prisonNumbers, systemToken, status)
      return toPrisonerSessions(sessionsResponse)
    } catch (error) {
      logger.error(`Error retrieving prisoner Sessions from Education And Work Plan API`, error)
      return {
        problemRetrievingData: true,
      } as Sessions
    }
  }
}
