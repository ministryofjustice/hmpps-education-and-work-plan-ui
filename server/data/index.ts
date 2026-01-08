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
import { AuthenticationClient, InMemoryTokenStore, RedisTokenStore } from '@ministryofjustice/hmpps-auth-clients'
import ManageUsersApiClient from './manageUsersApiClient'
import { createRedisClient } from './redisClient'
import config from '../config'
import HmppsAuditClient from './hmppsAuditClient'
import PrisonerSearchClient from './prisonerSearchClient'
import EducationAndWorkPlanClient from './educationAndWorkPlanClient'
import SupportAdditionalNeedsApiClient from './supportAdditionalNeedsApiClient'
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
import LearnerRecordsApiClient from './learnerRecordsApiClient'

type RestClientBuilder<T> = (token: string) => T

export const dataAccess = () => {
  const systemTokenStore = config.redis.enabled
    ? new RedisTokenStore(createRedisClient(), 'systemToken:')
    : new InMemoryTokenStore()
  const hmppsAuthClient = new AuthenticationClient(config.apis.hmppsAuth, logger, systemTokenStore)

  const curiousTokenStore = config.redis.enabled
    ? new RedisTokenStore(createRedisClient(), 'curiousToken:')
    : new InMemoryTokenStore()
  const curiousApiAuthClient = new AuthenticationClient(
    {
      ...config.apis.hmppsAuth,
      systemClientId: config.apis.hmppsAuth.curiousClientId,
      systemClientSecret: config.apis.hmppsAuth.curiousClientSecret,
    },
    logger,
    curiousTokenStore,
  )

  const learnerRecordsTokenStore = config.redis.enabled
    ? new RedisTokenStore(createRedisClient(), 'learnerRecordsToken:')
    : new InMemoryTokenStore()
  const learnerRecordsApiAuthClient = new AuthenticationClient(
    {
      ...config.apis.hmppsAuth,
      systemClientId: config.apis.hmppsAuth.learnerRecordsClientId,
      systemClientSecret: config.apis.hmppsAuth.learnerRecordsClientSecret,
    },
    logger,
    learnerRecordsTokenStore,
  )

  return {
    applicationInfo,
    hmppsAuditClient: new HmppsAuditClient(config.sqs.audit),
    manageUsersApiClient: new ManageUsersApiClient(hmppsAuthClient),
    prisonerSearchStore: config.redis.enabled
      ? new RedisPrisonerSearchStore(createRedisClient())
      : new InMemoryPrisonerSearchStore(),
    prisonerSearchClient: new PrisonerSearchClient(hmppsAuthClient),
    educationAndWorkPlanClient: new EducationAndWorkPlanClient(hmppsAuthClient),
    curiousClient: new CuriousClient(curiousApiAuthClient),
    ciagInductionClient: new CiagInductionClient(hmppsAuthClient),
    prisonRegisterStore: config.redis.enabled
      ? new RedisPrisonRegisterStore(createRedisClient())
      : new InMemoryPrisonRegisterStore(),
    prisonRegisterClient: new PrisonRegisterClient(hmppsAuthClient),
    journeyDataStore: config.redis.enabled
      ? new RedisJourneyDataStore(createRedisClient())
      : new InMemoryJourneyDataStore(),
    supportAdditionalNeedsApiClient: new SupportAdditionalNeedsApiClient(hmppsAuthClient),
    learnerRecordsApiClient: new LearnerRecordsApiClient(learnerRecordsApiAuthClient),
  }
}

export type DataAccess = ReturnType<typeof dataAccess>

export {
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
  SupportAdditionalNeedsApiClient,
  LearnerRecordsApiClient,
}
