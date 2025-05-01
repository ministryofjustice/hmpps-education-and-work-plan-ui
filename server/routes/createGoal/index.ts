import { Router } from 'express'
import { Services } from '../../services'
import CreateGoalsController from './createGoalsController'
import { checkUserHasPermissionTo } from '../../middleware/roleBasedAccessControl'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import retrieveActionPlan from '../routerRequestHandlers/retrieveActionPlan'
import ApplicationAction from '../../enums/applicationAction'
import insertJourneyIdentifier from '../routerRequestHandlers/insertJourneyIdentifier'
import logger from '../../../logger'
import setupJourneyData from '../routerRequestHandlers/setupJourneyData'
import createEmptyCreateGoalsFormIfNotInJourneyData from '../routerRequestHandlers/createEmptyCreateGoalsFormIfNotInJourneyData'

/**
 * Route definitions for the pages relating to Creating A Goal
 */
export default (router: Router, services: Services) => {
  const { auditService, educationAndWorkPlanService, journeyDataService } = services
  const createGoalsController = new CreateGoalsController(educationAndWorkPlanService, auditService)

  router.use('/plan/:prisonNumber/goals/create', [
    checkUserHasPermissionTo(ApplicationAction.CREATE_GOALS),
    insertJourneyIdentifier({ insertIdAfterElement: 3 }), // insert journey ID immediately after '/plan/:prisonNumber/goals' - eg: '/plan/A1234BC/goals/473e9ee4-37d6-4afb-92a2-5729b10cc60f/create'
  ])
  router.use('/plan/:prisonNumber/goals/:journeyId', [
    setupJourneyData(journeyDataService),
    createEmptyCreateGoalsFormIfNotInJourneyData,
  ])

  router.get('/plan/:prisonNumber/goals/:journeyId/create', [asyncMiddleware(createGoalsController.getCreateGoalsView)])
  router.post('/plan/:prisonNumber/goals/:journeyId/create', [
    retrieveActionPlan(services.educationAndWorkPlanService),
    asyncMiddleware(createGoalsController.submitCreateGoalsForm),
  ])

  router.post('/plan/:prisonNumber/goals/:journeyId/create/:action', [
    asyncMiddleware(createGoalsController.submitAction),
  ])
  router.get('/plan/:prisonNumber/goals/:journeyId/create/:action', async (req, res, next) => {
    logger.debug(
      `Unsupported GET request create goals action route ${req.originalUrl}. Redirecting to create goal route`,
    )
    const { prisonNumber, journeyId } = req.params
    return res.redirect(`/plan/${prisonNumber}/goals/${journeyId}/create`)
  })
}
