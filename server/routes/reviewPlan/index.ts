import { RequestHandler, Router } from 'express'
import createError from 'http-errors'
import config from '../../config'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import { checkUserHasEditAuthority } from '../../middleware/roleBasedAccessControl'

const ENABLED_PRISONS_FOR_REVIEW_JOURNEYS = config.featureToggles.reviewsPrisonsEnabled
  .split(',')
  .map(prisonId => prisonId.trim())

/**
 * Route definitions for the review plan journeys
 */
export default function reviewPlanRoutes(): Router {
  const router = Router()

  router.use([checkPrisonIsEnabled(), checkUserHasEditAuthority()])

  router.get('/', async (_req, res, next) => {
    // TODO implement controller for First review page
  })

  router.get('/notes', async (_req, res, next) => {
    // TODO implement controller for Review notes page
  })

  router.get('/check-your-answers', async (_req, res, next) => {
    // TODO implement controller for Review check your answers page
  })

  router.get('/complete', async (_req, res, next) => {
    // TODO implement controller for Review complete page
  })

  router.get('/exemption', async (_req, res, next) => {
    // TODO implement controller for Review exemption page
  })

  router.get('/exemption-recorded', async (_req, res, next) => {
    // TODO implement controller for Review exemption recorded page
  })

  return router
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
