import { dataAccess } from '../data'
import UserService from './userService'
import PrisonerSearchService from './prisonerSearchService'
import EducationAndWorkPlanService from './educationAndWorkPlanService'
import CuriousService from './curiousService'
import CiagInductionService from './ciagInductionService'
import FrontendComponentService from './frontendComponentService'
import PrisonerListService from './prisonerListService'

/**
 * Function that instantiates and exposes all services required by the application.
 */
export const services = () => {
  const {
    hmppsAuthClient,
    applicationInfo,
    prisonerSearchClient,
    educationAndWorkPlanClient,
    curiousClient,
    ciagInductionClient,
    frontendComponentApiClient,
  } = dataAccess()

  const userService = new UserService(hmppsAuthClient)
  const prisonerSearchService = new PrisonerSearchService(hmppsAuthClient, prisonerSearchClient)
  const educationAndWorkPlanService = new EducationAndWorkPlanService(educationAndWorkPlanClient)
  const curiousService = new CuriousService(hmppsAuthClient, curiousClient)
  const ciagInductionService = new CiagInductionService(hmppsAuthClient, ciagInductionClient)
  const frontendComponentService = new FrontendComponentService(frontendComponentApiClient)
  const prisonerListService = new PrisonerListService(
    hmppsAuthClient,
    prisonerSearchClient,
    educationAndWorkPlanClient,
    ciagInductionClient,
  )

  return {
    applicationInfo,
    userService,
    prisonerSearchService,
    educationAndWorkPlanService,
    curiousService,
    ciagInductionService,
    frontendComponentService,
    prisonerListService,
  }
}

export type Services = ReturnType<typeof services>

export { UserService, PrisonerSearchService, EducationAndWorkPlanService, CuriousService, PrisonerListService }
