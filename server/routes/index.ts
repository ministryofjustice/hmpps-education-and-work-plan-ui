import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'

import createGoal from './createGoal'
import updateGoal from './updateGoal'
import overview from './overview'

export default function routes(services: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', (req, res, next) => {
    res.render('pages/index')
  })

  overview(router, services)
  createGoal(router, services)
  updateGoal(router, services)

  return router
}
