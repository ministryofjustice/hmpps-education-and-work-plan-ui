import { Router } from 'express'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import WhoCompletedReviewController from './whoCompletedReviewController'
import createEmptyReviewPlanDtoIfNotInPrisonerContext from '../../routerRequestHandlers/createEmptyReviewPlanDtoIfNotInPrisonerContext'
import checkReviewPlanDtoExistsInPrisonerContext from '../../routerRequestHandlers/checkReviewPlanDtoExistsInPrisonerContext'
import ReviewNoteController from './reviewNoteController'
import ReviewCheckYourAnswersController from './reviewCheckYourAnswersController'
import ReviewCompleteController from './reviewCompleteController'
import { Services } from '../../../services'

/**
 * Route definitions to complete a prisoner's Action Plan Review
 */
export default function completeActionPlanReviewRoutes(router: Router, services: Services) {
  const { auditService, reviewService } = services

  const whoCompletedReviewController = new WhoCompletedReviewController()
  const reviewNoteController = new ReviewNoteController()
  const reviewCheckYourAnswersController = new ReviewCheckYourAnswersController(reviewService, auditService)
  const reviewCompleteController = new ReviewCompleteController()

  router.get('/plan/:prisonNumber/review', [
    createEmptyReviewPlanDtoIfNotInPrisonerContext,
    asyncMiddleware(whoCompletedReviewController.getWhoCompletedReviewView),
  ])
  router.post('/plan/:prisonNumber/review', [
    createEmptyReviewPlanDtoIfNotInPrisonerContext,
    asyncMiddleware(whoCompletedReviewController.submitWhoCompletedReviewForm),
  ])

  router.get('/plan/:prisonNumber/review/notes', [
    checkReviewPlanDtoExistsInPrisonerContext,
    asyncMiddleware(reviewNoteController.getReviewNoteView),
  ])
  router.post('/plan/:prisonNumber/review/notes', [
    checkReviewPlanDtoExistsInPrisonerContext,
    asyncMiddleware(reviewNoteController.submitReviewNoteForm),
  ])

  router.get('/plan/:prisonNumber/review/check-your-answers', [
    checkReviewPlanDtoExistsInPrisonerContext,
    asyncMiddleware(reviewCheckYourAnswersController.getReviewCheckYourAnswersView),
  ])
  router.post('/plan/:prisonNumber/review/check-your-answers', [
    checkReviewPlanDtoExistsInPrisonerContext,
    asyncMiddleware(reviewCheckYourAnswersController.submitCheckYourAnswers),
  ])

  router.get('/plan/:prisonNumber/review/complete', [
    checkReviewPlanDtoExistsInPrisonerContext,
    asyncMiddleware(reviewCompleteController.getReviewCompleteView),
  ])
  router.post('/plan/:prisonNumber/review/complete', [
    checkReviewPlanDtoExistsInPrisonerContext,
    asyncMiddleware(reviewCompleteController.goToLearningAndWorkProgressPlan),
  ])
}
