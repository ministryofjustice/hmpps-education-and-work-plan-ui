import { Router } from 'express'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import ExemptionReasonController from './exemptionReasonController'
import ConfirmExemptionController from './confirmExemptionController'
import createEmptyReviewExemptionDtoIfNotInPrisonerContext from '../../routerRequestHandlers/createEmptyReviewExemptionDtoIfNotInPrisonerContext'
import ExemptionRecordedController from './exemptionRecordedController'
import { Services } from '../../../services'
import retrieveActionPlanReviews from '../../routerRequestHandlers/retrieveActionPlanReviews'
import checkReviewExemptionDtoExistsInPrisonerContext from '../../routerRequestHandlers/checkReviewExemptionDtoExistsInPrisonerContext'

/**
 * Route definitions to set a prisoner's Action Plan Review as exempt
 */
export default function exemptActionPlanReviewRoutes(router: Router, services: Services) {
  const { auditService, reviewService } = services

  const exemptionReasonController = new ExemptionReasonController()
  const confirmExemptionController = new ConfirmExemptionController(reviewService, auditService)
  const exemptionRecordedController = new ExemptionRecordedController()

  router.get('/plan/:prisonNumber/review/exemption', [
    createEmptyReviewExemptionDtoIfNotInPrisonerContext,
    asyncMiddleware(exemptionReasonController.getExemptionReasonView),
  ])
  router.post('/plan/:prisonNumber/review/exemption', [
    createEmptyReviewExemptionDtoIfNotInPrisonerContext,
    asyncMiddleware(exemptionReasonController.submitExemptionReasonForm),
  ])

  router.get('/plan/:prisonNumber/review/exemption/confirm', [
    checkReviewExemptionDtoExistsInPrisonerContext,
    asyncMiddleware(confirmExemptionController.getConfirmExemptionView),
  ])
  router.post('/plan/:prisonNumber/review/exemption/confirm', [
    checkReviewExemptionDtoExistsInPrisonerContext,
    asyncMiddleware(confirmExemptionController.submitConfirmExemption),
  ])

  router.get('/plan/:prisonNumber/review/exemption/recorded', [
    checkReviewExemptionDtoExistsInPrisonerContext,
    retrieveActionPlanReviews(reviewService),
    asyncMiddleware(exemptionRecordedController.getExemptionRecordedView),
  ])
  router.post('/plan/:prisonNumber/review/exemption/recorded', [
    checkReviewExemptionDtoExistsInPrisonerContext,
    asyncMiddleware(exemptionRecordedController.goToLearningAndWorkProgressPlan),
  ])
}
