import { Router } from 'express'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import ExemptionReasonController from './exemptionReasonController'
import ConfirmExemptionController from './confirmExemptionController'
import createEmptyReviewExemptionDtoIfNotInJourneyData from '../../routerRequestHandlers/createEmptyReviewExemptionDtoIfNotInJourneyData'
import ExemptionRecordedController from './exemptionRecordedController'
import { Services } from '../../../services'
import retrieveActionPlanReviews from '../../routerRequestHandlers/retrieveActionPlanReviews'
import checkReviewExemptionDtoExistsInJourneyData from '../../routerRequestHandlers/checkReviewExemptionDtoExistsInJourneyData'
import { checkUserHasPermissionTo } from '../../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../../enums/applicationAction'
import setupJourneyData from '../../routerRequestHandlers/setupJourneyData'
import reviewExemptionSchema from '../validationSchemas/reviewExemptionSchema'
import { validate } from '../../routerRequestHandlers/validationMiddleware'
import { checkRedirectAtEndOfJourneyIsNotPending } from '../../routerRequestHandlers/checkRedirectAtEndOfJourneyIsNotPending'

/**
 * Route definitions to set a prisoner's Action Plan Review as exempt
 */
export default function exemptActionPlanReviewRoutes(services: Services) {
  const { auditService, journeyDataService, reviewService } = services

  const exemptionReasonController = new ExemptionReasonController()
  const confirmExemptionController = new ConfirmExemptionController(reviewService, auditService)
  const exemptionRecordedController = new ExemptionRecordedController()

  const router = Router({ mergeParams: true })

  router.use('/exemption', [
    checkUserHasPermissionTo(ApplicationAction.EXEMPT_REVIEW),
    setupJourneyData(journeyDataService),
  ])

  router.get('/exemption', [
    createEmptyReviewExemptionDtoIfNotInJourneyData,
    asyncMiddleware(exemptionReasonController.getExemptionReasonView),
  ])
  router.post('/exemption', [
    createEmptyReviewExemptionDtoIfNotInJourneyData,
    validate(reviewExemptionSchema),
    asyncMiddleware(exemptionReasonController.submitExemptionReasonForm),
  ])

  router.get('/exemption/confirm', [
    checkReviewExemptionDtoExistsInJourneyData,
    asyncMiddleware(confirmExemptionController.getConfirmExemptionView),
  ])
  router.post('/exemption/confirm', [
    checkReviewExemptionDtoExistsInJourneyData,
    checkRedirectAtEndOfJourneyIsNotPending({
      journey: 'Review Plan Record Exemption',
      redirectTo: '/plan/:prisonNumber/:journeyId/review/exemption/recorded',
    }),
    asyncMiddleware(confirmExemptionController.submitConfirmExemption),
  ])

  router.get('/exemption/recorded', [
    checkReviewExemptionDtoExistsInJourneyData,
    retrieveActionPlanReviews(reviewService),
    asyncMiddleware(exemptionRecordedController.getExemptionRecordedView),
  ])
  router.post('/exemption/recorded', [
    checkReviewExemptionDtoExistsInJourneyData,
    asyncMiddleware(exemptionRecordedController.submitExemptionRecorded),
  ])

  return router
}
