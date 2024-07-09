import { Router } from 'express'
import { EducationAndWorkPlanService, Services } from '../../services'
import asyncMiddleware from '../../middleware/asyncMiddleware'

/**
 * Definitions for the route immediately following the CIAG UI Induction creation.
 */
export default (router: Router, services: Services) => {
  /**
   * The Induction screens redirect to '/plan/:prisonNumber/induction-created' after creating the Induction.
   * This route handler redirects to the relevant PLP route depending on whether the prisoner already has goals or not.
   */
  router.get(
    '/plan/:prisonNumber/induction-created',
    asyncMiddleware(async (req, res, next) => {
      const { username } = req.user
      const { prisonNumber } = req.params

      return (await prisonerHasActionPlan(prisonNumber, username, services.educationAndWorkPlanService))
        ? res.redirect(`/plan/${prisonNumber}/view/overview`) // Action Plan with goal(s) exists already. Redirect to the Overview page
        : res.redirect(`/plan/${prisonNumber}/goals/create`) // Action Plan goals do not exist yet. Redirect to the Create Goals flow routes.
    }),
  )
}

const prisonerHasActionPlan = async (
  prisonNumber: string,
  username: string,
  educationAndWorkPlanService: EducationAndWorkPlanService,
): Promise<boolean> => {
  const actionPlan = await educationAndWorkPlanService.getActionPlan(prisonNumber, username)
  if (actionPlan.problemRetrievingData) {
    return true // If we cannot get the action plan return true, resulting in the user being redirected to the overview page
  }
  return actionPlan.goals.length > 0
}
