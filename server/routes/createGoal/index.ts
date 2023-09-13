import { Router } from 'express'
import { Services } from '../../services'
import CreateGoalController from './createGoalController'
import { checkUserHasEditAuthority } from '../../middleware/roleBasedAccessControl'
import {
  checkCreateGoalFormExistsInSession,
  checkAddStepFormsArrayExistsInSession,
  checkPrisonerSummaryExistsInSession,
  checkNewGoalsFormExistsInSession,
} from '../routerRequestHandlers'

/**
 * Route definitions for the pages relating to Creating A Goal
 */
export default (router: Router, services: Services) => {
  const createGoalController = new CreateGoalController(services.educationAndWorkPlanService)

  router.use('/plan/:prisonNumber/goals/create', checkUserHasEditAuthority())
  router.get('/plan/:prisonNumber/goals/create', [
    checkPrisonerSummaryExistsInSession,
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
