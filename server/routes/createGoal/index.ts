import { RequestHandler, Router } from 'express'
import { Services } from '../../services'
import CreateGoalController from './createGoalController'
import asyncMiddleware from '../../middleware/asyncMiddleware'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (router: Router, services: Services) => {
  const createGoalController = new CreateGoalController()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/plan/:prisonNumber/goals/create', createGoalController.getCreateGoalView)
  get('/plan/:prisonNumber/goals/add-step', createGoalController.getAddStepView)
  get('/plan/:prisonNumber/goals/add-note', createGoalController.getAddNoteView)
}
