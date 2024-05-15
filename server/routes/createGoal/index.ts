import { Router } from 'express'
import { Services } from '../../services'
import CreateGoalsController from './createGoalsController'
import { checkUserHasEditAuthority } from '../../middleware/roleBasedAccessControl'
import checkPrisonerSummaryExistsInSession from '../routerRequestHandlers/checkPrisonerSummaryExistsInSession'
import asyncMiddleware from '../../middleware/asyncMiddleware'

/**
 * Route definitions for the pages relating to Creating A Goal
 */
export default (router: Router, services: Services) => {
  const createGoalsController = new CreateGoalsController(services.educationAndWorkPlanService)
  router.use('/plan/:prisonNumber/goals/create', [checkUserHasEditAuthority()])
  router.get('/plan/:prisonNumber/goals/create', [asyncMiddleware(createGoalsController.getCreateGoalsView)])
  router.post('/plan/:prisonNumber/goals/create', [
    checkPrisonerSummaryExistsInSession,
    asyncMiddleware(createGoalsController.submitCreateGoalsForm),
  ])
}
