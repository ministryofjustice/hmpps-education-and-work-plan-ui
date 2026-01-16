import { dataAccess } from '../data'
import AuditService from './auditService'
import UserService from './userService'
import PrisonerService from './prisonerService'
import EducationAndWorkPlanService from './educationAndWorkPlanService'
import CuriousService from './curiousService'
import PrisonerListService from './prisonerListService'
import TimelineService from './timelineService'
import PrisonService from './prisonService'
import InductionService from './inductionService'
import ReviewService from './reviewService'
import SessionService from './sessionService'
import JourneyDataService from './journeyDataService'
import SupportAdditionalNeedsService from './supportAdditionalNeedsService'
import LearnerRecordsService from './learnerRecordsService'
import SearchService from './searchService'

/**
 * Function that instantiates and exposes all services required by the application.
 */
export const services = () => {
  const {
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
    journeyDataStore,
    supportAdditionalNeedsApiClient,
    learnerRecordsApiClient,
  } = dataAccess()

  const auditService = new AuditService(hmppsAuditClient)
  const userService = new UserService(manageUsersApiClient)
  const prisonerService = new PrisonerService(prisonerSearchClient, prisonerSearchStore)
  const prisonService = new PrisonService(prisonRegisterStore, prisonRegisterClient)
  const searchService = new SearchService(educationAndWorkPlanClient)
  const educationAndWorkPlanService = new EducationAndWorkPlanService(educationAndWorkPlanClient, prisonService)
  const reviewService = new ReviewService(educationAndWorkPlanClient, prisonService)
  const inductionService = new InductionService(educationAndWorkPlanClient)
  const curiousService = new CuriousService(curiousClient)
  const prisonerListService = new PrisonerListService(prisonerService, educationAndWorkPlanClient, ciagInductionClient)
  const timelineService = new TimelineService(educationAndWorkPlanClient, prisonService)
  const sessionService = new SessionService(educationAndWorkPlanClient)
  const journeyDataService = new JourneyDataService(journeyDataStore)
  const supportAdditionalNeedsService = new SupportAdditionalNeedsService(supportAdditionalNeedsApiClient)
  const learnerRecordsService = new LearnerRecordsService(learnerRecordsApiClient)

  return {
    applicationInfo,
    auditService,
    userService,
    prisonerService,
    searchService,
    educationAndWorkPlanService,
    reviewService,
    inductionService,
    curiousService,
    prisonerListService,
    timelineService,
    prisonService,
    sessionService,
    journeyDataService,
    supportAdditionalNeedsService,
    learnerRecordsService,
  }
}

export type Services = ReturnType<typeof services>

export {
  AuditService,
  UserService,
  PrisonerService,
  SearchService,
  EducationAndWorkPlanService,
  ReviewService,
  InductionService,
  CuriousService,
  PrisonerListService,
  TimelineService,
  PrisonService,
  SessionService,
  SupportAdditionalNeedsService,
  JourneyDataService,
  LearnerRecordsService,
}
