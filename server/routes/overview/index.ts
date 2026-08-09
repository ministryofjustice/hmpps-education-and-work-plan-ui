import { NextFunction, Request, Response, Router } from 'express'
import { Services } from '../../services'
import retrieveCuriousInPrisonCourses from '../routerRequestHandlers/retrieveCuriousInPrisonCourses'
import removeFormDataFromSession from '../routerRequestHandlers/removeFormDataFromSession'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import HistoryController from './historyController'
import AdditionalNeedsController from './additionalNeedsController'
import WorkAndInterestsController from './workAndInterestsController'
import EducationAndTrainingController from './educationAndTrainingController'
import retrieveInduction from '../routerRequestHandlers/retrieveInduction'
import retrieveEducation from '../routerRequestHandlers/retrieveEducation'
import retrieveAllGoalsForPrisoner from '../routerRequestHandlers/retrieveAllGoalsForPrisoner'
import ViewGoalsController from './viewGoalsController'
import OverviewController from './overviewController'
import retrieveCuriousFunctionalSkills from '../routerRequestHandlers/retrieveCuriousFunctionalSkills'
import retrieveCuriousAlnAndLddAssessments from '../routerRequestHandlers/retrieveCuriousAlnAndLddAssessments'
import retrieveActionPlanReviews from '../routerRequestHandlers/retrieveActionPlanReviews'
import retrieveInductionSchedule from '../routerRequestHandlers/retrieveInductionSchedule'
import retrievePrisonNamesById from '../routerRequestHandlers/retrievePrisonNamesById'
import retrieveTimeline from '../routerRequestHandlers/retrieveTimeline'
import retrieveSupportForAdditionalNeedsConditions from '../routerRequestHandlers/retrieveSupportForAdditionalNeedsConditions'
import retrieveSupportForAdditionalNeedsSupportStrategies from '../routerRequestHandlers/retrieveSupportForAdditionalNeedsSupportStrategies'
import retrieveSupportForAdditionalNeedsStrengths from '../routerRequestHandlers/retrieveSupportForAdditionalNeedsStrengths'
import retrieveSupportForAdditionalNeedsAlnScreeners from '../routerRequestHandlers/retrieveSupportForAdditionalNeedsAlnScreeners'
import retrieveSupportForAdditionalNeedsChallenges from '../routerRequestHandlers/retrieveSupportForAdditionalNeedsChallenges'
import retrieveVerifiedQualifications from '../routerRequestHandlers/retrieveVerifiedQualifications'
import config from '../../config'
import { checkUserHasPermissionTo } from '../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../enums/applicationAction'
import EmployabilitySkillsController from './employabilitySkillsController'

/**
 * Route definitions for the pages relating to the main Overview page
 */
export default (services: Services) => {
  const router = Router({ mergeParams: true })
  const {
    curiousService,
    educationAndWorkPlanService,
    inductionService,
    learnerRecordsService,
    prisonService,
    reviewService,
    supportAdditionalNeedsService,
    timelineService,
  } = services

  const overviewController = new OverviewController()
  const timelineController = new HistoryController()
  const additionalNeedsController = new AdditionalNeedsController()
  const workAndInterestsController = new WorkAndInterestsController()
  const educationAndTrainingController = new EducationAndTrainingController()
  const viewGoalsController = new ViewGoalsController()
  const employabilitySkillsController = new EmployabilitySkillsController()

  router.use('/view', [removeFormDataFromSession])

  router.get('/view/overview', [
    retrieveAllGoalsForPrisoner(educationAndWorkPlanService),
    retrieveInductionSchedule(inductionService, { usingOldStyle: true }),
    retrieveActionPlanReviews(reviewService),
    retrieveInduction(inductionService, { usingOldStyle: true }),
    retrieveCuriousFunctionalSkills(curiousService),
    retrieveCuriousInPrisonCourses(curiousService),
    retrievePrisonNamesById(prisonService),
    config.featureToggles.lrsIntegrationEnabled
      ? retrieveVerifiedQualifications(learnerRecordsService)
      : async (req: Request, res: Response, next: NextFunction) => next(),
    config.featureToggles.lrsIntegrationEnabled
      ? retrieveEducation(educationAndWorkPlanService)
      : async (req: Request, res: Response, next: NextFunction) => next(),
    asyncMiddleware(overviewController.getOverviewView),
  ])

  router.get('/view/additional-needs', [
    retrievePrisonNamesById(prisonService),
    retrieveSupportForAdditionalNeedsAlnScreeners(supportAdditionalNeedsService),
    retrieveSupportForAdditionalNeedsChallenges(supportAdditionalNeedsService),
    retrieveSupportForAdditionalNeedsConditions(supportAdditionalNeedsService),
    retrieveSupportForAdditionalNeedsStrengths(supportAdditionalNeedsService),
    retrieveSupportForAdditionalNeedsSupportStrategies(supportAdditionalNeedsService),
    retrieveCuriousAlnAndLddAssessments(curiousService),
    asyncMiddleware(additionalNeedsController.getAdditionalNeedsView),
  ])

  router.get('/view/education-and-training', [
    retrievePrisonNamesById(prisonService),
    retrieveCuriousFunctionalSkills(curiousService),
    retrieveCuriousInPrisonCourses(curiousService),
    retrieveInductionSchedule(inductionService, { usingOldStyle: true }),
    retrieveInduction(inductionService, { usingOldStyle: true }),
    retrieveEducation(educationAndWorkPlanService),
    config.featureToggles.lrsIntegrationEnabled
      ? retrieveVerifiedQualifications(learnerRecordsService)
      : async (req: Request, res: Response, next: NextFunction) => next(),
    asyncMiddleware(educationAndTrainingController.getEducationAndTrainingView),
  ])

  router.get('/view/work-and-interests', [
    retrievePrisonNamesById(prisonService),
    retrieveInductionSchedule(inductionService, { usingOldStyle: true }),
    retrieveInduction(inductionService, { usingOldStyle: true }),
    asyncMiddleware(workAndInterestsController.getWorkAndInterestsView),
  ])

  router.get('/view/history', [retrieveTimeline(timelineService), asyncMiddleware(timelineController.getHistoryView)])

  router.get('/view/goals', [
    retrieveInductionSchedule(inductionService, { usingOldStyle: true }),
    retrieveInduction(inductionService, { usingOldStyle: true }),
    retrieveActionPlanReviews(reviewService),
    retrieveAllGoalsForPrisoner(educationAndWorkPlanService),
    asyncMiddleware(viewGoalsController.viewGoals),
  ])

  router.get('/view/employability-skills', [
    checkUserHasPermissionTo(ApplicationAction.VIEW_EMPLOYABILITY_SKILLS),
    retrieveInduction(inductionService),
    retrieveInductionSchedule(inductionService),
    asyncMiddleware(employabilitySkillsController.getEmployabilitySkillsView),
  ])

  return router
}
