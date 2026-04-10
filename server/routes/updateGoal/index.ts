import { Router } from 'express'
import { Services } from '../../services'
import UpdateGoalController from './updateGoalController'
import { checkUserHasPermissionTo } from '../../middleware/roleBasedAccessControl'
import checkUpdateGoalFormExistsInSession from '../routerRequestHandlers/checkUpdateGoalFormExistsInSession'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import retrieveGoals from '../routerRequestHandlers/retrieveGoals'
import GoalStatusValue from '../../enums/goalStatusValue'
import ApplicationAction from '../../enums/applicationAction'
import updateGoalSchema from './validationSchemas/updateGoalSchema'
import { validate } from '../routerRequestHandlers/validationMiddleware'
import { checkRedirectAtEndOfJourneyIsNotPending } from '../routerRequestHandlers/checkRedirectAtEndOfJourneyIsNotPending'

/**
 * Route definitions for the pages relating to Updating A Goal
 */
export default (router: Router, services: Services) => {
  const { auditService, educationAndWorkPlanService } = services
  const updateGoalController = new UpdateGoalController(educationAndWorkPlanService, auditService)

  router.use('/plan/:prisonNumber/goals/:goalReference/update', [
    checkUserHasPermissionTo(ApplicationAction.UPDATE_GOALS),
  ])
  router.get('/plan/:prisonNumber/goals/:goalReference/update', [
    retrieveGoals(services.educationAndWorkPlanService, GoalStatusValue.ACTIVE),
    asyncMiddleware(updateGoalController.getUpdateGoalView),
  ])
  router.post('/plan/:prisonNumber/goals/:goalReference/update', [
    validate(updateGoalSchema),
    asyncMiddleware(updateGoalController.submitUpdateGoalForm),
  ])

  router.use('/plan/:prisonNumber/goals/:goalReference/update/review', [
    checkUserHasPermissionTo(ApplicationAction.UPDATE_GOALS),
    checkUpdateGoalFormExistsInSession,
  ])
  router.get('/plan/:prisonNumber/goals/:goalReference/update/review', [
    asyncMiddleware(updateGoalController.getReviewUpdateGoalView),
  ])
  router.post('/plan/:prisonNumber/goals/:goalReference/update/review', [
    checkRedirectAtEndOfJourneyIsNotPending({
      journey: 'Update Goal',
      redirectTo: '/plan/:prisonNumber/view/overview',
    }),
    asyncMiddleware(updateGoalController.submitReviewUpdateGoal),
  ])
}
