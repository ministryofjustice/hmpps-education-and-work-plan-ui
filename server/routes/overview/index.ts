import { Router } from 'express'
import { Services } from '../../services'
import retrieveCuriousInPrisonCourses from '../routerRequestHandlers/retrieveCuriousInPrisonCourses'
import removeFormDataFromSession from '../routerRequestHandlers/removeFormDataFromSession'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import TimelineController from './timelineController'
import SupportNeedsController from './supportNeedsController'
import WorkAndInterestsController from './workAndInterestsController'
import EducationAndTrainingController from './educationAndTrainingController'
import retrieveInduction from '../routerRequestHandlers/retrieveInduction'
import retrieveEducation from '../routerRequestHandlers/retrieveEducation'
import retrieveAllGoalsForPrisoner from '../routerRequestHandlers/retrieveAllGoalsForPrisoner'
import ViewGoalsController from './viewGoalsController'
import OverviewController from './overviewController'
import retrieveCuriousFunctionalSkills from '../routerRequestHandlers/retrieveCuriousFunctionalSkills'
import retrieveCuriousSupportNeeds from '../routerRequestHandlers/retrieveCuriousSupportNeeds'
import retrieveActionPlanReviews from '../routerRequestHandlers/retrieveActionPlanReviews'
import retrieveInductionSchedule from '../routerRequestHandlers/retrieveInductionSchedule'

/**
 * Route definitions for the pages relating to the main Overview page
 */
export default (router: Router, services: Services) => {
  const { curiousService, educationAndWorkPlanService, inductionService, reviewService, timelineService } = services

  const overviewController = new OverviewController()
  const timelineController = new TimelineController(timelineService)
  const supportNeedsController = new SupportNeedsController()
  const workAndInterestsController = new WorkAndInterestsController()
  const educationAndTrainingController = new EducationAndTrainingController()
  const viewGoalsController = new ViewGoalsController()

  router.use('/plan/:prisonNumber/view/*', [removeFormDataFromSession])

  router.get('/plan/:prisonNumber/view/overview', [
    retrieveAllGoalsForPrisoner(educationAndWorkPlanService),
    retrieveInductionSchedule(inductionService),
    retrieveActionPlanReviews(reviewService),
    retrieveInduction(inductionService),
    retrieveCuriousFunctionalSkills(curiousService),
    retrieveCuriousInPrisonCourses(curiousService),
    asyncMiddleware(overviewController.getOverviewView),
  ])

  router.get('/plan/:prisonNumber/view/support-needs', [
    retrieveCuriousSupportNeeds(curiousService),
    asyncMiddleware(supportNeedsController.getSupportNeedsView),
  ])

  router.get('/plan/:prisonNumber/view/education-and-training', [
    retrieveCuriousFunctionalSkills(curiousService),
    retrieveCuriousInPrisonCourses(curiousService),
    retrieveInductionSchedule(inductionService),
    retrieveInduction(inductionService),
    retrieveEducation(educationAndWorkPlanService),
    asyncMiddleware(educationAndTrainingController.getEducationAndTrainingView),
  ])

  router.get('/plan/:prisonNumber/view/work-and-interests', [
    retrieveInductionSchedule(inductionService),
    retrieveInduction(inductionService),
    asyncMiddleware(workAndInterestsController.getWorkAndInterestsView),
  ])

  router.get('/plan/:prisonNumber/view/timeline', [asyncMiddleware(timelineController.getTimelineView)])

  router.get('/plan/:prisonNumber/view/goals', [
    retrieveInductionSchedule(inductionService),
    retrieveInduction(inductionService),
    retrieveActionPlanReviews(reviewService),
    retrieveAllGoalsForPrisoner(educationAndWorkPlanService),
    asyncMiddleware(viewGoalsController.viewGoals),
  ])
}
