import { Router } from 'express'
import { Services } from '../../services'
import { checkUserHasViewAuthority } from '../../middleware/roleBasedAccessControl'
import OverviewController from './overviewController'
import {
  removeInductionFormsFromSession,
  retrieveCuriousInPrisonCourses,
  retrievePrisonerSummaryIfNotInSession,
} from '../routerRequestHandlers'

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

  router.use('/plan/:prisonNumber/view/*', [
    checkUserHasViewAuthority(),
    retrievePrisonerSummaryIfNotInSession(services.prisonerSearchService),
    removeInductionFormsFromSession,
  ])

  router.get('/plan/:prisonNumber/view/overview', [
    retrieveCuriousInPrisonCourses(services.curiousService),
    overViewController.getOverviewView,
  ])

  router.get('/plan/:prisonNumber/view/support-needs', [overViewController.getSupportNeedsView])

  router.get('/plan/:prisonNumber/view/education-and-training', [
    retrieveCuriousInPrisonCourses(services.curiousService),
    overViewController.getEducationAndTrainingView,
  ])

  router.get('/plan/:prisonNumber/view/work-and-interests', [overViewController.getWorkAndInterestsView])

  router.get('/plan/:prisonNumber/view/timeline', [overViewController.getTimelineView])
}
