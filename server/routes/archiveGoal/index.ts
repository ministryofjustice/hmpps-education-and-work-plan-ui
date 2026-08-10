import { Router } from 'express'
import { Services } from '../../services'
import ArchiveGoalController from './archiveGoalController'
import { checkUserHasPermissionTo } from '../../middleware/roleBasedAccessControl'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import ApplicationAction from '../../enums/applicationAction'
import { checkRedirectAtEndOfJourneyIsNotPending } from '../routerRequestHandlers/checkRedirectAtEndOfJourneyIsNotPending'
import retrieveGoal from '../routerRequestHandlers/retrieveGoal'
import archiveGoalSchema from './validationSchemas/archiveGoalSchema'
import { validate } from '../routerRequestHandlers/validationMiddleware'

/**
 * Route definitions for the pages relating to Archiving A Goal
 */
export default (services: Services) => {
  const router = Router({ mergeParams: true })

  const { educationAndWorkPlanService, auditService } = services
  const archiveGoalController = new ArchiveGoalController(educationAndWorkPlanService, auditService)

  router.use('/goals/:goalReference/archive', [checkUserHasPermissionTo(ApplicationAction.COMPLETE_AND_ARCHIVE_GOALS)])
  router.get('/goals/:goalReference/archive', [
    retrieveGoal(educationAndWorkPlanService),
    asyncMiddleware(archiveGoalController.getArchiveGoalView),
  ])
  router.post('/goals/:goalReference/archive', [
    validate(archiveGoalSchema),
    asyncMiddleware(archiveGoalController.submitArchiveGoalForm),
  ])

  router.get('/goals/:goalReference/archive/review', [asyncMiddleware(archiveGoalController.getReviewArchiveGoalView)])
  router.post('/goals/:goalReference/archive/review', [
    checkRedirectAtEndOfJourneyIsNotPending({
      journey: 'Archive Goal',
      redirectTo: '/plan/:prisonNumber/view/overview',
    }),
    asyncMiddleware(archiveGoalController.submitReviewArchiveGoal),
  ])

  router.get('/goals/:goalReference/archive/cancel', [asyncMiddleware(archiveGoalController.cancelArchiveGoal)])

  return router
}
