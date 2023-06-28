import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(service: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', (req, res, next) => {
    res.render('pages/index')
  })

  get('/plan/:prisonNumber/goals/create', (req, res, next) => {
    res.render('pages/goal/create/index')
  })

  get('/plan/:prisonNumber/goals/add-step', (req, res, next) => {
    res.render('pages/goal/add-step/index')
  })

  return router
}
