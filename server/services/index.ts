import { PermissionsService as PrisonPermissionsService } from '@ministryofjustice/hmpps-prison-permissions-lib'
import { ApplicationInfo, dataAccess } from '../data'
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
import EmployabilitySkillsService from './employabilitySkillsService'
import config from '../config'
import logger from '../../logger'

/**
 * Function that instantiates and exposes all services required by the application.
 */
export const services = () => {
  const {
    applicationInfo,
    telemetryClient,
    hmppsAuthClient,
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

  const prisonPermissionsService = PrisonPermissionsService.create({
    prisonerSearchConfig: config.apis.prisonerSearch,
    authenticationClient: hmppsAuthClient,
    logger,
    telemetryClient,
  })

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
  const employabilitySkillsService = new EmployabilitySkillsService(educationAndWorkPlanClient)

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
    employabilitySkillsService,
    prisonPermissionsService,
  }
}

export type Services = ReturnType<typeof services>

export {
  type ApplicationInfo,
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
  JourneyDataService,
  SupportAdditionalNeedsService,
  LearnerRecordsService,
  EmployabilitySkillsService,
  PrisonPermissionsService,
}
