import { Router } from 'express'
import { Services } from '../../../services'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import retrieveActionPlanReviews from '../../routerRequestHandlers/retrieveActionPlanReviews'
import ConfirmExemptionRemovalController from './confirmExemptionRemovalController'
import ExemptionRemovedController from './exemptionRemovedController'
import { checkUserHasPermissionTo } from '../../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../../enums/applicationAction'
import { checkRedirectAtEndOfJourneyIsNotPending } from '../../routerRequestHandlers/checkRedirectAtEndOfJourneyIsNotPending'

/**
 * Route definitions to remove the exemption on a prisoner's Action Plan Review
 */
export default function exemptionRemovalActionPlanReviewRoutes(services: Services) {
  const { auditService, reviewService } = services

  const confirmExemptionRemovalController = new ConfirmExemptionRemovalController(reviewService, auditService)
  const exemptionRemovedController = new ExemptionRemovedController()

  const router = Router({ mergeParams: true })

  router.use('/exemption', [checkUserHasPermissionTo(ApplicationAction.REMOVE_REVIEW_EXEMPTION)])

  router.get('/exemption/remove', [
    retrieveActionPlanReviews(reviewService),
    asyncMiddleware(confirmExemptionRemovalController.getConfirmExemptionRemovalView),
  ])
  router.post('/exemption/remove', [
    checkRedirectAtEndOfJourneyIsNotPending({
      journey: 'Review Plan Remove Exemption',
      redirectTo: '/plan/:prisonNumber/:journeyId/review/exemption/removed',
    }),
    asyncMiddleware(confirmExemptionRemovalController.submitConfirmExemptionRemoval),
  ])

  router.get('/exemption/removed', [
    retrieveActionPlanReviews(reviewService),
    asyncMiddleware(exemptionRemovedController.getExemptionRemovedView),
  ])
  router.post('/exemption/removed', [asyncMiddleware(exemptionRemovedController.submitExemptionRemoved)])

  return router
}
