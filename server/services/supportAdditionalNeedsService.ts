import type { ChallengeResponseDto, ConditionsList, StrengthsList, SupportStrategyResponseDto } from 'dto'
import SupportAdditionalNeedsApiClient from '../data/supportAdditionalNeedsApiClient'
import logger from '../../logger'
import { toConditionsList } from '../data/mappers/conditionDtoMapper'
import { toSupportStrategyResponseDtos } from '../data/mappers/supportStrategyResponseDtoMapper'
import { toStrengthsList } from '../data/mappers/strengthResponseDtoMapper'
import { toChallengeDto } from '../data/mappers/challengeDtoMapper'

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

  async getSupportStrategies(username: string, prisonNumber: string): Promise<Array<SupportStrategyResponseDto>> {
    try {
      const supportStrategyListResponse = await this.supportAdditionalNeedsApiClient.getSupportStrategies(
        prisonNumber,
        username,
      )
      return toSupportStrategyResponseDtos(supportStrategyListResponse)
    } catch (e) {
      logger.error(`Error retrieving Support Strategies for [${prisonNumber}]`, e)
      throw e
    }
  }

  async getStrengths(username: string, prisonNumber: string): Promise<StrengthsList> {
    try {
      const strengthListResponse = await this.supportAdditionalNeedsApiClient.getStrengths(prisonNumber, username)
      return toStrengthsList(strengthListResponse, prisonNumber)
    } catch (e) {
      logger.error(`Error getting Strengths for [${prisonNumber}]`, e)
      throw e
    }
  }

  async getChallenges(username: string, prisonNumber: string): Promise<Array<ChallengeResponseDto>> {
    try {
      const challengeListResponse = await this.supportAdditionalNeedsApiClient.getChallenges(prisonNumber, username)
      return toChallengeDto(challengeListResponse)
    } catch (e) {
      logger.error(`Error getting Challenges for [${prisonNumber}]`, e)
      throw e
    }
  }
}
