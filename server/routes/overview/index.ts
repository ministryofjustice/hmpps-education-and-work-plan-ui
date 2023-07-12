import { Router } from 'express'
import { Services } from '../../services'
import { checkUserHasViewAuthority } from '../../middleware/roleBasedAccessControl'
import OverviewController from './overviewController'

/**
 * Route definitions for the pages relating to Creating A Goal
 */
export default (router: Router, services: Services) => {
  const overViewController = new OverviewController(services.prisonerSearchService)

  router.use('/plan/:prisonNumber/view/overview', checkUserHasViewAuthority())
  router.get('/plan/:prisonNumber/view/:tab', [overViewController.getOverviewView])
}
