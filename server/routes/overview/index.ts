import { Router } from 'express'
import { Services } from '../../services'
import { checkUserHasViewAuthority } from '../../middleware/roleBasedAccessControl'
import OverviewController from './overviewController'
import retrieveCuriousInPrisonCourses from '../routerRequestHandlers/retrieveCuriousInPrisonCourses'
import removeInductionFormsFromSession from '../routerRequestHandlers/removeInductionFormsFromSession'
import asyncMiddleware from '../../middleware/asyncMiddleware'

/**
 * Route definitions for the pages relating to the main Overview page
 */
export default (router: Router, services: Services) => {
  const overViewController = new OverviewController(
    services.curiousService,
    services.educationAndWorkPlanService,
    services.inductionService,
    services.timelineService,
    services.prisonService,
  )

  router.use('/plan/:prisonNumber/view/*', [checkUserHasViewAuthority(), removeInductionFormsFromSession])

  router.get('/plan/:prisonNumber/view/overview', [
    retrieveCuriousInPrisonCourses(services.curiousService),
    asyncMiddleware(overViewController.getOverviewView),
  ])

  router.get('/plan/:prisonNumber/view/support-needs', [asyncMiddleware(overViewController.getSupportNeedsView)])

  router.get('/plan/:prisonNumber/view/education-and-training', [
    retrieveCuriousInPrisonCourses(services.curiousService),
    asyncMiddleware(overViewController.getEducationAndTrainingView),
  ])

  router.get('/plan/:prisonNumber/view/work-and-interests', [
    asyncMiddleware(overViewController.getWorkAndInterestsView),
  ])

  router.get('/plan/:prisonNumber/view/timeline', [asyncMiddleware(overViewController.getTimelineView)])
}
