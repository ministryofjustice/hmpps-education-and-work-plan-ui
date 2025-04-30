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
export default function exemptActionPlanReviewRoutes(services: Services) {
  const { auditService, reviewService } = services

  const exemptionReasonController = new ExemptionReasonController()
  const confirmExemptionController = new ConfirmExemptionController(reviewService, auditService)
  const exemptionRecordedController = new ExemptionRecordedController()

  const router = Router({ mergeParams: true })

  router.use('/exemption', [checkUserHasPermissionTo(ApplicationAction.EXEMPT_REVIEW)])

  router.get('/exemption', [
    createEmptyReviewExemptionDtoIfNotInPrisonerContext,
    asyncMiddleware(exemptionReasonController.getExemptionReasonView),
  ])
  router.post('/exemption', [
    createEmptyReviewExemptionDtoIfNotInPrisonerContext,
    asyncMiddleware(exemptionReasonController.submitExemptionReasonForm),
  ])

  router.get('/exemption/confirm', [
    checkReviewExemptionDtoExistsInPrisonerContext,
    asyncMiddleware(confirmExemptionController.getConfirmExemptionView),
  ])
  router.post('/exemption/confirm', [
    checkReviewExemptionDtoExistsInPrisonerContext,
    asyncMiddleware(confirmExemptionController.submitConfirmExemption),
  ])

  router.get('/exemption/recorded', [
    checkReviewExemptionDtoExistsInPrisonerContext,
    retrieveActionPlanReviews(reviewService),
    asyncMiddleware(exemptionRecordedController.getExemptionRecordedView),
  ])
  router.post('/exemption/recorded', [
    checkReviewExemptionDtoExistsInPrisonerContext,
    asyncMiddleware(exemptionRecordedController.submitExemptionRecorded),
  ])

  return router
}
