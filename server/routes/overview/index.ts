import { Router } from 'express'
import { Services } from '../../services'
import { checkUserHasViewAuthority } from '../../middleware/roleBasedAccessControl'
import OverviewController from './overviewController'
import PrisonerSummaryRequestHandler from './prisonerSummaryRequestHandler'

/**
 * Route definitions for the pages relating to the main Overview page
 */
export default (router: Router, services: Services) => {
  const prisonerSummaryRequestHandler = new PrisonerSummaryRequestHandler(services.prisonerSearchService)
  const overViewController = new OverviewController(services.curiousService, services.educationAndWorkPlanService)

  router.use('/plan/:prisonNumber/view/*', [
    checkUserHasViewAuthority(),
    prisonerSummaryRequestHandler.getPrisonerSummary,
  ])

  router.get('/plan/:prisonNumber/view/overview', [overViewController.getOverviewView])

  router.get('/plan/:prisonNumber/view/support-needs', [overViewController.getSupportNeedsView])

  router.get('/plan/:prisonNumber/view/education-and-training', [overViewController.getEducationAndTrainingView])
}
