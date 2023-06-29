import { dataAccess } from '../data'
import UserService from './userService'
import PrisonerSearchService from './prisonerSearchService'

/**
 * Function that instantiates and exposes all services required by the application.
 */
export const services = () => {
  const { hmppsAuthClient, applicationInfo, prisonerSearchClient } = dataAccess()

  const userService = new UserService(hmppsAuthClient)
  const prisonerSearchService = new PrisonerSearchService(hmppsAuthClient, prisonerSearchClient)

  return {
    applicationInfo,
    userService,
    prisonerSearchService,
  }
}

export type Services = ReturnType<typeof services>

export { UserService, PrisonerSearchService }
