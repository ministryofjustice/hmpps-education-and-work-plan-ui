/* eslint-disable import/first */
/*
 * Do appinsights first as it does some magic instrumentation work, i.e. it affects other 'require's
 * In particular, applicationinsights automatically collects bunyan logs
 */
import { initialiseAppInsights, buildAppInsightsClient } from '../utils/azureAppInsights'
import applicationInfoSupplier from '../applicationInfo'

const applicationInfo = applicationInfoSupplier()
initialiseAppInsights()
buildAppInsightsClient(applicationInfo)

// eslint-disable-next-line import/order
import { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import HmppsAuthClient from './hmppsAuthClient'
import ManageUsersApiClient from './manageUsersApiClient'
import { createRedisClient } from './redisClient'
import RedisTokenStore from './tokenStore/redisTokenStore'
import InMemoryTokenStore from './tokenStore/inMemoryTokenStore'
import config from '../config'
import HmppsAuditClient from './hmppsAuditClient'
import PrisonerSearchClient from './prisonerSearchClient'
import EducationAndWorkPlanClient from './educationAndWorkPlanClient'
import CuriousClient from './curiousClient'
import CiagInductionClient from './ciagInductionClient'
import PrisonRegisterStore from './prisonRegisterStore/prisonRegisterStore'
import InMemoryPrisonRegisterStore from './prisonRegisterStore/inMemoryPrisonRegisterStore'
import RedisPrisonRegisterStore from './prisonRegisterStore/redisPrisonRegisterStore'
import PrisonRegisterClient from './prisonRegisterClient'
import JourneyDataStore from './journeyDataStore/journeyDataStore'
import InMemoryJourneyDataStore from './journeyDataStore/inMemoryJourneyDataStore'
import RedisJourneyDataStore from './journeyDataStore/redisJourneyDataStore'
import PrisonerSearchStore from './prisonerSearchStore/prisonerSearchStore'
import InMemoryPrisonerSearchStore from './prisonerSearchStore/inMemoryPrisonerSearchStore'
import RedisPrisonerSearchStore from './prisonerSearchStore/redisPrisonerSearchStore'
import logger from '../../logger'

type RestClientBuilder<T> = (token: string) => T

export const dataAccess = () => {
  const tokenStore = config.redis.enabled ? new RedisTokenStore(createRedisClient()) : new InMemoryTokenStore()
  const hmppsAuthClient = new HmppsAuthClient(tokenStore)
  const hmppsAuthenticationClient = new AuthenticationClient(config.apis.hmppsAuth, logger, tokenStore)
  const curiousApiAuthClient = new AuthenticationClient(
    {
      ...config.apis.hmppsAuth,
      systemClientId: config.apis.hmppsAuth.curiousClientId,
      systemClientSecret: config.apis.hmppsAuth.curiousClientSecret,
    },
    logger,
    tokenStore,
  )

  return {
    applicationInfo,
    hmppsAuthClient,
    hmppsAuthenticationClient,
    hmppsAuditClient: new HmppsAuditClient(config.sqs.audit),
    manageUsersApiClient: new ManageUsersApiClient(),
    prisonerSearchStore: config.redis.enabled
      ? new RedisPrisonerSearchStore(createRedisClient('prisonerSearch:'))
      : new InMemoryPrisonerSearchStore(),
    prisonerSearchClient: new PrisonerSearchClient(),
    educationAndWorkPlanClient: new EducationAndWorkPlanClient(),
    curiousClient: new CuriousClient(curiousApiAuthClient),
    ciagInductionClient: new CiagInductionClient(),
    prisonRegisterStore: config.redis.enabled
      ? new RedisPrisonRegisterStore(createRedisClient('prisonRegister:'))
      : new InMemoryPrisonRegisterStore(),
    prisonRegisterClient: new PrisonRegisterClient(hmppsAuthenticationClient),
    journeyDataStore: config.redis.enabled
      ? new RedisJourneyDataStore(createRedisClient('journeyData:'))
      : new InMemoryJourneyDataStore(),
  }
}

export type DataAccess = ReturnType<typeof dataAccess>

export {
  HmppsAuthClient,
  AuthenticationClient,
  type RestClientBuilder,
  HmppsAuditClient,
  ManageUsersApiClient,
  type PrisonerSearchStore,
  PrisonerSearchClient,
  EducationAndWorkPlanClient,
  CuriousClient,
  CiagInductionClient,
  type PrisonRegisterStore,
  PrisonRegisterClient,
  type JourneyDataStore,
}
