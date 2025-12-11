import { asUser, RestClient } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import logger from '../../logger'
import config from '../config'

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

export default class ManageUsersApiClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('Manage Users Api Client', config.apis.manageUsersApi, logger, authenticationClient)
  }

  async getUserCaseLoads(token: string): Promise<UserCaseloadDetail> {
    logger.info('Getting user caseloads: calling HMPPS Manage Users Api')
    return this.get<UserCaseloadDetail>({ path: '/users/me/caseloads' }, asUser(token))
  }
}
