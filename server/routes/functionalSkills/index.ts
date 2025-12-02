import { Router } from 'express'
import { Services } from '../../services'
import FunctionalSkillsController from './functionalSkillsController'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import retrieveCuriousFunctionalSkills from '../routerRequestHandlers/retrieveCuriousFunctionalSkills'
import retrievePrisonNamesById from '../routerRequestHandlers/retrievePrisonNamesById'

/**
 * Route definitions for the pages relating to Functional Skills
 */
const functionalSkillsRoutes = (services: Services): Router => {
  const { curiousService, prisonService } = services
  const functionalSkillsController = new FunctionalSkillsController()

  return Router({ mergeParams: true }) //
    .get('/functional-skills', [
      retrievePrisonNamesById(prisonService),
      retrieveCuriousFunctionalSkills(curiousService, { useCurious1ApiForFunctionalSkills: true }),
      asyncMiddleware(functionalSkillsController.getFunctionalSkillsView),
    ])
}

export default functionalSkillsRoutes
