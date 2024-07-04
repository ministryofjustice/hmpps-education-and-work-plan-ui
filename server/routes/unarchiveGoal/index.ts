import { Router } from 'express'
import { Services } from '../../services'
import UnarchiveGoalController from './unarchiveGoalController'
import { checkUserHasEditAuthority } from '../../middleware/roleBasedAccessControl'
import asyncMiddleware from '../../middleware/asyncMiddleware'

/**
 * Route definitions for the pages relating to Unarchiving A Goal
 */
export default (router: Router, services: Services) => {
  const unarchiveGoalController = new UnarchiveGoalController(services.educationAndWorkPlanService)

  router.use('/plan/:prisonNumber/goals/:goalReference/unarchive', [checkUserHasEditAuthority()])
  router.get('/plan/:prisonNumber/goals/:goalReference/unarchive', [
    asyncMiddleware(unarchiveGoalController.getUnarchiveGoalView),
  ])
  router.post('/plan/:prisonNumber/goals/:goalReference/unarchive', [
    asyncMiddleware(unarchiveGoalController.submitUnarchiveGoalForm),
  ])
}
