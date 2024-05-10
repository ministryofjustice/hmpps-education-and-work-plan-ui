import nock from 'nock'

import config from '../config'
import ManageUsersApiClient, { UserCaseloadDetail } from './manageUsersApiClient'

const token = { access_token: 'token-1', expires_in: 300 }

describe('manageUsersApiClient', () => {
  let fakeManageUsersApiClient: nock.Scope
  let manageUsersApiClient: ManageUsersApiClient

  beforeEach(() => {
    fakeManageUsersApiClient = nock(config.apis.manageUsersApi.url)
    manageUsersApiClient = new ManageUsersApiClient()
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('getUser', () => {
    it('should return data from api', async () => {
      const response = { data: 'data' }

      fakeManageUsersApiClient
        .get('/users/me')
        .matchHeader('authorization', `Bearer ${token.access_token}`)
        .reply(200, response)

      const output = await manageUsersApiClient.getUser(token.access_token)
      expect(output).toEqual(response)
    })
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
      const expectedResponseBody = {
        status: 500,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
      }
      fakeManageUsersApiClient
        .get('/users/me/caseloads')
        .matchHeader('authorization', `Bearer ${token.access_token}`)
        .thrice()
        .reply(500, expectedResponseBody)

      // When
      try {
        await manageUsersApiClient.getUserCaseLoads(token.access_token)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.status).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
      }
    })
  })
})
