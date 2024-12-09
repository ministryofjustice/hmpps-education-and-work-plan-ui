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

/**
 * Route definitions for the pages relating to the main Overview page
 */
export default (router: Router, services: Services) => {
  const overviewController = new OverviewController()
  const timelineController = new TimelineController(services.timelineService)
  const supportNeedsController = new SupportNeedsController()
  const workAndInterestsController = new WorkAndInterestsController()
  const educationAndTrainingController = new EducationAndTrainingController()
  const viewGoalsController = new ViewGoalsController()

  router.use('/plan/:prisonNumber/view/*', [removeFormDataFromSession])

  router.get('/plan/:prisonNumber/view/overview', [
    retrieveAllGoalsForPrisoner(services.educationAndWorkPlanService),
    retrieveActionPlanReviews(services.reviewService),
    retrieveInduction(services.inductionService),
    retrieveCuriousFunctionalSkills(services.curiousService),
    retrieveCuriousInPrisonCourses(services.curiousService),
    asyncMiddleware(overviewController.getOverviewView),
  ])

  router.get('/plan/:prisonNumber/view/support-needs', [
    retrieveCuriousSupportNeeds(services.curiousService),
    asyncMiddleware(supportNeedsController.getSupportNeedsView),
  ])

  router.get('/plan/:prisonNumber/view/education-and-training', [
    retrieveCuriousFunctionalSkills(services.curiousService),
    retrieveCuriousInPrisonCourses(services.curiousService),
    retrieveInduction(services.inductionService),
    retrieveEducation(services.educationAndWorkPlanService),
    asyncMiddleware(educationAndTrainingController.getEducationAndTrainingView),
  ])

  router.get('/plan/:prisonNumber/view/work-and-interests', [
    retrieveInduction(services.inductionService),
    asyncMiddleware(workAndInterestsController.getWorkAndInterestsView),
  ])

  router.get('/plan/:prisonNumber/view/timeline', [asyncMiddleware(timelineController.getTimelineView)])

  router.get('/plan/:prisonNumber/view/goals', [
    retrieveAllGoalsForPrisoner(services.educationAndWorkPlanService),
    asyncMiddleware(viewGoalsController.viewGoals),
  ])
}
