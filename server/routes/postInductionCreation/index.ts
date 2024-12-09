import { Router } from 'express'
import { Services } from '../../services'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import retrieveAllGoalsForPrisoner from '../routerRequestHandlers/retrieveAllGoalsForPrisoner'

/**
 * Definitions for the route immediately following the Induction creation.
 */
export default (router: Router, services: Services) => {
  /**
   * The Induction screens redirect to '/plan/:prisonNumber/induction-created' after creating the Induction.
   * This route handler redirects to the relevant PLP route depending on whether the prisoner already has goals or not.
   */
  router.get(
    '/plan/:prisonNumber/induction-created',
    retrieveAllGoalsForPrisoner(services.educationAndWorkPlanService),
    asyncMiddleware(async (req, res, next) => {
      const { prisonNumber } = req.params
      const { allGoalsForPrisoner } = res.locals

      if (allGoalsForPrisoner.problemRetrievingData) {
        return res.redirect(`/plan/${prisonNumber}/view/overview`) // Problem retrieving prisoner goals. Redirect to the Overview page
      }

      const prisonerHasActionPlan = // Prisoner is considered to have an Action Plan if they have an Induction (implied through this route being called) and have at least 1 goal in any state
        allGoalsForPrisoner.goals.ACTIVE.length > 0 ||
        allGoalsForPrisoner.goals.ARCHIVED.length > 0 ||
        allGoalsForPrisoner.goals.COMPLETED.length > 0
      return prisonerHasActionPlan
        ? res.redirect(`/plan/${prisonNumber}/view/overview`) // Action Plan with goal(s) exists already. Redirect to the Overview page
        : res.redirect(`/plan/${prisonNumber}/goals/create`) // Action Plan goals do not exist yet. Redirect to the Create Goals flow routes.
    }),
  )
}
