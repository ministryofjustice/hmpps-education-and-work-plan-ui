import { RequestHandler, Router } from 'express'
import { Services } from '../../services'
import CreateGoalController from './createGoalController'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import { hasEditAuthority } from '../../middleware/roleBasedAccessControl'
import { checkCreateGoalFormExistsInSession } from './routerRequestHandlers'

export default (router: Router, services: Services) => {
  const createGoalController = new CreateGoalController(
    services.prisonerSearchService,
    services.educationAndWorkPlanService,
  )
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string | string[], handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  router.use('/plan/:prisonNumber/goals/create', hasEditAuthority())
  get('/plan/:prisonNumber/goals/create', createGoalController.getCreateGoalView)
  router.post('/plan/:prisonNumber/goals/create', [
    checkCreateGoalFormExistsInSession,
    createGoalController.submitCreateGoalForm,
  ])

  router.use('/plan/:prisonNumber/goals/add-step', hasEditAuthority())
  router.get('/plan/:prisonNumber/goals/add-step', [
    checkCreateGoalFormExistsInSession,
    createGoalController.getAddStepView,
  ])
  post('/plan/:prisonNumber/goals/add-step', createGoalController.submitAddStepForm)

  router.use('/plan/:prisonNumber/goals/add-note', hasEditAuthority())
  get('/plan/:prisonNumber/goals/add-note', createGoalController.getAddNoteView)
  post('/plan/:prisonNumber/goals/add-note', createGoalController.submitAddNoteForm)
}
