import createError from 'http-errors'
import UserService from './userService'
import ManageUsersApiClient, { UserCaseloadDetail } from '../data/manageUsersApiClient'
import createUserToken from '../testutils/createUserToken'

jest.mock('../data/manageUsersApiClient')

describe('User service', () => {
  const manageUsersApiClient = new ManageUsersApiClient(null) as jest.Mocked<ManageUsersApiClient>
  const userService = new UserService(manageUsersApiClient)

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getUserCaseLoads', () => {
    it('should get user case load details', async () => {
      // Given
      const token = createUserToken([])

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
      manageUsersApiClient.getUserCaseLoads.mockResolvedValue(expectedUserCaseloadDetail)

      // When
      const actual = await userService.getUserCaseLoads(token)

      // Then
      expect(actual).toEqual(expectedUserCaseloadDetail)
    })

    it('should propagate error get API call returns error', async () => {
      // Given
      const token = createUserToken([])

      const expectedError = createError(500, 'Service unavailable')
      manageUsersApiClient.getUserCaseLoads.mockRejectedValue(expectedError)

      // When
      const actual = await userService.getUserCaseLoads(token).catch(error => {
        return error
      })

      // Then
      expect(actual).toEqual(expectedError)
    })
  })
})
