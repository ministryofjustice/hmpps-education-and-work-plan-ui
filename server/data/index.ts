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
import { createRedisClient } from './redisClient'
import TokenStore from './tokenStore'
import PrisonerSearchClient from './prisonerSearchClient'
import EducationAndWorkPlanClient from './educationAndWorkPlanClient'
import CuriousClient from './curiousClient'

type RestClientBuilder<T> = (token: string) => T

export const dataAccess = () => ({
  applicationInfo,
  hmppsAuthClient: new HmppsAuthClient(new TokenStore(createRedisClient())),
  prisonerSearchClient: new PrisonerSearchClient(),
  educationAndWorkPlanClient: new EducationAndWorkPlanClient(),
  curiousClient: new CuriousClient(),
})

export type DataAccess = ReturnType<typeof dataAccess>

export { HmppsAuthClient, RestClientBuilder, PrisonerSearchClient, EducationAndWorkPlanClient, CuriousClient }
