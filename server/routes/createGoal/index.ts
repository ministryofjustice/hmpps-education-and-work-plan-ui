import { Router } from 'express'
import { Services } from '../../services'
import CreateGoalController from './createGoalController'
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
  const createGoalController = new CreateGoalController(services.educationAndWorkPlanService)
  createGoalRoutes(router, services, createGoalController)

  router.use('/plan/:prisonNumber/goals/review', [
    checkUserHasEditAuthority(),
    checkPrisonerSummaryExistsInSession,
    checkNewGoalsFormExistsInSession,
  ])
  router.get('/plan/:prisonNumber/goals/review', [createGoalController.getReviewGoalView])
  router.post('/plan/:prisonNumber/goals/review', [createGoalController.submitReviewGoal])
}

const createGoalRoutes = (router: Router, services: Services, createGoalController: CreateGoalController) => {
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
