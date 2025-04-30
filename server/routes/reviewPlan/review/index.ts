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
export default function completeActionPlanReviewRoutes(services: Services) {
  const { auditService, reviewService } = services

  const whoCompletedReviewController = new WhoCompletedReviewController()
  const reviewNoteController = new ReviewNoteController()
  const reviewCheckYourAnswersController = new ReviewCheckYourAnswersController(reviewService, auditService)
  const reviewCompleteController = new ReviewCompleteController()

  const router = Router({ mergeParams: true })

  router.use([checkUserHasPermissionTo(ApplicationAction.RECORD_REVIEW)])

  router.get('/', [
    createEmptyReviewPlanDtoIfNotInPrisonerContext,
    asyncMiddleware(whoCompletedReviewController.getWhoCompletedReviewView),
  ])
  router.post('/', [
    createEmptyReviewPlanDtoIfNotInPrisonerContext,
    asyncMiddleware(whoCompletedReviewController.submitWhoCompletedReviewForm),
  ])

  router.get('/notes', [
    checkReviewPlanDtoExistsInPrisonerContext,
    asyncMiddleware(reviewNoteController.getReviewNoteView),
  ])
  router.post('/notes', [
    checkReviewPlanDtoExistsInPrisonerContext,
    asyncMiddleware(reviewNoteController.submitReviewNoteForm),
  ])

  router.get('/check-your-answers', [
    checkReviewPlanDtoExistsInPrisonerContext,
    asyncMiddleware(reviewCheckYourAnswersController.getReviewCheckYourAnswersView),
  ])
  router.post('/check-your-answers', [
    checkReviewPlanDtoExistsInPrisonerContext,
    asyncMiddleware(reviewCheckYourAnswersController.submitCheckYourAnswers),
  ])

  router.get('/complete', [
    checkReviewPlanDtoExistsInPrisonerContext,
    asyncMiddleware(reviewCompleteController.getReviewCompleteView),
  ])
  router.post('/complete', [
    checkReviewPlanDtoExistsInPrisonerContext,
    asyncMiddleware(reviewCompleteController.goToLearningAndWorkProgressPlan),
  ])

  return router
}
