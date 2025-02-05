import { Router } from 'express'
import { Services } from '../../../services'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import retrieveActionPlanReviews from '../../routerRequestHandlers/retrieveActionPlanReviews'
import ConfirmExemptionRemovalController from './confirmExemptionRemovalController'
import ExemptionRemovedController from './exemptionRemovedController'
import { checkUserHasPermissionTo } from '../../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../../enums/applicationAction'

/**
 * Route definitions to remove the exemption on a prisoner's Action Plan Review
 */
export default function exemptionRemovalActionPlanReviewRoutes(router: Router, services: Services) {
  const { auditService, reviewService } = services

  const confirmExemptionRemovalController = new ConfirmExemptionRemovalController(reviewService, auditService)
  const exemptionRemovedController = new ExemptionRemovedController()

  router.get('/plan/:prisonNumber/review/exemption/remove', [
    checkUserHasPermissionTo(ApplicationAction.REMOVE_REVIEW_EXEMPTION),
    retrieveActionPlanReviews(reviewService),
    asyncMiddleware(confirmExemptionRemovalController.getConfirmExemptionRemovalView),
  ])
  router.post('/plan/:prisonNumber/review/exemption/remove', [
    checkUserHasPermissionTo(ApplicationAction.REMOVE_REVIEW_EXEMPTION),
    asyncMiddleware(confirmExemptionRemovalController.submitConfirmExemptionRemoval),
  ])

  router.get('/plan/:prisonNumber/review/exemption/removed', [
    checkUserHasPermissionTo(ApplicationAction.REMOVE_REVIEW_EXEMPTION),
    retrieveActionPlanReviews(reviewService),
    asyncMiddleware(exemptionRemovedController.getExemptionRemovedView),
  ])
  router.post('/plan/:prisonNumber/review/exemption/removed', [
    checkUserHasPermissionTo(ApplicationAction.REMOVE_REVIEW_EXEMPTION),
    asyncMiddleware(exemptionRemovedController.submitExemptionRemoved),
  ])
}
