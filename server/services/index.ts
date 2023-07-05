import { dataAccess } from '../data'
import UserService from './userService'
import PrisonerSearchService from './prisonerSearchService'
import EducationAndWorkPlanService from './educationAndWorkPlanService'

/**
 * Function that instantiates and exposes all services required by the application.
 */
export const services = () => {
  const { hmppsAuthClient, applicationInfo, prisonerSearchClient, educationAndWorkPlanClient } = dataAccess()

  const userService = new UserService(hmppsAuthClient)
  const prisonerSearchService = new PrisonerSearchService(hmppsAuthClient, prisonerSearchClient)
  const educationAndWorkPlanService = new EducationAndWorkPlanService(educationAndWorkPlanClient)

  return {
    applicationInfo,
    userService,
    prisonerSearchService,
    educationAndWorkPlanService,
  }
}

export type Services = ReturnType<typeof services>

export { UserService, PrisonerSearchService, EducationAndWorkPlanService }
