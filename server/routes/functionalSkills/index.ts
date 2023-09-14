import type { Router } from 'express'
import { Services } from '../../services'
import { checkUserHasViewAuthority } from '../../middleware/roleBasedAccessControl'
import { checkPrisonerSummaryExistsInSession, retrievePrisonerSummaryIfNotInSession } from '../routerRequestHandlers'
import FunctionalSkillsController from './functionalSkillsController'

/**
 * Route definitions for the pages relating to Functional Skills
 */
export default (router: Router, services: Services) => {
  const functionalSkillsController = new FunctionalSkillsController(services.curiousService)

  router.use('/plan/:prisonNumber/functional-skills', [
    checkUserHasViewAuthority(),
    retrievePrisonerSummaryIfNotInSession(services.prisonerSearchService),
  ])

  router.get('/plan/:prisonNumber/functional-skills', [
    checkPrisonerSummaryExistsInSession,
    functionalSkillsController.getFunctionalSkillsView,
  ])
}
