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
import { checkRedirectAtEndOfJourneyIsNotPending } from '../routerRequestHandlers/checkRedirectAtEndOfJourneyIsNotPending'

/**
 * Route definitions for the pages relating to Creating A Goal
 */
export default (services: Services) => {
  const router = Router({ mergeParams: true })

  const { auditService, educationAndWorkPlanService, journeyDataService } = services
  const createGoalsController = new CreateGoalsController(educationAndWorkPlanService, auditService)

  router.use('/goals/create', [
    checkUserHasPermissionTo(ApplicationAction.CREATE_GOALS),
    insertJourneyIdentifier({ insertIdAfterElement: 3 }), // insert journey ID immediately after '/plan/:prisonNumber/goals' - eg: '/plan/A1234BC/goals/473e9ee4-37d6-4afb-92a2-5729b10cc60f/create'
  ])
  router.use('/goals/:journeyId', [setupJourneyData(journeyDataService), createEmptyCreateGoalsFormIfNotInJourneyData])

  router.get('/goals/:journeyId/create', [asyncMiddleware(createGoalsController.getCreateGoalsView)])
  router.post('/goals/:journeyId/create', [
    checkRedirectAtEndOfJourneyIsNotPending({
      journey: 'Create Goals',
      redirectTo: '/plan/:prisonNumber/view/overview',
    }),
    retrieveActionPlan(services.educationAndWorkPlanService),
    asyncMiddleware(createGoalsController.submitCreateGoalsForm),
  ])

  router.post('/goals/:journeyId/create/:action', [asyncMiddleware(createGoalsController.submitAction)])
  router.get('/goals/:journeyId/create/:action', async (req, res, next) => {
    logger.debug(
      `Unsupported GET request create goals action route ${req.originalUrl}. Redirecting to create goal route`,
    )
    const { prisonNumber, journeyId } = req.params as unknown as { journeyId: string; prisonNumber: string }
    return res.redirect(`/plan/${prisonNumber}/goals/${journeyId}/create`)
  })

  return router
}
