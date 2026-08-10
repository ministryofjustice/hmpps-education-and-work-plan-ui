import { Router } from 'express'
import { Services } from '../../services'
import CompleteGoalController from './completeGoalController'
import { checkUserHasPermissionTo } from '../../middleware/roleBasedAccessControl'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import retrieveGoal from '../routerRequestHandlers/retrieveGoal'
import ApplicationAction from '../../enums/applicationAction'
import { checkRedirectAtEndOfJourneyIsNotPending } from '../routerRequestHandlers/checkRedirectAtEndOfJourneyIsNotPending'

/**
 * Route definitions for the pages relating to Completing A Goal
 */
export default (services: Services) => {
  const router = Router({ mergeParams: true })

  const { auditService, educationAndWorkPlanService } = services
  const completeGoalController = new CompleteGoalController(educationAndWorkPlanService, auditService)

  router.use('/goals/:goalReference/complete', [checkUserHasPermissionTo(ApplicationAction.COMPLETE_AND_ARCHIVE_GOALS)])
  router.get('/goals/:goalReference/complete', [
    retrieveGoal(educationAndWorkPlanService),
    asyncMiddleware(completeGoalController.getCompleteGoalView),
  ])
  router.post('/goals/:goalReference/complete', [
    checkRedirectAtEndOfJourneyIsNotPending({
      journey: 'Complete Goal',
      redirectTo: '/plan/:prisonNumber/view/overview',
    }),
    asyncMiddleware(completeGoalController.submitCompleteGoalForm),
  ])

  return router
}
