import { Router } from 'express'
import { Services } from '../../services'
import UnarchiveGoalController from './unarchiveGoalController'
import { checkUserHasPermissionTo } from '../../middleware/roleBasedAccessControl'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import retrieveGoal from '../routerRequestHandlers/retrieveGoal'
import ApplicationAction from '../../enums/applicationAction'
import { checkRedirectAtEndOfJourneyIsNotPending } from '../routerRequestHandlers/checkRedirectAtEndOfJourneyIsNotPending'

/**
 * Route definitions for the pages relating to Unarchiving A Goal
 */
export default (services: Services) => {
  const router = Router({ mergeParams: true })

  const { auditService, educationAndWorkPlanService } = services
  const unarchiveGoalController = new UnarchiveGoalController(educationAndWorkPlanService, auditService)

  router.use('/goals/:goalReference/unarchive', [
    checkUserHasPermissionTo(ApplicationAction.COMPLETE_AND_ARCHIVE_GOALS),
  ])
  router.get('/goals/:goalReference/unarchive', [
    retrieveGoal(educationAndWorkPlanService),
    asyncMiddleware(unarchiveGoalController.getUnarchiveGoalView),
  ])
  router.post('/goals/:goalReference/unarchive', [
    checkRedirectAtEndOfJourneyIsNotPending({
      journey: 'Unarchive Goal',
      redirectTo: '/plan/:prisonNumber/view/overview',
    }),
    asyncMiddleware(unarchiveGoalController.submitUnarchiveGoalForm),
  ])

  return router
}
