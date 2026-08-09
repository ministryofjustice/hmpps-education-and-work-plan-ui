import { Router } from 'express'
import { Services } from '../../services'
import CompleteOrArchiveGoalController from './completeOrArchiveGoalController'
import { checkUserHasPermissionTo } from '../../middleware/roleBasedAccessControl'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import ApplicationAction from '../../enums/applicationAction'
import retrieveGoal from '../routerRequestHandlers/retrieveGoal'

/**
 * Route definitions for the pages relating to Completing A Goal
 */
export default (services: Services) => {
  const router = Router({ mergeParams: true })

  const { educationAndWorkPlanService } = services
  const completeOrArchiveGoalController = new CompleteOrArchiveGoalController()

  router.use('/goals/:goalReference/complete-or-archive', [
    checkUserHasPermissionTo(ApplicationAction.COMPLETE_AND_ARCHIVE_GOALS),
  ])
  router.get('/goals/:goalReference/complete-or-archive', [
    retrieveGoal(educationAndWorkPlanService),
    asyncMiddleware(completeOrArchiveGoalController.getCompleteOrArchiveGoalView),
  ])
  router.post('/goals/:goalReference/complete-or-archive', [
    asyncMiddleware(completeOrArchiveGoalController.submitCompleteOrArchiveGoalForm),
  ])

  return router
}
