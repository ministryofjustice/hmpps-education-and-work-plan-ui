import type { Router } from 'express'
import { checkUserHasViewAuthority } from '../../middleware/roleBasedAccessControl'
import PrisonerListController from './prisonerListController'

/**
 * Route definition for the prisoner list page
 */
export default (router: Router) => {
  const prisonerListController = new PrisonerListController()
  router.use('/', [checkUserHasViewAuthority()])
  router.get('/', [prisonerListController.getPrisonerListView])
}
