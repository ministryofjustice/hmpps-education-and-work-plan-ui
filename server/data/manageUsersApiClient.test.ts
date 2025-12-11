import nock from 'nock'

import { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import ManageUsersApiClient, { UserCaseloadDetail } from './manageUsersApiClient'
import config from '../config'

jest.mock('@ministryofjustice/hmpps-auth-clients')

const token = { access_token: 'token-1', expires_in: 300 }

describe('manageUsersApiClient', () => {
  const fakeManageUsersApiClient = nock(config.apis.manageUsersApi.url)
  const mockAuthenticationClient = new AuthenticationClient(null, null, null) as jest.Mocked<AuthenticationClient>
  const manageUsersApiClient = new ManageUsersApiClient(mockAuthenticationClient)

  beforeEach(() => {
    jest.resetAllMocks()
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('getUserCaseLoads', () => {
    it('should get user case load details', async () => {
      // Given
      const expectedUserCaseloadDetail: UserCaseloadDetail = {
        username: 'user1',
        active: true,
        accountType: 'GENERAL',
        activeCaseload: { id: 'BXI', name: 'BRIXTON (HMP)' },
        caseloads: [
          { id: 'BXI', name: 'BRIXTON (HMP)' },
          { id: 'LEI', name: 'LEEDS (HMP)' },
        ],
      }
      fakeManageUsersApiClient
        .get('/users/me/caseloads')
        .matchHeader('authorization', `Bearer ${token.access_token}`)
        .reply(200, expectedUserCaseloadDetail)

      // When
      const actual = await manageUsersApiClient.getUserCaseLoads(token.access_token)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedUserCaseloadDetail)
    })

    it('should not get user case load details given API returns an error response', async () => {
      // Given
      const apiErrorResponse = {
        status: 500,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
      }
      fakeManageUsersApiClient
        .get('/users/me/caseloads')
        .matchHeader('authorization', `Bearer ${token.access_token}`)
        .thrice()
        .reply(500, apiErrorResponse)

      const expectedError = new Error('Internal Server Error')

      // When
      const actual = await manageUsersApiClient.getUserCaseLoads(token.access_token).catch(e => e)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedError)
    })
  })
})
