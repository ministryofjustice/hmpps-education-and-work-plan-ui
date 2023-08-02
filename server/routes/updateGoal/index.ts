import { Router } from 'express'
import { Services } from '../../services'
import UpdateGoalController from './updateGoalController'
import { checkUserHasEditAuthority } from '../../middleware/roleBasedAccessControl'
import { checkPrisonerSummaryExistsInSession } from '../createGoal/routerRequestHandlers'

/**
 * Route definitions for the pages relating to Updating A Goal
 */
export default (router: Router, services: Services) => {
  const updateGoalController = new UpdateGoalController(services.educationAndWorkPlanService)

  router.use('/plan/:prisonNumber/goals/update', checkUserHasEditAuthority())
  router.get('/plan/:prisonNumber/goals/update', [
    checkPrisonerSummaryExistsInSession,
    updateGoalController.getUpdateGoalView,
  ])
}
