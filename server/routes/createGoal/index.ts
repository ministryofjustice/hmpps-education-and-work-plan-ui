import { Router } from 'express'
import { Services } from '../../services'
import config from '../../config'
import CreateGoalController from './createGoalController'
import CreateGoalControllerOriginalBehaviour from './createGoalController.originalBehaviour'
import { checkUserHasEditAuthority } from '../../middleware/roleBasedAccessControl'
import {
  checkCreateGoalFormExistsInSession,
  checkAddStepFormsArrayExistsInSession,
  checkPrisonerSummaryExistsInSession,
  checkNewGoalsFormExistsInSession,
  retrievePrisonerSummaryIfNotInSession,
} from '../routerRequestHandlers'

/**
 * Route definitions for the pages relating to Creating A Goal
 */
export default (router: Router, services: Services) => {
  if (config.featureToggles.newCreateGoalRoutesEnabled) {
    const createGoalController = new CreateGoalController(services.educationAndWorkPlanService)
    newCreateGoalRoutes(router, services, createGoalController)

    router.use('/plan/:prisonNumber/goals/review', [
      checkUserHasEditAuthority(),
      checkPrisonerSummaryExistsInSession,
      checkNewGoalsFormExistsInSession,
    ])
    router.get('/plan/:prisonNumber/goals/review', [createGoalController.getReviewGoalView])
    router.post('/plan/:prisonNumber/goals/review', [createGoalController.submitReviewGoal])
  } else {
    const createGoalController = new CreateGoalControllerOriginalBehaviour(services.educationAndWorkPlanService)
    originalCreateGoalRoutes(router, services, createGoalController)

    router.use('/plan/:prisonNumber/goals/review', checkUserHasEditAuthority())
    router.get('/plan/:prisonNumber/goals/review', [
      checkPrisonerSummaryExistsInSession,
      checkNewGoalsFormExistsInSession,
      createGoalController.getReviewGoalView,
    ])
    router.post('/plan/:prisonNumber/goals/review', [
      checkPrisonerSummaryExistsInSession,
      checkNewGoalsFormExistsInSession,
      createGoalController.submitReviewGoal,
    ])
  }
}

const originalCreateGoalRoutes = (
  router: Router,
  services: Services,
  createGoalController: CreateGoalControllerOriginalBehaviour,
) => {
  router.use('/plan/:prisonNumber/goals/create', checkUserHasEditAuthority())
  router.get('/plan/:prisonNumber/goals/create', [
    retrievePrisonerSummaryIfNotInSession(services.prisonerSearchService),
    createGoalController.getCreateGoalView,
  ])
  router.post('/plan/:prisonNumber/goals/create', [
    checkPrisonerSummaryExistsInSession,
    checkCreateGoalFormExistsInSession,
    createGoalController.submitCreateGoalForm,
  ])

  router.use('/plan/:prisonNumber/goals/add-step', checkUserHasEditAuthority())
  router.get('/plan/:prisonNumber/goals/add-step', [
    checkPrisonerSummaryExistsInSession,
    checkCreateGoalFormExistsInSession,
    createGoalController.getAddStepView,
  ])
  router.post('/plan/:prisonNumber/goals/add-step', [
    checkPrisonerSummaryExistsInSession,
    checkCreateGoalFormExistsInSession,
    createGoalController.submitAddStepForm,
  ])

  router.use('/plan/:prisonNumber/goals/add-note', checkUserHasEditAuthority())
  router.get('/plan/:prisonNumber/goals/add-note', [
    checkPrisonerSummaryExistsInSession,
    checkCreateGoalFormExistsInSession,
    checkAddStepFormsArrayExistsInSession,
    createGoalController.getAddNoteView,
  ])
  router.post('/plan/:prisonNumber/goals/add-note', [
    checkPrisonerSummaryExistsInSession,
    checkCreateGoalFormExistsInSession,
    checkAddStepFormsArrayExistsInSession,
    createGoalController.submitAddNoteForm,
  ])
}

const newCreateGoalRoutes = (router: Router, services: Services, createGoalController: CreateGoalController) => {
  router.use('/plan/:prisonNumber/goals/:goalIndex/create', [checkUserHasEditAuthority()])
  router.get('/plan/:prisonNumber/goals/:goalIndex/create', [
    retrievePrisonerSummaryIfNotInSession(services.prisonerSearchService),
    createGoalController.getCreateGoalView,
  ])
  router.post('/plan/:prisonNumber/goals/:goalIndex/create', [
    checkPrisonerSummaryExistsInSession,
    checkCreateGoalFormExistsInSession,
    createGoalController.submitCreateGoalForm,
  ])

  router.use('/plan/:prisonNumber/goals/:goalIndex/add-step/:stepIndex', [
    checkUserHasEditAuthority(),
    checkPrisonerSummaryExistsInSession,
    checkCreateGoalFormExistsInSession,
  ])
  router.get('/plan/:prisonNumber/goals/:goalIndex/add-step/:stepIndex', [createGoalController.getAddStepView])
  router.post('/plan/:prisonNumber/goals/:goalIndex/add-step/:stepIndex', [createGoalController.submitAddStepForm])

  router.use('/plan/:prisonNumber/goals/:goalIndex/add-note', [
    checkUserHasEditAuthority(),
    checkPrisonerSummaryExistsInSession,
    checkCreateGoalFormExistsInSession,
    checkAddStepFormsArrayExistsInSession,
  ])
  router.get('/plan/:prisonNumber/goals/:goalIndex/add-note', [createGoalController.getAddNoteView])
  router.post('/plan/:prisonNumber/goals/:goalIndex/add-note', [createGoalController.submitAddNoteForm])
}
