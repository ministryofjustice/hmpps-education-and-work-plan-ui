import { Router } from 'express'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import WhoCompletedReviewController from './whoCompletedReviewController'
import createEmptyReviewPlanDtoIfNotInJourneyData from '../../routerRequestHandlers/createEmptyReviewPlanDtoIfNotInJourneyData'
import checkReviewPlanDtoExistsInJourneyData from '../../routerRequestHandlers/checkReviewPlanDtoExistsInJourneyData'
import ReviewNoteController from './reviewNoteController'
import ReviewCheckYourAnswersController from './reviewCheckYourAnswersController'
import ReviewCompleteController from './reviewCompleteController'
import { Services } from '../../../services'
import { checkUserHasPermissionTo } from '../../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../../enums/applicationAction'
import setupJourneyData from '../../routerRequestHandlers/setupJourneyData'
import whoCompletedReviewSchema from '../validationSchemas/whoCompletedReviewSchema'
import { validate } from '../../routerRequestHandlers/validationMiddleware'
import reviewNoteSchema from '../validationSchemas/reviewNoteSchema'

/**
 * Route definitions to complete a prisoner's Action Plan Review
 */
export default function completeActionPlanReviewRoutes(services: Services) {
  const { auditService, journeyDataService, reviewService } = services

  const whoCompletedReviewController = new WhoCompletedReviewController()
  const reviewNoteController = new ReviewNoteController()
  const reviewCheckYourAnswersController = new ReviewCheckYourAnswersController(reviewService, auditService)
  const reviewCompleteController = new ReviewCompleteController()

  const router = Router({ mergeParams: true })

  router.use([
    // comment to allow formatting code with line breaks
    checkUserHasPermissionTo(ApplicationAction.RECORD_REVIEW),
    setupJourneyData(journeyDataService),
  ])

  router.get('/', [
    createEmptyReviewPlanDtoIfNotInJourneyData,
    asyncMiddleware(whoCompletedReviewController.getWhoCompletedReviewView),
  ])
  router.post('/', [
    createEmptyReviewPlanDtoIfNotInJourneyData,
    validate(whoCompletedReviewSchema),
    asyncMiddleware(whoCompletedReviewController.submitWhoCompletedReviewForm),
  ])

  router.get('/notes', [
    // comment to allow formatting code with line breaks
    checkReviewPlanDtoExistsInJourneyData,
    asyncMiddleware(reviewNoteController.getReviewNoteView),
  ])
  router.post('/notes', [
    checkReviewPlanDtoExistsInJourneyData,
    validate(reviewNoteSchema),
    asyncMiddleware(reviewNoteController.submitReviewNoteForm),
  ])

  router.get('/check-your-answers', [
    checkReviewPlanDtoExistsInJourneyData,
    asyncMiddleware(reviewCheckYourAnswersController.getReviewCheckYourAnswersView),
  ])
  router.post('/check-your-answers', [
    checkReviewPlanDtoExistsInJourneyData,
    asyncMiddleware(reviewCheckYourAnswersController.submitCheckYourAnswers),
  ])

  router.get('/complete', [
    checkReviewPlanDtoExistsInJourneyData,
    asyncMiddleware(reviewCompleteController.getReviewCompleteView),
  ])
  router.post('/complete', [
    checkReviewPlanDtoExistsInJourneyData,
    asyncMiddleware(reviewCompleteController.goToLearningAndWorkProgressPlan),
  ])

  return router
}
