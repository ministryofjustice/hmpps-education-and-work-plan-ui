import { Router } from 'express'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import ExemptionReasonController from './exemptionReasonController'
import ConfirmExemptionController from './confirmExemptionController'
import createEmptyReviewExemptionDtoIfNotInPrisonerContext from '../../routerRequestHandlers/createEmptyReviewExemptionDtoIfNotInPrisonerContext'
import ExemptionRecordedController from './exemptionRecordedController'
import { Services } from '../../../services'
import retrieveActionPlanReviews from '../../routerRequestHandlers/retrieveActionPlanReviews'
import checkReviewExemptionDtoExistsInPrisonerContext from '../../routerRequestHandlers/checkReviewExemptionDtoExistsInPrisonerContext'
import { checkUserHasPermissionTo } from '../../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../../enums/applicationAction'

/**
 * Route definitions to set a prisoner's Action Plan Review as exempt
 */
export default function exemptActionPlanReviewRoutes(router: Router, services: Services) {
  const { auditService, reviewService } = services

  const exemptionReasonController = new ExemptionReasonController()
  const confirmExemptionController = new ConfirmExemptionController(reviewService, auditService)
  const exemptionRecordedController = new ExemptionRecordedController()

  router.get('/plan/:prisonNumber/review/exemption', [
    checkUserHasPermissionTo(ApplicationAction.EXEMPT_REVIEW),
    createEmptyReviewExemptionDtoIfNotInPrisonerContext,
    asyncMiddleware(exemptionReasonController.getExemptionReasonView),
  ])
  router.post('/plan/:prisonNumber/review/exemption', [
    checkUserHasPermissionTo(ApplicationAction.EXEMPT_REVIEW),
    createEmptyReviewExemptionDtoIfNotInPrisonerContext,
    asyncMiddleware(exemptionReasonController.submitExemptionReasonForm),
  ])

  router.get('/plan/:prisonNumber/review/exemption/confirm', [
    checkUserHasPermissionTo(ApplicationAction.EXEMPT_REVIEW),
    checkReviewExemptionDtoExistsInPrisonerContext,
    asyncMiddleware(confirmExemptionController.getConfirmExemptionView),
  ])
  router.post('/plan/:prisonNumber/review/exemption/confirm', [
    checkUserHasPermissionTo(ApplicationAction.EXEMPT_REVIEW),
    checkReviewExemptionDtoExistsInPrisonerContext,
    asyncMiddleware(confirmExemptionController.submitConfirmExemption),
  ])

  router.get('/plan/:prisonNumber/review/exemption/recorded', [
    checkUserHasPermissionTo(ApplicationAction.EXEMPT_REVIEW),
    checkReviewExemptionDtoExistsInPrisonerContext,
    retrieveActionPlanReviews(reviewService),
    asyncMiddleware(exemptionRecordedController.getExemptionRecordedView),
  ])
  router.post('/plan/:prisonNumber/review/exemption/recorded', [
    checkUserHasPermissionTo(ApplicationAction.EXEMPT_REVIEW),
    checkReviewExemptionDtoExistsInPrisonerContext,
    asyncMiddleware(exemptionRecordedController.submitExemptionRecorded),
  ])
}
