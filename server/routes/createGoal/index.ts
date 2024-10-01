import { Router } from 'express'
import { Services } from '../../services'
import CreateGoalsController from './createGoalsController'
import { checkUserHasEditAuthority } from '../../middleware/roleBasedAccessControl'
import asyncMiddleware from '../../middleware/asyncMiddleware'

/**
 * Route definitions for the pages relating to Creating A Goal
 */
export default (router: Router, services: Services) => {
  const { auditService, educationAndWorkPlanService } = services
  const createGoalsController = new CreateGoalsController(educationAndWorkPlanService, auditService)

  router.use('/plan/:prisonNumber/goals/create', [checkUserHasEditAuthority()])
  router.get('/plan/:prisonNumber/goals/create', [asyncMiddleware(createGoalsController.getCreateGoalsView)])
  router.post('/plan/:prisonNumber/goals/create', [asyncMiddleware(createGoalsController.submitCreateGoalsForm)])

  router.post('/plan/:prisonNumber/goals/create/:action(REMOVE_STEP|REMOVE_GOAL|ADD_STEP|ADD_GOAL)', [
    asyncMiddleware(createGoalsController.submitAction),
  ])
}
