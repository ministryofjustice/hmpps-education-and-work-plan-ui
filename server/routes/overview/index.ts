import { Router } from 'express'
import { Services } from '../../services'
import { checkUserHasViewAuthority } from '../../middleware/roleBasedAccessControl'
import OverviewController from './overviewController'
import { retrievePrisonerSummaryIfNotInSession } from '../routerRequestHandlers'
import config from '../../config'

/**
 * Route definitions for the pages relating to the main Overview page
 */
export default (router: Router, services: Services) => {
  const overViewController = new OverviewController(
    services.curiousService,
    services.educationAndWorkPlanService,
    services.inductionService,
    services.ciagInductionService,
    services.timelineService,
  )

  router.use('/plan/:prisonNumber/view/*', [
    checkUserHasViewAuthority(),
    retrievePrisonerSummaryIfNotInSession(services.prisonerSearchService),
  ])

  if (config.featureToggles.plpPrisonerListAndOverviewPagesEnabled) {
    router.get('/plan/:prisonNumber/view/overview', [overViewController.getOverviewView])
  } else {
    router.get('/plan/:prisonNumber/view/overview', [overViewController.getPrivateBetaOverviewView])
  }

  router.get('/plan/:prisonNumber/view/support-needs', [overViewController.getSupportNeedsView])

  router.get('/plan/:prisonNumber/view/education-and-training', [overViewController.getEducationAndTrainingView])

  router.get('/plan/:prisonNumber/view/work-and-interests', [overViewController.getWorkAndInterestsView])

  if (config.featureToggles.timelinePageEnabled) {
    router.get('/plan/:prisonNumber/view/timeline', [overViewController.getTimelineView])
  }
}
