import type { Sessions, SessionsSummary } from 'viewModels'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import toSessionsSummary from '../data/mappers/sessionsSummaryMapper'
import logger from '../../logger'
import SessionStatusValue from '../enums/sessionStatusValue'
import toPrisonerSessions from '../data/mappers/prisonerSessionMapper'

export default class SessionService {
  constructor(private readonly educationAndWorkPlanClient: EducationAndWorkPlanClient) {}

  async getSessionsSummary(prisonId: string, username: string): Promise<SessionsSummary> {
    try {
      const sessionSummaryResponse = await this.educationAndWorkPlanClient.getSessionSummary(prisonId, username)
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
      const sessionsResponse = await this.educationAndWorkPlanClient.getSessions(prisonNumbers, username, status)
      return toPrisonerSessions(sessionsResponse)
    } catch (error) {
      logger.error(`Error retrieving prisoner Sessions from Education And Work Plan API`, error)
      return {
        problemRetrievingData: true,
      } as Sessions
    }
  }
}
