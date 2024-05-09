import createError from 'http-errors'
import UserService from './userService'
import ManageUsersApiClient, { type User, UserCaseloadDetail } from '../data/manageUsersApiClient'
import createUserToken from '../testutils/createUserToken'

jest.mock('../data/manageUsersApiClient')

describe('User service', () => {
  let manageUsersApiClient: jest.Mocked<ManageUsersApiClient>
  let userService: UserService

  beforeEach(() => {
    manageUsersApiClient = new ManageUsersApiClient() as jest.Mocked<ManageUsersApiClient>
    userService = new UserService(manageUsersApiClient)
  })

  describe('getUser', () => {
    it('Retrieves and formats user name', async () => {
      const token = createUserToken([])
      manageUsersApiClient.getUser.mockResolvedValue({ name: 'john smith' } as User)

      const result = await userService.getUser(token)

      expect(result.displayName).toEqual('John Smith')
    })

    it('Retrieves and formats roles', async () => {
      const token = createUserToken(['ROLE_ONE', 'ROLE_TWO'])
      manageUsersApiClient.getUser.mockResolvedValue({ name: 'john smith' } as User)

      const result = await userService.getUser(token)

      expect(result.roles).toEqual(['ONE', 'TWO'])
    })

    it('Propagates error', async () => {
      const token = createUserToken([])
      manageUsersApiClient.getUser.mockRejectedValue(new Error('some error'))

      await expect(userService.getUser(token)).rejects.toEqual(new Error('some error'))
    })
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
