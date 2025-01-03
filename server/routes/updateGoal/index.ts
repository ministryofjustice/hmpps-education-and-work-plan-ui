import { Router } from 'express'
import { Services } from '../../services'
import UpdateGoalController from './updateGoalController'
import { checkUserHasEditAuthority } from '../../middleware/roleBasedAccessControl'
import checkUpdateGoalFormExistsInSession from '../routerRequestHandlers/checkUpdateGoalFormExistsInSession'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import retrieveGoals from '../routerRequestHandlers/retrieveGoals'
import GoalStatusValue from '../../enums/goalStatusValue'

/**
 * Route definitions for the pages relating to Updating A Goal
 */
export default (router: Router, services: Services) => {
  const { auditService, educationAndWorkPlanService } = services
  const updateGoalController = new UpdateGoalController(educationAndWorkPlanService, auditService)

  router.use('/plan/:prisonNumber/goals/:goalReference/update', [checkUserHasEditAuthority()])
  router.get('/plan/:prisonNumber/goals/:goalReference/update', [
    retrieveGoals(services.educationAndWorkPlanService, GoalStatusValue.ACTIVE),
    asyncMiddleware(updateGoalController.getUpdateGoalView),
  ])
  router.post('/plan/:prisonNumber/goals/:goalReference/update', [
    asyncMiddleware(updateGoalController.submitUpdateGoalForm),
  ])

  router.use('/plan/:prisonNumber/goals/:goalReference/update/review', [
    checkUserHasEditAuthority(),
    checkUpdateGoalFormExistsInSession,
  ])
  router.get('/plan/:prisonNumber/goals/:goalReference/update/review', [
    asyncMiddleware(updateGoalController.getReviewUpdateGoalView),
  ])
  router.post('/plan/:prisonNumber/goals/:goalReference/update/review', [
    asyncMiddleware(updateGoalController.submitReviewUpdateGoal),
  ])
}
