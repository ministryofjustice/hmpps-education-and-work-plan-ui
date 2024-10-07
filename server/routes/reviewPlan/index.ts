import { RequestHandler, Router } from 'express'
import createError from 'http-errors'
import config from '../../config'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import { checkUserHasEditAuthority } from '../../middleware/roleBasedAccessControl'
import WhoCompletedReviewController from './whoCompletedReviewController'
import createEmptyReviewPlanDtoIfNotInPrisonerContext from '../routerRequestHandlers/createEmptyReviewPlanDtoIfNotInPrisonerContext'
import checkReviewPlanDtoExistsInPrisonerContext from '../routerRequestHandlers/checkReviewPlanDtoExistsInPrisonerContext'
import ReviewNoteController from './reviewNoteController'

const ENABLED_PRISONS_FOR_REVIEW_JOURNEYS = config.featureToggles.reviewsPrisonsEnabled
  .split(',')
  .map(prisonId => prisonId.trim())

/**
 * Route definitions for the review plan journeys
 */
export default function reviewPlanRoutes(router: Router) {
  const whoCompletedReviewController = new WhoCompletedReviewController()
  const reviewNoteController = new ReviewNoteController()

  router.use('/plan/:prisonNumber/review/**', [
    checkPrisonIsEnabled(),
    checkUserHasEditAuthority(),
    checkReviewPlanDtoExistsInPrisonerContext,
  ])

  router.use('/plan/:prisonNumber/review', [
    checkPrisonIsEnabled(),
    checkUserHasEditAuthority(),
    createEmptyReviewPlanDtoIfNotInPrisonerContext,
  ])

  router.get('/plan/:prisonNumber/review', asyncMiddleware(whoCompletedReviewController.getWhoCompletedReviewView))
  router.post('/plan/:prisonNumber/review', asyncMiddleware(whoCompletedReviewController.submitWhoCompletedReviewForm))

  router.get('/plan/:prisonNumber/review/notes', asyncMiddleware(reviewNoteController.getReviewNoteView))
  router.post('/plan/:prisonNumber/review/notes', asyncMiddleware(reviewNoteController.submitReviewNoteForm))

  router.get('/plan/:prisonNumber/review/check-your-answers', async (_req, res, next) => {
    // TODO implement controller for Review check your answers page
  })

  router.get('/plan/:prisonNumber/review/complete', async (_req, res, next) => {
    // TODO implement controller for Review complete page
  })

  router.get('/plan/:prisonNumber/review/exemption', async (_req, res, next) => {
    // TODO implement controller for Review exemption page
  })

  router.get('/plan/:prisonNumber/review/exemption-recorded', async (_req, res, next) => {
    // TODO implement controller for Review exemption recorded page
  })
}

const checkPrisonIsEnabled = (): RequestHandler => {
  return asyncMiddleware((req, res, next) => {
    const { activeCaseLoadId } = res.locals.user
    if (ENABLED_PRISONS_FOR_REVIEW_JOURNEYS.includes(activeCaseLoadId)) {
      return next()
    }
    return next(createError(404, `Route ${req.originalUrl} not enabled for prison ${activeCaseLoadId}`))
  })
}
