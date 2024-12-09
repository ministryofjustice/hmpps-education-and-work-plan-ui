import { Router } from 'express'
import { Services } from '../../services'
import CompleteGoalController from './completeGoalController'
import { checkUserHasEditAuthority } from '../../middleware/roleBasedAccessControl'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import retrieveAllGoalsForPrisoner from '../routerRequestHandlers/retrieveAllGoalsForPrisoner'

/**
 * Route definitions for the pages relating to Completing A Goal
 */
export default (router: Router, services: Services) => {
  const { auditService, educationAndWorkPlanService } = services
  const completeGoalController = new CompleteGoalController(educationAndWorkPlanService, auditService)

  router.use('/plan/:prisonNumber/goals/:goalReference/complete', [checkUserHasEditAuthority()])
  router.get('/plan/:prisonNumber/goals/:goalReference/complete', [
    retrieveAllGoalsForPrisoner(services.educationAndWorkPlanService),
    asyncMiddleware(completeGoalController.getCompleteGoalView),
  ])
  router.post('/plan/:prisonNumber/goals/:goalReference/complete', [
    asyncMiddleware(completeGoalController.submitCompleteGoalForm),
  ])
}
