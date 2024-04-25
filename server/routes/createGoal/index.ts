import { Router } from 'express'
import { Services } from '../../services'
import config from '../../config'
import CreateGoalController from './createGoalController'
import CreateGoalsController from './createGoalsController'
import { checkUserHasEditAuthority } from '../../middleware/roleBasedAccessControl'
import checkNewGoalsFormExistsInSession from '../routerRequestHandlers/checkNewGoalsFormExistsInSession'
import checkPrisonerSummaryExistsInSession from '../routerRequestHandlers/checkPrisonerSummaryExistsInSession'
import checkAddStepFormsArrayExistsInSession from '../routerRequestHandlers/checkAddStepFormsArrayExistsInSession'
import checkCreateGoalFormExistsInSession from '../routerRequestHandlers/checkCreateGoalFormExistsInSession'
import asyncMiddleware from '../../middleware/asyncMiddleware'

/**
 * Route definitions for the pages relating to Creating A Goal
 */
export default (router: Router, services: Services) => {
  const createGoalController = new CreateGoalController(services.educationAndWorkPlanService)
  const createGoalsController = new CreateGoalsController(services.educationAndWorkPlanService)
  if (config.featureToggles.newCreateGoalJourneyEnabled) {
    // TODO: RR-734 - Create route classes new create goal journey
    newCreateGoalRoutes(router, services, createGoalsController)
  } else {
    createGoalRoutes(router, services, createGoalController)
  }

  router.use('/plan/:prisonNumber/goals/review', [
    checkUserHasEditAuthority(),
    checkPrisonerSummaryExistsInSession,
    checkNewGoalsFormExistsInSession,
  ])
  router.get('/plan/:prisonNumber/goals/review', [asyncMiddleware(createGoalController.getReviewGoalView)])
  router.post('/plan/:prisonNumber/goals/review', [asyncMiddleware(createGoalController.submitReviewGoal)])
}

const createGoalRoutes = (router: Router, services: Services, createGoalController: CreateGoalController) => {
  router.use('/plan/:prisonNumber/goals/:goalIndex/create', [checkUserHasEditAuthority()])
  router.get('/plan/:prisonNumber/goals/:goalIndex/create', [asyncMiddleware(createGoalController.getCreateGoalView)])
  router.post('/plan/:prisonNumber/goals/:goalIndex/create', [
    checkPrisonerSummaryExistsInSession,
    checkCreateGoalFormExistsInSession,
    asyncMiddleware(createGoalController.submitCreateGoalForm),
  ])

  router.use('/plan/:prisonNumber/goals/:goalIndex/add-step/:stepIndex', [
    checkUserHasEditAuthority(),
    checkPrisonerSummaryExistsInSession,
    checkCreateGoalFormExistsInSession,
  ])
  router.get('/plan/:prisonNumber/goals/:goalIndex/add-step/:stepIndex', [
    asyncMiddleware(createGoalController.getAddStepView),
  ])
  router.post('/plan/:prisonNumber/goals/:goalIndex/add-step/:stepIndex', [
    asyncMiddleware(createGoalController.submitAddStepForm),
  ])

  router.use('/plan/:prisonNumber/goals/:goalIndex/add-note', [
    checkUserHasEditAuthority(),
    checkPrisonerSummaryExistsInSession,
    checkCreateGoalFormExistsInSession,
    checkAddStepFormsArrayExistsInSession,
  ])
  router.get('/plan/:prisonNumber/goals/:goalIndex/add-note', [asyncMiddleware(createGoalController.getAddNoteView)])
  router.post('/plan/:prisonNumber/goals/:goalIndex/add-note', [
    asyncMiddleware(createGoalController.submitAddNoteForm),
  ])
}

const newCreateGoalRoutes = (router: Router, services: Services, createGoalsController: CreateGoalsController) => {
  router.use('/plan/:prisonNumber/goals/create', [checkUserHasEditAuthority()])
  router.get('/plan/:prisonNumber/goals/create', [asyncMiddleware(createGoalsController.getCreateGoalsView)])
  router.post('/plan/:prisonNumber/goals/create', [
    checkPrisonerSummaryExistsInSession,
    // TODO - RR-748 - write router request handler to check CreateGoalsForm exists in session,
    asyncMiddleware(createGoalsController.submitCreateGoalsForm),
  ])
}
