import jwt from 'jsonwebtoken'
import { Response } from 'superagent'

import { stubFor, getMatchingRequests } from './wiremock'
import tokenVerification from './tokenVerification'
import stubPing from './common'
import manageUsersApi from './manageUsersApi'
import educationAndWorkPlanApi from './educationAndWorkPlanApi'
import prisonRegisterApi from './prisonRegisterApi'

const createToken = ({ roles = [], name = 'john smith' }: { roles?: Array<string>; name?: string }) => {
  // authorities in the session are always prefixed by ROLE.
  const authorities = roles.map(role => (role.startsWith('ROLE_') ? role : `ROLE_${role}`))
  const payload = {
    name: name || 'john smith',
    user_name: 'USER1',
    user_id: 231232,
    scope: ['read'],
    auth_source: 'nomis',
    authorities,
    jti: '83b50a10-cca6-41db-985f-e87efb303ddb',
    client_id: 'clientid',
  }

  return jwt.sign(payload, 'secret', { expiresIn: '1h' })
}

const getSignInUrl = (): Promise<string> =>
  getMatchingRequests({
    method: 'GET',
    urlPath: '/auth/oauth/authorize',
  }).then(data => {
    const { requests } = data.body
    const stateValue = requests[requests.length - 1].queryParams.state.values[0]
    return `/sign-in/callback?code=codexxxx&state=${stateValue}`
  })

const favicon = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/favicon.ico',
    },
    response: {
      status: 200,
    },
  })

const redirect = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/auth/oauth/authorize\\?response_type=code&redirect_uri=.+?&state=.+?&client_id=clientid',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        Location: 'http://localhost:3007/sign-in/callback?code=codexxxx&state=stateyyyy',
      },
      body: '<html lang="en"><head><title>Mock SignIn page</title></head><body><h1>Sign in</h1><span class="govuk-visually-hidden" id="pageId" data-qa="sign-in"></span></body></html>',
    },
  })

const signOut = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/auth/sign-out.*',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: '<html lang="en"><head><title>Mock SignIn page</title></head><body><h1>Sign in</h1><span class="govuk-visually-hidden" id="pageId" data-qa="sign-in"></span></body></html>',
    },
  })

const token = ({ roles = [], name = 'john smith' }: { roles?: Array<string>; name?: string }) =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: '/auth/oauth/token',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Location: 'http://localhost:3007/sign-in/callback?code=codexxxx&state=stateyyyy',
      },
      jsonBody: {
        access_token: createToken({ roles, name }),
        auth_source: 'nomis',
        token_type: 'bearer',
        user_name: 'USER1',
        expires_in: 599,
        scope: 'read',
        internalUser: true,
      },
    },
  })

export default {
  getSignInUrl,
  stubAuthPing: stubPing('auth'),
  stubSignIn: ({
    roles = [],
    name = 'john smith',
  }: {
    roles?: Array<string>
    name?: string
  } = {}): Promise<[Response, Response, Response, Response, Response, Response, Response, Response]> =>
    Promise.all([
      favicon(),
      redirect(),
      signOut(),
      token({ roles, name }),
      tokenVerification.stubVerifyToken(),
      manageUsersApi.stubGetUserCaseloads(),
      educationAndWorkPlanApi.stubSearchByPrison(),
      prisonRegisterApi.stubGetAllPrisons(),
    ]),
}
