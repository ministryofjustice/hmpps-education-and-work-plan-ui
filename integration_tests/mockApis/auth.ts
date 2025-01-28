import jwt from 'jsonwebtoken'
import { Response } from 'superagent'

import { stubFor, getMatchingRequests } from './wiremock'
import tokenVerification from './tokenVerification'
import stubPing from './common'
import manageUsersApi from './manageUsersApi'

const createToken = (roles: string[] = []) => {
  // authorities in the session are always prefixed by ROLE.
  const authorities = roles.map(role => (role.startsWith('ROLE_') ? role : `ROLE_${role}`))
  const payload = {
    user_name: 'USER1',
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

const token = (roles: string[] = []) =>
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
        access_token: createToken(roles),
        token_type: 'bearer',
        user_name: 'USER1',
        expires_in: 599,
        scope: 'read',
        internalUser: true,
      },
    },
  })

const stubUser = (name: string) =>
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
        staffId: 231232,
        username: 'USER1',
        active: true,
        name,
        activeCaseLoadId: 'BXI',
        authSource: 'nomis',
      },
    },
  })

const stubUserRoles = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/manage-users-api/user/me/roles',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: ['SOME_USER_ROLE'],
    },
  })

export default {
  getSignInUrl,
  stubAuthPing: stubPing('auth'),
  stubSignIn: (roles = []): Promise<[Response, Response, Response, Response, Response]> =>
    Promise.all([favicon(), redirect(), signOut(), token(roles), tokenVerification.stubVerifyToken()]),
  stubAuthUser: (name = 'john smith'): Promise<[Response, Response, Response]> =>
    Promise.all([stubUser(name), stubUserRoles(), manageUsersApi.stubGetUserCaseloads()]),
}
