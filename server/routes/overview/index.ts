import { Router } from 'express'
import { Services } from '../../services'
import { hasViewAuthority } from '../../middleware/roleBasedAccessControl'
import OverviewController from './overviewController'

/**
 * Route definitions for the pages relating to Creating A Goal
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (router: Router, services: Services) => {
  const overViewController = new OverviewController()

  router.use('/plan/:prisonNumber/view/overview', [hasViewAuthority()])
  router.get('/plan/:prisonNumber/view/:tab', overViewController.getOverviewView)
}
