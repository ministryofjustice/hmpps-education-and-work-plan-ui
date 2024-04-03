import { dataAccess } from '../data'
import AuditService from './auditService'
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
    hmppsAuditClient,
    prisonerSearchClient,
    educationAndWorkPlanClient,
    curiousClient,
    ciagInductionClient,
    frontendComponentApiClient,
    prisonRegisterStore,
    prisonRegisterClient,
  } = dataAccess()

  const userService = new UserService(hmppsAuthClient)
  const auditService = new AuditService(hmppsAuditClient)
  const prisonerSearchService = new PrisonerSearchService(hmppsAuthClient, prisonerSearchClient)
  const educationAndWorkPlanService = new EducationAndWorkPlanService(educationAndWorkPlanClient)
  const inductionService = new InductionService(educationAndWorkPlanClient)
  const prisonService = new PrisonService(prisonRegisterStore, prisonRegisterClient, hmppsAuthClient)
  const curiousService = new CuriousService(hmppsAuthClient, curiousClient, prisonService)
  const frontendComponentService = new FrontendComponentService(frontendComponentApiClient)
  const prisonerListService = new PrisonerListService(
    hmppsAuthClient,
    prisonerSearchClient,
    educationAndWorkPlanClient,
    ciagInductionClient,
  )
  const timelineService = new TimelineService(educationAndWorkPlanClient, prisonService)

  return {
    applicationInfo,
    auditService,
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
