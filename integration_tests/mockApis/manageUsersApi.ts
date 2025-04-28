import { SuperAgentRequest } from 'superagent'
import stubPing from './common'
import { stubFor } from './wiremock'

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
  stubGetUserCaseloads,
  stubManageUsersApiPing: stubPing('manage-users-api'),
}
