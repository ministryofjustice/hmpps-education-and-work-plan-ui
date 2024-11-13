import type { Router } from 'express'
import { Services } from '../../services'
import FunctionalSkillsController from './functionalSkillsController'
import asyncMiddleware from '../../middleware/asyncMiddleware'

/**
 * Route definitions for the pages relating to Functional Skills
 */
export default (router: Router, services: Services) => {
  const functionalSkillsController = new FunctionalSkillsController(services.curiousService, services.prisonService)

  router.get('/plan/:prisonNumber/functional-skills', [
    asyncMiddleware(functionalSkillsController.getFunctionalSkillsView),
  ])
}
