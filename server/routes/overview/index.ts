import { Router } from 'express'
import { Services } from '../../services'
import { checkUserHasViewAuthority } from '../../middleware/roleBasedAccessControl'
import OverviewController from './overviewController'
import retrieveCuriousInPrisonCourses from '../routerRequestHandlers/retrieveCuriousInPrisonCourses'
import removeInductionFormsFromSession from '../routerRequestHandlers/removeInductionFormsFromSession'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import TimelineController from './timelineController'
import SupportNeedsController from './supportNeedsController'
import WorkAndInterestsController from './workAndInterestsController'
import EducationAndTrainingController from './educationAndTrainingController'

/**
 * Route definitions for the pages relating to the main Overview page
 */
export default (router: Router, services: Services) => {
  const overViewController = new OverviewController(
    services.curiousService,
    services.educationAndWorkPlanService,
    services.inductionService,
  )

  const timelineController = new TimelineController(services.timelineService)
  const supportNeedsController = new SupportNeedsController(services.curiousService, services.prisonService)
  const workAndInterestsController = new WorkAndInterestsController(services.inductionService)
  const educationAndTrainingController = new EducationAndTrainingController(
    services.curiousService,
    services.inductionService,
  )

  router.use('/plan/:prisonNumber/view/*', [checkUserHasViewAuthority(), removeInductionFormsFromSession])

  router.get('/plan/:prisonNumber/view/overview', [
    retrieveCuriousInPrisonCourses(services.curiousService),
    asyncMiddleware(overViewController.getOverviewView),
  ])

  router.get('/plan/:prisonNumber/view/support-needs', [asyncMiddleware(supportNeedsController.getSupportNeedsView)])

  router.get('/plan/:prisonNumber/view/education-and-training', [
    retrieveCuriousInPrisonCourses(services.curiousService),
    asyncMiddleware(educationAndTrainingController.getEducationAndTrainingView),
  ])

  router.get('/plan/:prisonNumber/view/work-and-interests', [
    asyncMiddleware(workAndInterestsController.getWorkAndInterestsView),
  ])

  router.get('/plan/:prisonNumber/view/timeline', [asyncMiddleware(timelineController.getTimelineView)])
}
