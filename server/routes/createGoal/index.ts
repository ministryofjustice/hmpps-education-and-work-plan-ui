import { RequestHandler, Router } from 'express'
import { Services } from '../../services'
import CreateGoalController from './createGoalController'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import { hasEditAuthority } from '../../middleware/roleBasedAccessControl'

export default (router: Router, services: Services) => {
  const createGoalController = new CreateGoalController(services.prisonerSearchService)
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string | string[], handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  router.use('/plan/:prisonNumber/goals/create', hasEditAuthority())
  get('/plan/:prisonNumber/goals/create', createGoalController.getCreateGoalView)
  post('/plan/:prisonNumber/goals/create', createGoalController.submitCreateGoalForm)

  router.use('/plan/:prisonNumber/goals/add-step', hasEditAuthority())
  get('/plan/:prisonNumber/goals/add-step', createGoalController.getAddStepView)
  post('/plan/:prisonNumber/goals/add-step', createGoalController.submitAddStepForm)

  router.use('/plan/:prisonNumber/goals/add-note', hasEditAuthority())
  get('/plan/:prisonNumber/goals/add-note', createGoalController.getAddNoteView)
}
