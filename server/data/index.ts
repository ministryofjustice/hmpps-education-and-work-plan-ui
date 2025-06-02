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

type RestClientBuilder<T> = (token: string) => T

export const dataAccess = () => ({
  applicationInfo,
  hmppsAuthClient: new HmppsAuthClient(
    config.redis.enabled ? new RedisTokenStore(createRedisClient()) : new InMemoryTokenStore(),
  ),
  hmppsAuditClient: new HmppsAuditClient(config.sqs.audit),
  manageUsersApiClient: new ManageUsersApiClient(),
  prisonerSearchStore: config.redis.enabled
    ? new RedisPrisonerSearchStore(createRedisClient('prisonerSearch:'))
    : new InMemoryPrisonerSearchStore(),
  prisonerSearchClient: new PrisonerSearchClient(),
  educationAndWorkPlanClient: new EducationAndWorkPlanClient(),
  curiousClient: new CuriousClient(),
  ciagInductionClient: new CiagInductionClient(),
  prisonRegisterStore: config.redis.enabled
    ? new RedisPrisonRegisterStore(createRedisClient('prisonRegister:'))
    : new InMemoryPrisonRegisterStore(),
  prisonRegisterClient: new PrisonRegisterClient(),
  journeyDataStore: config.redis.enabled
    ? new RedisJourneyDataStore(createRedisClient('journeyData:'))
    : new InMemoryJourneyDataStore(),
})

export type DataAccess = ReturnType<typeof dataAccess>

export {
  HmppsAuthClient,
  RestClientBuilder,
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
