import { Router } from 'express'
import { Services } from '../../services'
import UnarchiveGoalController from './unarchiveGoalController'
import { checkUserHasPermissionTo } from '../../middleware/roleBasedAccessControl'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import retrieveGoals from '../routerRequestHandlers/retrieveGoals'
import GoalStatusValue from '../../enums/goalStatusValue'
import ApplicationAction from '../../enums/applicationAction'

/**
 * Route definitions for the pages relating to Unarchiving A Goal
 */
export default (router: Router, services: Services) => {
  const { auditService, educationAndWorkPlanService } = services
  const unarchiveGoalController = new UnarchiveGoalController(educationAndWorkPlanService, auditService)

  router.use('/plan/:prisonNumber/goals/:goalReference/unarchive', [
    checkUserHasPermissionTo(ApplicationAction.COMPLETE_AND_ARCHIVE_GOALS),
  ])
  router.get('/plan/:prisonNumber/goals/:goalReference/unarchive', [
    retrieveGoals(services.educationAndWorkPlanService, GoalStatusValue.ARCHIVED),
    asyncMiddleware(unarchiveGoalController.getUnarchiveGoalView),
  ])
  router.post('/plan/:prisonNumber/goals/:goalReference/unarchive', [
    asyncMiddleware(unarchiveGoalController.submitUnarchiveGoalForm),
  ])
}
