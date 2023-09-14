import { Router } from 'express'
import { Services } from '../../services'
import UpdateGoalController from './updateGoalController'
import { checkUserHasEditAuthority } from '../../middleware/roleBasedAccessControl'
import {
  checkPrisonerSummaryExistsInSession,
  checkUpdateGoalFormExistsInSession,
  retrievePrisonerSummaryIfNotInSession,
} from '../routerRequestHandlers'

/**
 * Route definitions for the pages relating to Updating A Goal
 */
export default (router: Router, services: Services) => {
  const updateGoalController = new UpdateGoalController(services.educationAndWorkPlanService)

  router.use('/plan/:prisonNumber/goals/:goalReference/update', [
    checkUserHasEditAuthority(),
    retrievePrisonerSummaryIfNotInSession(services.prisonerSearchService),
  ])
  router.get('/plan/:prisonNumber/goals/:goalReference/update', [updateGoalController.getUpdateGoalView])
  router.post('/plan/:prisonNumber/goals/:goalReference/update', [updateGoalController.submitUpdateGoalForm])

  router.use('/plan/:prisonNumber/goals/:goalReference/update/review', [
    checkUserHasEditAuthority(),
    checkPrisonerSummaryExistsInSession,
    checkUpdateGoalFormExistsInSession,
  ])
  router.get('/plan/:prisonNumber/goals/:goalReference/update/review', [updateGoalController.getReviewUpdateGoalView])
  router.post('/plan/:prisonNumber/goals/:goalReference/update/review', [updateGoalController.submitReviewUpdateGoal])
}
