import { jwtDecode } from 'jwt-decode'
import ManageUsersApiClient, { User, UserCaseloadDetail } from '../data/manageUsersApiClient'

export interface UserDetails extends User {
  name?: string
  displayName: string
  roles: string[]
}

export default class UserService {
  constructor(private readonly manageUsersApiClient: ManageUsersApiClient) {}

  getUserRoles(token: string): string[] {
    const { authorities: roles = [] } = jwtDecode(token) as { authorities?: string[] }
    return roles.map(role => role.substring(role.indexOf('_') + 1))
  }

  async getUserCaseLoads(token: string): Promise<UserCaseloadDetail> {
    return this.manageUsersApiClient.getUserCaseLoads(token)
  }
}
