import { Router } from 'express'
import { Services } from '../../services'
import CreateGoalsController from './createGoalsController'
import { checkUserHasPermissionTo } from '../../middleware/roleBasedAccessControl'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import retrieveActionPlan from '../routerRequestHandlers/retrieveActionPlan'
import ApplicationAction from '../../enums/applicationAction'

/**
 * Route definitions for the pages relating to Creating A Goal
 */
export default (router: Router, services: Services) => {
  const { auditService, educationAndWorkPlanService } = services
  const createGoalsController = new CreateGoalsController(educationAndWorkPlanService, auditService)

  router.use('/plan/:prisonNumber/goals/create', [checkUserHasPermissionTo(ApplicationAction.CREATE_GOALS)])
  router.get('/plan/:prisonNumber/goals/create', [asyncMiddleware(createGoalsController.getCreateGoalsView)])
  router.post('/plan/:prisonNumber/goals/create', [
    retrieveActionPlan(services.educationAndWorkPlanService),
    asyncMiddleware(createGoalsController.submitCreateGoalsForm),
  ])

  router.post('/plan/:prisonNumber/goals/create/:action(REMOVE_STEP|REMOVE_GOAL|ADD_STEP|ADD_GOAL)', [
    asyncMiddleware(createGoalsController.submitAction),
  ])
}
