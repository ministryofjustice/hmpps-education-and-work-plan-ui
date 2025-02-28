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
import PrisonRegisterClient from './prisonRegisterClient'
import PrisonerSearchStore from './prisonerSearchStore/prisonerSearchStore'

type RestClientBuilder<T> = (token: string) => T

export const dataAccess = () => ({
  applicationInfo,
  hmppsAuthClient: new HmppsAuthClient(
    config.redis.enabled ? new RedisTokenStore(createRedisClient()) : new InMemoryTokenStore(),
  ),
  hmppsAuditClient: new HmppsAuditClient(config.sqs.audit),
  manageUsersApiClient: new ManageUsersApiClient(),
  prisonerSearchStore: new PrisonerSearchStore(createRedisClient('prisonerSearch:')),
  prisonerSearchClient: new PrisonerSearchClient(),
  educationAndWorkPlanClient: new EducationAndWorkPlanClient(),
  curiousClient: new CuriousClient(),
  ciagInductionClient: new CiagInductionClient(),
  prisonRegisterStore: new PrisonRegisterStore(createRedisClient('prisonRegister:')),
  prisonRegisterClient: new PrisonRegisterClient(),
})

export type DataAccess = ReturnType<typeof dataAccess>

export {
  HmppsAuthClient,
  RestClientBuilder,
  HmppsAuditClient,
  ManageUsersApiClient,
  PrisonerSearchStore,
  PrisonerSearchClient,
  EducationAndWorkPlanClient,
  CuriousClient,
  CiagInductionClient,
  PrisonRegisterStore,
  PrisonRegisterClient,
}
