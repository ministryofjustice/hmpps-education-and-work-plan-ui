import type { ConditionsList } from 'dto'
import SupportAdditionalNeedsApiClient from '../data/supportAdditionalNeedsApiClient'
import logger from '../../logger'
import { toConditionsList } from '../data/mappers/conditionDtoMapper'

export default class SupportAdditionalNeedsService {
  constructor(private readonly supportAdditionalNeedsApiClient: SupportAdditionalNeedsApiClient) {}

  async getConditions(username: string, prisonNumber: string): Promise<ConditionsList> {
    try {
      const conditionListResponse = await this.supportAdditionalNeedsApiClient.getConditions(prisonNumber, username)
      return toConditionsList(conditionListResponse, prisonNumber)
    } catch (e) {
      logger.error(`Error getting Conditions for [${prisonNumber}]`, e)
      throw e
    }
  }
}
