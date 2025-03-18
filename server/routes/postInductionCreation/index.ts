import { Router } from 'express'
import { Services } from '../../services'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import retrieveActionPlan from '../routerRequestHandlers/retrieveActionPlan'

/**
 * Definitions for the route immediately following the Induction creation.
 */
export default (router: Router, services: Services) => {
  /**
   * The Induction screens redirect to '/plan/:prisonNumber/induction-created' after creating the Induction.
   * This route handler redirects to the relevant PLP route depending on whether the prisoner already has goals or not.
   */
  router.get('/plan/:prisonNumber/induction-created', [
    retrieveActionPlan(services.educationAndWorkPlanService),
    asyncMiddleware(async (req, res, next) => {
      const { prisonNumber } = req.params
      const { actionPlan } = res.locals

      if (actionPlan.problemRetrievingData) {
        return res.redirect(`/plan/${prisonNumber}/view/overview`) // Problem retrieving prisoner goals. Redirect to the Overview page
      }

      const prisonerHasActionPlan = actionPlan.goals.length > 0 // Prisoner is considered to have an Action Plan if they have an Induction (implied through this route being called) and have at least 1 goal
      return prisonerHasActionPlan
        ? res.redirect(`/plan/${prisonNumber}/view/overview`) // Action Plan with goal(s) exists already. Redirect to the Overview page
        : res.redirect(`/plan/${prisonNumber}/goals/create`) // Action Plan goals do not exist yet. Redirect to the Create Goals flow routes.
    }),
  ])
}
