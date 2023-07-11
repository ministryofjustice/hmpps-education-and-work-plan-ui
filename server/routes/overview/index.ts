import { Router } from 'express'
import { Services } from '../../services'
import { hasViewAuthority } from '../../middleware/roleBasedAccessControl'
import OverviewController from './overviewController'

/**
 * Route definitions for the pages relating to Creating A Goal
 */
export default (router: Router, services: Services) => {
  const overViewController = new OverviewController(services.prisonerSearchService)

  router.use('/plan/:prisonNumber/view/overview', [hasViewAuthority()])
  router.get('/plan/:prisonNumber/view/:tab', overViewController.getOverviewView)
}
