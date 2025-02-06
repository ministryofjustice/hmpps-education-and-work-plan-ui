import { Router } from 'express'
import { Services } from '../../services'
import CompleteGoalController from './completeGoalController'
import { checkUserHasPermissionTo } from '../../middleware/roleBasedAccessControl'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import retrieveGoals from '../routerRequestHandlers/retrieveGoals'
import GoalStatusValue from '../../enums/goalStatusValue'
import ApplicationAction from '../../enums/applicationAction'

/**
 * Route definitions for the pages relating to Completing A Goal
 */
export default (router: Router, services: Services) => {
  const { auditService, educationAndWorkPlanService } = services
  const completeGoalController = new CompleteGoalController(educationAndWorkPlanService, auditService)

  router.use('/plan/:prisonNumber/goals/:goalReference/complete', [
    checkUserHasPermissionTo(ApplicationAction.COMPLETE_AND_ARCHIVE_GOALS),
  ])
  router.get('/plan/:prisonNumber/goals/:goalReference/complete', [
    retrieveGoals(services.educationAndWorkPlanService, GoalStatusValue.ACTIVE),
    asyncMiddleware(completeGoalController.getCompleteGoalView),
  ])
  router.post('/plan/:prisonNumber/goals/:goalReference/complete', [
    asyncMiddleware(completeGoalController.submitCompleteGoalForm),
  ])
}
