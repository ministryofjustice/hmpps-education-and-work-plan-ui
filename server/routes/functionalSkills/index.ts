import type { Router } from 'express'
import { Services } from '../../services'
import { checkUserHasViewAuthority } from '../../middleware/roleBasedAccessControl'
import { retrievePrisonerSummaryIfNotInSession } from '../routerRequestHandlers'
import FunctionalSkillsController from './functionalSkillsController'

/**
 * Route definitions for the pages relating to Functional Skills
 */
export default (router: Router, services: Services) => {
  const functionalSkillsController = new FunctionalSkillsController(services.curiousService, services.prisonService)

  router.get('/plan/:prisonNumber/functional-skills', [
    checkUserHasViewAuthority(),
    retrievePrisonerSummaryIfNotInSession(services.prisonerSearchService),
    functionalSkillsController.getFunctionalSkillsView,
  ])
}
