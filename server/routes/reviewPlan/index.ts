import { RequestHandler, Router } from 'express'
import createError from 'http-errors'
import { Services } from '../../services'
import completeActionPlanReviewRoutes from './review'
import exemptActionPlanReviewRoutes from './exemption'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import config from '../../config'
import { checkUserHasEditAuthority } from '../../middleware/roleBasedAccessControl'
import exemptionRemovalActionPlanReviewRoutes from './removeExemption'

/**
 * Route definitions for the review plan journeys
 */
export default function reviewPlanRoutes(router: Router, services: Services) {
  router.get('/plan/:prisonNumber/review', [checkPrisonIsEnabled(), checkUserHasEditAuthority()])
  router.get('/plan/:prisonNumber/review/**', [checkPrisonIsEnabled(), checkUserHasEditAuthority()])

  completeActionPlanReviewRoutes(router, services)
  exemptActionPlanReviewRoutes(router, services)
  exemptionRemovalActionPlanReviewRoutes(router, services)
}

const checkPrisonIsEnabled = (): RequestHandler => {
  return asyncMiddleware((req, res, next) => {
    const { activeCaseLoadId } = res.locals.user
    if (config.featureToggles.reviewJourneyEnabledForPrison(activeCaseLoadId)) {
      return next()
    }
    return next(createError(404, `Route ${req.originalUrl} not enabled for prison ${activeCaseLoadId}`))
  })
}
