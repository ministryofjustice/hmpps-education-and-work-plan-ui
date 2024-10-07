import { Router } from 'express'
import { Services } from '../../services'
import { checkUserHasViewAuthority } from '../../middleware/roleBasedAccessControl'
import OverviewController from './overviewController'
import retrieveCuriousInPrisonCourses from '../routerRequestHandlers/retrieveCuriousInPrisonCourses'
import removeFormDataFromSession from '../routerRequestHandlers/removeFormDataFromSession'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import TimelineController from './timelineController'
import SupportNeedsController from './supportNeedsController'
import WorkAndInterestsController from './workAndInterestsController'
import EducationAndTrainingController from './educationAndTrainingController'
import retrieveInduction from '../routerRequestHandlers/retrieveInduction'
import ViewArchivedGoalsController from './viewArchivedGoalsController'
import retrieveEducation from '../routerRequestHandlers/retrieveEducation'
import retrieveAllGoalsForPrisoner from '../routerRequestHandlers/retrieveAllGoalsForPrisoner'
import ViewGoalsController from './viewGoalsController'
import config from '../../config'
import GoalStatusValue from '../../enums/goalStatusValue'
import retrieveGoals from '../routerRequestHandlers/retrieveGoals'
import OverviewControllerV2 from './overviewControllerV2'

/**
 * Route definitions for the pages relating to the main Overview page
 */
export default (router: Router, services: Services) => {
  const overViewController = new OverviewController(services.curiousService, services.inductionService)
  const overviewControllerV2 = new OverviewControllerV2(
    services.curiousService,
    services.inductionService,
    services.educationAndWorkPlanService,
  )
  const timelineController = new TimelineController(services.timelineService)
  const supportNeedsController = new SupportNeedsController(services.curiousService, services.prisonService)
  const workAndInterestsController = new WorkAndInterestsController()
  const educationAndTrainingController = new EducationAndTrainingController(services.curiousService)
  const viewArchivedGoalsController = new ViewArchivedGoalsController(services.educationAndWorkPlanService)
  const viewGoalsController = new ViewGoalsController()

  router.use('/plan/:prisonNumber/view/*', [checkUserHasViewAuthority(), removeFormDataFromSession])

  if (config.featureToggles.newOverviewPageEnabled) {
    router.get('/plan/:prisonNumber/view/overview', [
      retrieveCuriousInPrisonCourses(services.curiousService),
      asyncMiddleware(overviewControllerV2.getOverviewView),
    ])
  } else {
    router.get('/plan/:prisonNumber/view/overview', [
      retrieveCuriousInPrisonCourses(services.curiousService),
      retrieveGoals(services.educationAndWorkPlanService, GoalStatusValue.ACTIVE),
      asyncMiddleware(overViewController.getOverviewView),
    ])
  }

  router.get('/plan/:prisonNumber/view/support-needs', [asyncMiddleware(supportNeedsController.getSupportNeedsView)])

  router.get('/plan/:prisonNumber/view/education-and-training', [
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

  router.get('/plan/:prisonNumber/view/archived-goals', [
    asyncMiddleware(viewArchivedGoalsController.viewArchivedGoals),
  ])

  router.get('/plan/:prisonNumber/view/goals', [
    retrieveAllGoalsForPrisoner(services.educationAndWorkPlanService),
    asyncMiddleware(viewGoalsController.viewGoals),
  ])
}
