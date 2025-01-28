import { dataAccess } from '../data'
import AuditService from './auditService'
import UserService from './userService'
import PrisonerSearchService from './prisonerSearchService'
import EducationAndWorkPlanService from './educationAndWorkPlanService'
import CuriousService from './curiousService'
import PrisonerListService from './prisonerListService'
import TimelineService from './timelineService'
import PrisonService from './prisonService'
import InductionService from './inductionService'
import ReviewService from './reviewService'

/**
 * Function that instantiates and exposes all services required by the application.
 */
export const services = () => {
  const {
    hmppsAuthClient,
    applicationInfo,
    hmppsAuditClient,
    manageUsersApiClient,
    prisonerSearchStore,
    prisonerSearchClient,
    educationAndWorkPlanClient,
    curiousClient,
    ciagInductionClient,
    prisonRegisterStore,
    prisonRegisterClient,
  } = dataAccess()

  const auditService = new AuditService(hmppsAuditClient)
  const userService = new UserService(manageUsersApiClient)
  const prisonerSearchService = new PrisonerSearchService(hmppsAuthClient, prisonerSearchClient, prisonerSearchStore)
  const prisonService = new PrisonService(prisonRegisterStore, prisonRegisterClient, hmppsAuthClient)
  const educationAndWorkPlanService = new EducationAndWorkPlanService(
    educationAndWorkPlanClient,
    prisonService,
    hmppsAuthClient,
  )
  const reviewService = new ReviewService(educationAndWorkPlanClient, prisonService, hmppsAuthClient)
  const inductionService = new InductionService(educationAndWorkPlanClient, hmppsAuthClient)
  const curiousService = new CuriousService(hmppsAuthClient, curiousClient, prisonService)
  const prisonerListService = new PrisonerListService(
    hmppsAuthClient,
    prisonerSearchClient,
    educationAndWorkPlanClient,
    ciagInductionClient,
  )
  const timelineService = new TimelineService(educationAndWorkPlanClient, prisonService, hmppsAuthClient)

  return {
    applicationInfo,
    auditService,
    userService,
    prisonerSearchService,
    educationAndWorkPlanService,
    reviewService,
    inductionService,
    curiousService,
    prisonerListService,
    timelineService,
    prisonService,
  }
}

export type Services = ReturnType<typeof services>

export {
  AuditService,
  UserService,
  PrisonerSearchService,
  EducationAndWorkPlanService,
  ReviewService,
  InductionService,
  CuriousService,
  PrisonerListService,
  TimelineService,
  PrisonService,
}
