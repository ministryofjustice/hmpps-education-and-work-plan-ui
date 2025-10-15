import { asSystem, RestClient } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import type {
  ALNScreeners,
  ChallengeListResponse,
  ConditionListResponse,
  StrengthListResponse,
  SupportStrategyListResponse,
} from 'supportAdditionalNeedsApiClient'
import config from '../config'
import logger from '../../logger'
import restClientErrorHandler from './restClientErrorHandler'

export default class SupportAdditionalNeedsApiClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('Support Additional Needs API Client', config.apis.supportAdditionalNeedsApi, logger, authenticationClient)
  }

  async getChallenges(prisonNumber: string, username: string): Promise<ChallengeListResponse> {
    return this.get<ChallengeListResponse>(
      {
        path: `/profile/${prisonNumber}/challenges`,
      },
      asSystem(username),
    )
  }

  async getConditions(prisonNumber: string, username: string): Promise<ConditionListResponse> {
    return this.get<ConditionListResponse>(
      {
        path: `/profile/${prisonNumber}/conditions`,
        errorHandler: restClientErrorHandler({ ignore404: true }),
      },
      asSystem(username),
    )
  }

  async getStrengths(prisonNumber: string, username: string): Promise<StrengthListResponse> {
    return this.get<StrengthListResponse>(
      {
        path: `/profile/${prisonNumber}/strengths`,
        errorHandler: restClientErrorHandler({ ignore404: true }),
      },
      asSystem(username),
    )
  }

  async getSupportStrategies(prisonNumber: string, username: string): Promise<SupportStrategyListResponse> {
    return this.get<SupportStrategyListResponse>(
      {
        path: `/profile/${prisonNumber}/support-strategies`,
        errorHandler: restClientErrorHandler({ ignore404: true }),
      },
      asSystem(username),
    )
  }

  async getAdditionalLearningNeedsScreeners(prisonNumber: string, username: string): Promise<ALNScreeners> {
    return this.get<ALNScreeners>(
      {
        path: `/profile/${prisonNumber}/aln-screener`,
        errorHandler: restClientErrorHandler({ ignore404: true }),
      },
      asSystem(username),
    )
  }
}
