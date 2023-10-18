import { type RequestHandler, Router } from 'express'
import type { Services } from '../services'
import config from '../config'
import asyncMiddleware from '../middleware/asyncMiddleware'
import createGoal from './createGoal'
import updateGoal from './updateGoal'
import overview from './overview'
import functionalSkills from './functionalSkills'
import prisonerList from './prisonerList'

export default function routes(services: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  if (config.featureToggles.plpPrisonerListAndOverviewPagesEnabled) {
    prisonerList(router)
  } else {
    get('/', (req, res, next) => {
      res.redirect(config.ciagInductionUrl)
    })
  }

  overview(router, services)
  createGoal(router, services)
  updateGoal(router, services)
  functionalSkills(router, services)

  return router
}
