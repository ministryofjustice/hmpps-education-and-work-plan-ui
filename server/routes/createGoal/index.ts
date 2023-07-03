import { RequestHandler, Router } from 'express'
import { Services } from '../../services'
import CreateGoalController from './createGoalController'
import asyncMiddleware from '../../middleware/asyncMiddleware'

export default (router: Router, services: Services) => {
  const createGoalController = new CreateGoalController(services.prisonerSearchService)
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string | string[], handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  get('/plan/:prisonNumber/goals/create', createGoalController.getCreateGoalView)
  post('/plan/:prisonNumber/goals/create', createGoalController.submitCreateGoalForm)

  get('/plan/:prisonNumber/goals/add-step', createGoalController.getAddStepView)

  get('/plan/:prisonNumber/goals/add-note', createGoalController.getAddNoteView)
}
