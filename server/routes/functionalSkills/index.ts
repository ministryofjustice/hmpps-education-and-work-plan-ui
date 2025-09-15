import type { Router } from 'express'
import { Services } from '../../services'
import FunctionalSkillsController from './functionalSkillsController'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import retrieveCuriousFunctionalSkills from '../routerRequestHandlers/retrieveCuriousFunctionalSkills'
import retrievePrisonNamesById from '../routerRequestHandlers/retrievePrisonNamesById'

/**
 * Route definitions for the pages relating to Functional Skills
 */
export default (router: Router, services: Services) => {
  const { curiousService, prisonService } = services
  const functionalSkillsController = new FunctionalSkillsController()

  router.get('/plan/:prisonNumber/functional-skills', [
    retrievePrisonNamesById(prisonService),
    retrieveCuriousFunctionalSkills(curiousService, { useCurious1ApiForFunctionalSkills: true }),
    asyncMiddleware(functionalSkillsController.getFunctionalSkillsView),
  ])
}
