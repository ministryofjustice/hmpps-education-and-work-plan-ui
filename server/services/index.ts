import { dataAccess } from '../data'
import UserService from './userService'
import PrisonerSearchService from './prisonerSearchService'
import EducationAndWorkPlanService from './educationAndWorkPlanService'
import CuriousService from './curiousService'
import FrontendComponentService from './frontendComponentService'
import PrisonerListService from './prisonerListService'
import TimelineService from './timelineService'
import PrisonService from './prisonService'
import InductionService from './inductionService'

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
    prisonRegisterStore,
    prisonRegisterClient,
  } = dataAccess()

  const userService = new UserService(hmppsAuthClient)
  const prisonerSearchService = new PrisonerSearchService(hmppsAuthClient, prisonerSearchClient)
  const educationAndWorkPlanService = new EducationAndWorkPlanService(educationAndWorkPlanClient)
  const inductionService = new InductionService(educationAndWorkPlanClient)
  const curiousService = new CuriousService(hmppsAuthClient, curiousClient)
  const frontendComponentService = new FrontendComponentService(frontendComponentApiClient)
  const prisonerListService = new PrisonerListService(
    hmppsAuthClient,
    prisonerSearchClient,
    educationAndWorkPlanClient,
    ciagInductionClient,
  )
  const prisonService = new PrisonService(prisonRegisterStore, prisonRegisterClient, hmppsAuthClient)
  const timelineService = new TimelineService(educationAndWorkPlanClient, prisonService)

  return {
    applicationInfo,
    userService,
    prisonerSearchService,
    educationAndWorkPlanService,
    inductionService,
    curiousService,
    frontendComponentService,
    prisonerListService,
    timelineService,
    prisonService,
  }
}

export type Services = ReturnType<typeof services>

export {
  UserService,
  PrisonerSearchService,
  EducationAndWorkPlanService,
  InductionService,
  CuriousService,
  FrontendComponentService,
  PrisonerListService,
  TimelineService,
  PrisonService,
}
