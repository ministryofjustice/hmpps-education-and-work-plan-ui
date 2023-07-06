import { Router } from 'express'
import { Services } from '../../services'
import CreateGoalController from './createGoalController'
import { hasEditAuthority } from '../../middleware/roleBasedAccessControl'
import checkCreateGoalFormExistsInSession from './routerRequestHandlers'

/**
 * Route definitions for the pages relating to Creating A Goal
 */
export default (router: Router, services: Services) => {
  const createGoalController = new CreateGoalController(
    services.prisonerSearchService,
    services.educationAndWorkPlanService,
  )

  router.use('/plan/:prisonNumber/goals/create', [hasEditAuthority()])
  router.get('/plan/:prisonNumber/goals/create', createGoalController.getCreateGoalView)
  router.post('/plan/:prisonNumber/goals/create', [
    checkCreateGoalFormExistsInSession,
    createGoalController.submitCreateGoalForm,
  ])

  router.use('/plan/:prisonNumber/goals/add-step', hasEditAuthority())
  router.get('/plan/:prisonNumber/goals/add-step', [
    checkCreateGoalFormExistsInSession,
    createGoalController.getAddStepView,
  ])
  router.post('/plan/:prisonNumber/goals/add-step', [
    checkCreateGoalFormExistsInSession,
    createGoalController.submitAddStepForm,
  ])

  router.use('/plan/:prisonNumber/goals/add-note', hasEditAuthority())
  router.get('/plan/:prisonNumber/goals/add-note', [
    checkCreateGoalFormExistsInSession,
    createGoalController.getAddNoteView,
  ])
  router.post('/plan/:prisonNumber/goals/add-note', [
    checkCreateGoalFormExistsInSession,
    createGoalController.submitAddNoteForm,
  ])
}
