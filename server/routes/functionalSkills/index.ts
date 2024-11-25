import type { Router } from 'express'
import { Services } from '../../services'
import FunctionalSkillsController from './functionalSkillsController'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import retrieveCuriousFunctionalSkills from '../routerRequestHandlers/retrieveCuriousFunctionalSkills'

/**
 * Route definitions for the pages relating to Functional Skills
 */
export default (router: Router, services: Services) => {
  const functionalSkillsController = new FunctionalSkillsController(services.prisonService)

  router.get('/plan/:prisonNumber/functional-skills', [
    retrieveCuriousFunctionalSkills(services.curiousService),
    asyncMiddleware(functionalSkillsController.getFunctionalSkillsView),
  ])
}
