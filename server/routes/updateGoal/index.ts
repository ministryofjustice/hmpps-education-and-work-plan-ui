import { Router } from 'express'
import { Services } from '../../services'
import UpdateGoalController from './updateGoalController'
import { checkUserHasEditAuthority } from '../../middleware/roleBasedAccessControl'
import checkUpdateGoalFormExistsInSession from '../routerRequestHandlers/checkUpdateGoalFormExistsInSession'
import checkPrisonerSummaryExistsInSession from '../routerRequestHandlers/checkPrisonerSummaryExistsInSession'
import asyncMiddleware from '../../middleware/asyncMiddleware'

/**
 * Route definitions for the pages relating to Updating A Goal
 */
export default (router: Router, services: Services) => {
  const updateGoalController = new UpdateGoalController(services.educationAndWorkPlanService)

  router.use('/plan/:prisonNumber/goals/:goalReference/update', [checkUserHasEditAuthority()])
  router.get('/plan/:prisonNumber/goals/:goalReference/update', [
    asyncMiddleware(updateGoalController.getUpdateGoalView),
  ])
  router.post('/plan/:prisonNumber/goals/:goalReference/update', [
    asyncMiddleware(updateGoalController.submitUpdateGoalForm),
  ])

  router.use('/plan/:prisonNumber/goals/:goalReference/update/review', [
    checkUserHasEditAuthority(),
    checkPrisonerSummaryExistsInSession,
    checkUpdateGoalFormExistsInSession,
  ])
  router.get('/plan/:prisonNumber/goals/:goalReference/update/review', [
    asyncMiddleware(updateGoalController.getReviewUpdateGoalView),
  ])
  router.post('/plan/:prisonNumber/goals/:goalReference/update/review', [
    asyncMiddleware(updateGoalController.submitReviewUpdateGoal),
  ])
}
