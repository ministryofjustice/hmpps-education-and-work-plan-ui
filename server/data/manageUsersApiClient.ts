import logger from '../../logger'
import config from '../config'
import RestClient from './restClient'

export interface User {
  username: string
  name?: string
  active?: boolean
  authSource?: string
  uuid?: string
  userId?: string
  activeCaseLoadId?: string
  caseLoadIds: Array<string>
}

export interface UserCaseloadDetail {
  username: string
  active: boolean
  accountType: 'GENERAL' | 'ADMIN'
  activeCaseload?: PrisonCaseload
  caseloads: Array<PrisonCaseload>
}

export interface PrisonCaseload {
  id: string
  name: string
}

export default class ManageUsersApiClient {
  constructor() {}

  private static restClient(token: string): RestClient {
    return new RestClient('Manage Users Api Client', config.apis.manageUsersApi, token)
  }

  async getUserCaseLoads(token: string): Promise<UserCaseloadDetail> {
    logger.info('Getting user caseloads: calling HMPPS Manage Users Api')
    return ManageUsersApiClient.restClient(token).get<UserCaseloadDetail>({ path: '/users/me/caseloads' })
  }
}
