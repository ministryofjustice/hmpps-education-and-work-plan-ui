import { Router } from 'express'
import { Services } from '../../services'
import CompleteOrArchiveGoalController from './completeOrArchiveGoalController'
import { checkUserHasEditAuthority } from '../../middleware/roleBasedAccessControl'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import config from '../../config'

/**
 * Route definitions for the pages relating to Completing A Goal
 */
export default (router: Router, services: Services) => {
  const { educationAndWorkPlanService } = services
  const completeOrArchiveGoalController = new CompleteOrArchiveGoalController(educationAndWorkPlanService)

  if (config.featureToggles.completedGoalsEnabled) {
    router.use('/plan/:prisonNumber/goals/:goalReference/complete-or-archive', [checkUserHasEditAuthority()])
    router.get('/plan/:prisonNumber/goals/:goalReference/complete-or-archive', [
      asyncMiddleware(completeOrArchiveGoalController.getCompleteOrArchiveGoalView),
    ])
    router.post('/plan/:prisonNumber/goals/:goalReference/complete-or-archive', [
      asyncMiddleware(completeOrArchiveGoalController.submitCompleteOrArchiveGoalForm),
    ])
  }
}
