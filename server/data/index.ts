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
import { createRedisClient } from './cache/redisClient'
import TokenStore from './cache/tokenStore'
import PrisonerSearchClient from './prisonerSearchClient'
import EducationAndWorkPlanClient from './educationAndWorkPlanClient'
import CuriousClient from './curiousClient'
import CiagInductionClient from './ciagInductionClient'
import FrontendComponentApiClient from './frontendComponentApiClient'
import PrisonRegisterStore from './cache/prisonRegisterStore'
import PrisonRegisterClient from './prisonRegisterClient'

type RestClientBuilder<T> = (token: string) => T

export const dataAccess = () => ({
  applicationInfo,
  hmppsAuthClient: new HmppsAuthClient(new TokenStore(createRedisClient())),
  prisonerSearchClient: new PrisonerSearchClient(),
  educationAndWorkPlanClient: new EducationAndWorkPlanClient(),
  curiousClient: new CuriousClient(),
  ciagInductionClient: new CiagInductionClient(),
  frontendComponentApiClient: new FrontendComponentApiClient(),
  prisonRegisterStore: new PrisonRegisterStore(),
  prisonRegisterClient: new PrisonRegisterClient(),
})

export type DataAccess = ReturnType<typeof dataAccess>

export {
  HmppsAuthClient,
  RestClientBuilder,
  PrisonerSearchClient,
  EducationAndWorkPlanClient,
  CuriousClient,
  CiagInductionClient,
  FrontendComponentApiClient,
  PrisonRegisterStore,
  PrisonRegisterClient,
}
