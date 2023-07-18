import { dataAccess } from '../data'
import UserService from './userService'
import PrisonerSearchService from './prisonerSearchService'
import EducationAndWorkPlanService from './educationAndWorkPlanService'
import CuriousService from './curiousService'

/**
 * Function that instantiates and exposes all services required by the application.
 */
export const services = () => {
  const { hmppsAuthClient, applicationInfo, prisonerSearchClient, educationAndWorkPlanClient, curiousClient } =
    dataAccess()

  const userService = new UserService(hmppsAuthClient)
  const prisonerSearchService = new PrisonerSearchService(hmppsAuthClient, prisonerSearchClient)
  const educationAndWorkPlanService = new EducationAndWorkPlanService(educationAndWorkPlanClient)
  const curiousService = new CuriousService(hmppsAuthClient, curiousClient)

  return {
    applicationInfo,
    userService,
    prisonerSearchService,
    educationAndWorkPlanService,
    curiousService,
  }
}

export type Services = ReturnType<typeof services>

export { UserService, PrisonerSearchService, EducationAndWorkPlanService, CuriousService }
