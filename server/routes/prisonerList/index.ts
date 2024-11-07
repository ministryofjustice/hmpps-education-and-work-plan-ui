import { Router } from 'express'
import { Services } from '../../services'
import PrisonerListController from './prisonerListController'
import asyncMiddleware from '../../middleware/asyncMiddleware'

/**
 * Route definition for the prisoner list page
 */
export default (router: Router, services: Services) => {
  const prisonerListController = new PrisonerListController(services.prisonerListService)

  router.get('/', [asyncMiddleware(prisonerListController.getPrisonerListView)])
}
