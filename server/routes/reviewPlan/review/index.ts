import { Router } from 'express'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import WhoCompletedReviewController from './whoCompletedReviewController'
import createEmptyReviewPlanDtoIfNotInPrisonerContext from '../../routerRequestHandlers/createEmptyReviewPlanDtoIfNotInPrisonerContext'
import checkReviewPlanDtoExistsInPrisonerContext from '../../routerRequestHandlers/checkReviewPlanDtoExistsInPrisonerContext'
import ReviewNoteController from './reviewNoteController'
import ReviewCheckYourAnswersController from './reviewCheckYourAnswersController'
import ReviewCompleteController from './reviewCompleteController'
import { Services } from '../../../services'
import { checkUserHasPermissionTo } from '../../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../../enums/applicationAction'

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
    checkUserHasPermissionTo(ApplicationAction.RECORD_REVIEW),
    createEmptyReviewPlanDtoIfNotInPrisonerContext,
    asyncMiddleware(whoCompletedReviewController.getWhoCompletedReviewView),
  ])
  router.post('/plan/:prisonNumber/review', [
    checkUserHasPermissionTo(ApplicationAction.RECORD_REVIEW),
    createEmptyReviewPlanDtoIfNotInPrisonerContext,
    asyncMiddleware(whoCompletedReviewController.submitWhoCompletedReviewForm),
  ])

  router.get('/plan/:prisonNumber/review/notes', [
    checkUserHasPermissionTo(ApplicationAction.RECORD_REVIEW),
    checkReviewPlanDtoExistsInPrisonerContext,
    asyncMiddleware(reviewNoteController.getReviewNoteView),
  ])
  router.post('/plan/:prisonNumber/review/notes', [
    checkUserHasPermissionTo(ApplicationAction.RECORD_REVIEW),
    checkReviewPlanDtoExistsInPrisonerContext,
    asyncMiddleware(reviewNoteController.submitReviewNoteForm),
  ])

  router.get('/plan/:prisonNumber/review/check-your-answers', [
    checkUserHasPermissionTo(ApplicationAction.RECORD_REVIEW),
    checkReviewPlanDtoExistsInPrisonerContext,
    asyncMiddleware(reviewCheckYourAnswersController.getReviewCheckYourAnswersView),
  ])
  router.post('/plan/:prisonNumber/review/check-your-answers', [
    checkUserHasPermissionTo(ApplicationAction.RECORD_REVIEW),
    checkReviewPlanDtoExistsInPrisonerContext,
    asyncMiddleware(reviewCheckYourAnswersController.submitCheckYourAnswers),
  ])

  router.get('/plan/:prisonNumber/review/complete', [
    checkUserHasPermissionTo(ApplicationAction.RECORD_REVIEW),
    checkReviewPlanDtoExistsInPrisonerContext,
    asyncMiddleware(reviewCompleteController.getReviewCompleteView),
  ])
  router.post('/plan/:prisonNumber/review/complete', [
    checkUserHasPermissionTo(ApplicationAction.RECORD_REVIEW),
    checkReviewPlanDtoExistsInPrisonerContext,
    asyncMiddleware(reviewCompleteController.goToLearningAndWorkProgressPlan),
  ])
}
