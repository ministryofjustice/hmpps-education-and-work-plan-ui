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

/**
 * Route definitions for the pages relating to the main Overview page
 */
export default (router: Router, services: Services) => {
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

  router.use('/plan/:prisonNumber/view', [removeFormDataFromSession])

  router.get('/plan/:prisonNumber/view/overview', [
    retrieveAllGoalsForPrisoner(educationAndWorkPlanService),
    retrieveInductionSchedule(inductionService),
    retrieveActionPlanReviews(reviewService),
    retrieveInduction(inductionService),
    retrieveCuriousFunctionalSkills(curiousService),
    retrieveCuriousInPrisonCourses(curiousService),
    retrievePrisonNamesById(prisonService),
    asyncMiddleware(overviewController.getOverviewView),
  ])

  router.get('/plan/:prisonNumber/view/additional-needs', [
    retrievePrisonNamesById(prisonService),
    retrieveSupportForAdditionalNeedsAlnScreeners(supportAdditionalNeedsService),
    retrieveSupportForAdditionalNeedsChallenges(supportAdditionalNeedsService),
    retrieveSupportForAdditionalNeedsConditions(supportAdditionalNeedsService),
    retrieveSupportForAdditionalNeedsStrengths(supportAdditionalNeedsService),
    retrieveSupportForAdditionalNeedsSupportStrategies(supportAdditionalNeedsService),
    retrieveCuriousAlnAndLddAssessments(curiousService),
    asyncMiddleware(additionalNeedsController.getAdditionalNeedsView),
  ])

  router.get('/plan/:prisonNumber/view/education-and-training', [
    retrievePrisonNamesById(prisonService),
    retrieveCuriousFunctionalSkills(curiousService),
    retrieveCuriousInPrisonCourses(curiousService),
    retrieveInductionSchedule(inductionService),
    retrieveInduction(inductionService),
    retrieveEducation(educationAndWorkPlanService),
    config.featureToggles.lrsIntegrationEnabled
      ? retrieveVerifiedQualifications(learnerRecordsService)
      : async (req: Request, res: Response, next: NextFunction) => next(),
    asyncMiddleware(educationAndTrainingController.getEducationAndTrainingView),
  ])

  router.get('/plan/:prisonNumber/view/work-and-interests', [
    retrievePrisonNamesById(prisonService),
    retrieveInductionSchedule(inductionService),
    retrieveInduction(inductionService),
    asyncMiddleware(workAndInterestsController.getWorkAndInterestsView),
  ])

  router.get('/plan/:prisonNumber/view/history', [
    retrieveTimeline(timelineService),
    asyncMiddleware(timelineController.getHistoryView),
  ])

  router.get('/plan/:prisonNumber/view/goals', [
    retrieveInductionSchedule(inductionService),
    retrieveInduction(inductionService),
    retrieveActionPlanReviews(reviewService),
    retrieveAllGoalsForPrisoner(educationAndWorkPlanService),
    asyncMiddleware(viewGoalsController.viewGoals),
  ])
}
