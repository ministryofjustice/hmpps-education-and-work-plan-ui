import type { Sessions, SessionSearch, SessionsSummary } from 'viewModels'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import toSessionsSummary from '../data/mappers/sessionsSummaryMapper'
import logger from '../../logger'
import SessionStatusValue from '../enums/sessionStatusValue'
import toPrisonerSessions from '../data/mappers/prisonerSessionMapper'
import SortOrder from '../enums/sortDirection'
import SessionSortBy from '../enums/sessionSortBy'
import toSearchSortDirection from '../data/mappers/searchSortDirectionMapper'
import toSessionSearchSortField from '../data/mappers/sessionSearchSortFieldMapper'
import SessionTypeValue from '../enums/sessionTypeValue'
import { toSessionSearch } from '../data/mappers/sessionSearchMapper'

export default class SessionService {
  constructor(private readonly educationAndWorkPlanClient: EducationAndWorkPlanClient) {}

  async getSessionsSummary(prisonId: string, username: string): Promise<SessionsSummary> {
    try {
      const sessionSummaryResponse = await this.educationAndWorkPlanClient.getSessionSummary(prisonId, username)
      return toSessionsSummary(sessionSummaryResponse)
    } catch (error) {
      logger.error(`Error retrieving Sessions Summary for prison [${prisonId}] from Education And Work Plan API`, error)
      throw error
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

  async searchSessionsInPrison(
    prisonId: string,
    username: string,
    page: number,
    pageSize: number,
    sortBy: SessionSortBy,
    sortOrder: SortOrder,
    sessionStatusType?: SessionStatusValue,
    prisonerNameOrNumber?: string,
    sessionType?: SessionTypeValue,
  ): Promise<SessionSearch> {
    const searchSortField = toSessionSearchSortField(sortBy)
    const searchSortDirection = toSearchSortDirection(sortOrder)

    return toSessionSearch(
      await this.educationAndWorkPlanClient.searchSessionsByPrison(
        prisonId,
        username,
        sessionStatusType,
        prisonerNameOrNumber,
        sessionType,
        page,
        pageSize,
        searchSortField,
        searchSortDirection,
      ),
      {
        sortBy,
        sortOrder,
        searchTerm: prisonerNameOrNumber,
        sessionStatusType,
        sessionType,
      },
    )
  }
}
