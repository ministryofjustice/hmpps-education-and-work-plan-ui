import { Router } from 'express'
import { Services } from '../../services'
import { checkUserHasViewAuthority } from '../../middleware/roleBasedAccessControl'
import PrisonerListController from './prisonerListController'

/**
 * Route definition for the prisoner list page
 */
export default (router: Router, services: Services) => {
  const prisonerListController = new PrisonerListController(services.prisonerListService)

  router.use('/', [checkUserHasViewAuthority()])
  router.get('/', [prisonerListController.getPrisonerListView])
}
