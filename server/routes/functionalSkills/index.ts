import type { Router } from 'express'
import { Services } from '../../services'
import { checkUserHasViewAuthority } from '../../middleware/roleBasedAccessControl'
import PrisonerSummaryRequestHandler from '../overview/prisonerSummaryRequestHandler'
import { checkPrisonerSummaryExistsInSession } from '../createGoal/routerRequestHandlers'
import FunctionalSkillsController from './functionalSkillsController'

/**
 * Route definitions for the pages relating to Functional Skills
 */
export default (router: Router, services: Services) => {
  const prisonerSummaryRequestHandler = new PrisonerSummaryRequestHandler(services.prisonerSearchService)
  const functionalSkillsController = new FunctionalSkillsController(services.curiousService)

  router.use('/plan/:prisonNumber/functional-skills', [
    checkUserHasViewAuthority(),
    prisonerSummaryRequestHandler.getPrisonerSummary,
  ])

  router.get('/plan/:prisonNumber/functional-skills', [
    checkPrisonerSummaryExistsInSession,
    functionalSkillsController.getAllFunctionalSkillsView,
  ])
}
