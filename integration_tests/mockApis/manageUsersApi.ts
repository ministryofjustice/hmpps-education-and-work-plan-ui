import { SuperAgentRequest } from 'superagent'
import stubPing from './common'
import { stubFor } from './wiremock'

const stubUser = (name: string = 'john smith') =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/manage-users-api/users/me',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: {
        username: 'USER1',
        active: true,
        name,
      },
    },
  })

const stubGetUserCaseloads = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/manage-users-api/users/me/caseloads',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: {
        username: 'USER1',
        active: true,
        accountType: 'GENERAL',
        activeCaseload: { id: 'BXI', name: 'BRIXTON (HMP)' },
        caseloads: [
          { id: 'BXI', name: 'BRIXTON (HMP)' },
          { id: 'LEI', name: 'LEEDS (HMP)' },
        ],
      },
    },
  })

export default {
  stubManageUser: stubUser,
  stubGetUserCaseloads,
  stubManageUsersApiPing: stubPing('manage-users-api'),
}
