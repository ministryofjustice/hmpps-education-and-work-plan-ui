import { Router } from 'express'
import { Services } from '../../services'
import ArchiveGoalController from './archiveGoalController'
import { checkUserHasEditAuthority } from '../../middleware/roleBasedAccessControl'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import retrieveGoals from '../routerRequestHandlers/retrieveGoals'
import GoalStatusValue from '../../enums/goalStatusValue'

/**
 * Route definitions for the pages relating to Archiving A Goal
 */
export default (router: Router, services: Services) => {
  const { educationAndWorkPlanService, auditService } = services
  const archiveGoalController = new ArchiveGoalController(educationAndWorkPlanService, auditService)

  router.use('/plan/:prisonNumber/goals/:goalReference/archive', [checkUserHasEditAuthority()])
  router.get('/plan/:prisonNumber/goals/:goalReference/archive', [
    retrieveGoals(services.educationAndWorkPlanService, GoalStatusValue.ACTIVE),
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
  router.use('/plan/:prisonNumber/goals/:goalReference/archive/cancel', [checkUserHasEditAuthority()])
  router.get('/plan/:prisonNumber/goals/:goalReference/archive/cancel', [
    asyncMiddleware(archiveGoalController.cancelArchiveGoal),
  ])
}
