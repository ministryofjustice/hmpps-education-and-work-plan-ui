import { RequestHandler, Router } from 'express'
import createError from 'http-errors'
import { Services } from '../../../services'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import config from '../../../config'
import exemptInductionRoutes from './exemption'
import removeInductionExemptionRoutes from './removeExemption'

/**
 * Route definitions for exempting, and removing the exemption of a prisoner's Induction
 */
export default (router: Router, services: Services) => {
  router.get('/prisoners/:prisonNumber/induction/exemption', [checkInductionReviewsFeatureIsEnabled()])
  router.get('/prisoners/:prisonNumber/induction/exemption/**', [checkInductionReviewsFeatureIsEnabled()])

  exemptInductionRoutes(router, services)
  removeInductionExemptionRoutes(router, services)
}

const checkInductionReviewsFeatureIsEnabled = (): RequestHandler => {
  return asyncMiddleware((req, res, next) => {
    if (config.featureToggles.reviewsEnabled) {
      return next()
    }
    return next(createError(404, `Route ${req.originalUrl} not enabled`))
  })
}
