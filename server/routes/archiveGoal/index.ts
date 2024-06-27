import { Router } from 'express'
import { Services } from '../../services'
import ArchiveGoalController from './archiveGoalController'
import { checkUserHasEditAuthority } from '../../middleware/roleBasedAccessControl'
import asyncMiddleware from '../../middleware/asyncMiddleware'

/**
 * Route definitions for the pages relating to Archiving A Goal
 */
export default (router: Router, services: Services) => {
  const archiveGoalController = new ArchiveGoalController(services.educationAndWorkPlanService)

  router.use('/plan/:prisonNumber/goals/:goalReference/archive', [checkUserHasEditAuthority()])
  router.get('/plan/:prisonNumber/goals/:goalReference/archive', [
    asyncMiddleware(archiveGoalController.getArchiveGoalView),
  ])
  router.post('/plan/:prisonNumber/goals/:goalReference/archive', [
    asyncMiddleware(archiveGoalController.submitArchiveGoalForm),
  ])
  router.use('/plan/:prisonNumber/goals/:goalReference/archive/review', [checkUserHasEditAuthority()])
  router.get('/plan/:prisonNumber/goals/:goalReference/archive/review', [
    asyncMiddleware(archiveGoalController.getReviewArchiveGoalView),
  ])
  router.post('/plan/:prisonNumber/goals/:goalReference/archive/review', [
    asyncMiddleware(archiveGoalController.submitReviewArchiveGoal),
  ])
}
