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
  router.get('/prisoners/:prisonNumber/induction/exemption', [checkPrisonIsEnabled()])
  router.get('/prisoners/:prisonNumber/induction/exemption/**', [checkPrisonIsEnabled()])

  exemptInductionRoutes(router, services)
  removeInductionExemptionRoutes(router, services)
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
