import { jwtDecode } from 'jwt-decode'
import { convertToTitleCase } from '../utils/utils'
import ManageUsersApiClient, { User, UserCaseloadDetail } from '../data/manageUsersApiClient'

export interface UserDetails extends User {
  name?: string
  displayName: string
  roles: string[]
}

export default class UserService {
  constructor(private readonly manageUsersApiClient: ManageUsersApiClient) {}

  async getUser(token: string): Promise<UserDetails> {
    const user = await this.manageUsersApiClient.getUser(token)
    return { ...user, roles: this.getUserRoles(token), displayName: convertToTitleCase(user.name) }
  }

  getUserRoles(token: string): string[] {
    const { authorities: roles = [] } = jwtDecode(token) as { authorities?: string[] }
    return roles.map(role => role.substring(role.indexOf('_') + 1))
  }

  async getUserCaseLoads(token: string): Promise<UserCaseloadDetail> {
    return this.manageUsersApiClient.getUserCaseLoads(token)
  }
}
