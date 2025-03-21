import { Router } from 'express'
import { Services } from '../../services'
import CompleteOrArchiveGoalController from './completeOrArchiveGoalController'
import { checkUserHasPermissionTo } from '../../middleware/roleBasedAccessControl'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import retrieveGoals from '../routerRequestHandlers/retrieveGoals'
import GoalStatusValue from '../../enums/goalStatusValue'
import ApplicationAction from '../../enums/applicationAction'

/**
 * Route definitions for the pages relating to Completing A Goal
 */
export default (router: Router, services: Services) => {
  const { educationAndWorkPlanService } = services
  const completeOrArchiveGoalController = new CompleteOrArchiveGoalController(educationAndWorkPlanService)

  router.use('/plan/:prisonNumber/goals/:goalReference/complete-or-archive', [
    checkUserHasPermissionTo(ApplicationAction.COMPLETE_AND_ARCHIVE_GOALS),
  ])
  router.get('/plan/:prisonNumber/goals/:goalReference/complete-or-archive', [
    retrieveGoals(services.educationAndWorkPlanService, GoalStatusValue.ACTIVE),
    asyncMiddleware(completeOrArchiveGoalController.getCompleteOrArchiveGoalView),
  ])
  router.post('/plan/:prisonNumber/goals/:goalReference/complete-or-archive', [
    asyncMiddleware(completeOrArchiveGoalController.submitCompleteOrArchiveGoalForm),
  ])
}
