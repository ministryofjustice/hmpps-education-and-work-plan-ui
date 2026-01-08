import { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import nock from 'nock'
import config from '../config'
import CiagInductionClient from './ciagInductionClient'
import aValidCiagInductionSummaryListResponse from '../testsupport/ciagInductionSummaryListResponseTestDataBuilder'
import aValidCiagInductionSummaryResponse from '../testsupport/ciagInductionSummaryReponseTestDataBuilder'

jest.mock('@ministryofjustice/hmpps-auth-clients')

describe('ciagInductionClient', () => {
  const prisonNumbers = ['A1234BC', 'B5544GD']
  const username = 'A-DPS-USER'
  const systemToken = 'test-system-token'

  const mockAuthenticationClient = new AuthenticationClient(null, null, null) as jest.Mocked<AuthenticationClient>
  const ciagInductionClient = new CiagInductionClient(mockAuthenticationClient)

  const ciagApi = nock(config.apis.educationAndWorkPlan.url)

  beforeEach(() => {
    jest.resetAllMocks()
    mockAuthenticationClient.getToken.mockResolvedValue(systemToken)
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('getCiagInductionsForPrisonNumbers', () => {
    it('should get CIAG Inductions', async () => {
      // Given
      const expectedCiagInductionListResponse = aValidCiagInductionSummaryListResponse({
        ciagProfileList: [
          aValidCiagInductionSummaryResponse({ prisonNumber: 'A1234BC' }),
          aValidCiagInductionSummaryResponse({ prisonNumber: 'B5544GD' }),
        ],
      })
      ciagApi
        .post('/ciag/induction/list', { offenderIds: prisonNumbers })
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, expectedCiagInductionListResponse)

      // When
      const actual = await ciagInductionClient.getCiagInductionsForPrisonNumbers(prisonNumbers, username)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedCiagInductionListResponse)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
    })

    it('should get zero CIAG Inductions given none of the specified prisoners have CIAG Inductions', async () => {
      // Given
      const expectedCiagInductionListResponse = aValidCiagInductionSummaryListResponse({
        ciagProfileList: [],
      })
      ciagApi
        .post('/ciag/induction/list', { offenderIds: prisonNumbers })
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, expectedCiagInductionListResponse)

      // When
      const actual = await ciagInductionClient.getCiagInductionsForPrisonNumbers(prisonNumbers, username)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedCiagInductionListResponse)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
    })

    it('should rethrow error given API returns an error', async () => {
      // Given
      const apiErrorResponse = {
        status: 500,
        userMessage: 'Service unavailable',
        developerMessage: 'Service unavailable',
      }
      ciagApi
        .post('/ciag/induction/list', { offenderIds: prisonNumbers })
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(500, apiErrorResponse)

      const expectedError = new Error('Internal Server Error')

      // When
      const actual = await ciagInductionClient.getCiagInductionsForPrisonNumbers(prisonNumbers, username).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })
  })
})
