import { Router } from 'express'
import { EducationAndWorkPlanService, Services } from '../../services'
import config from '../../config'

/**
 * Definitions for the route immediately following the CIAG UI Induction creation.
 */
export default (router: Router, services: Services) => {
  /**
   * The CIAG UI redirects to '/plan/:prisonNumber/induction-created' after creating the Induction.
   * This route handler redirects to the relevant PLP route depending on whether the prisoner already has goals or not.
   */
  router.get('/plan/:prisonNumber/induction-created', async (req, res, next) => {
    const userToken = req.user.token
    const { prisonNumber } = req.params

    return (await prisonerHasActionPlan(prisonNumber, userToken, services.educationAndWorkPlanService))
      ? res.redirect(`/plan/${prisonNumber}/view/overview`) // Action Plan with goal(s) exists already. Redirect to the Overview page
      : res.redirect(createGoalRoute(prisonNumber)) // Action Plan goals do not exist yet. Redirect to the Create Goal flow routes.
  })
}

const prisonerHasActionPlan = async (
  prisonNumber: string,
  userToken: string,
  educationAndWorkPlanService: EducationAndWorkPlanService,
): Promise<boolean> => {
  const actionPlan = await educationAndWorkPlanService.getActionPlan(prisonNumber, userToken)
  if (actionPlan.problemRetrievingData) {
    return true // If we cannot get the action plan return true, resulting in the user being redirected to the overview page
  }
  return actionPlan.goals.length > 0
}

const createGoalRoute = (prisonNumber: string): string =>
  config.featureToggles.newCreateGoalRoutesEnabled
    ? `/plan/${prisonNumber}/goals/1/create`
    : `/plan/${prisonNumber}/goals/create`
