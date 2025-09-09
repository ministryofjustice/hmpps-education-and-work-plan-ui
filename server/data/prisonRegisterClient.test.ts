import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import type { PrisonResponse } from 'prisonRegisterApiClient'
import nock from 'nock'
import config from '../config'
import PrisonRegisterClient from './prisonRegisterClient'
import aValidPrisonResponse from '../testsupport/prisonResponseTestDataBuilder'

describe('prisonRegisterClient', () => {
  const username = 'A-DPS-USER'
  const systemToken = 'test-system-token'

  const mockAuthenticationClient = {
    getToken: jest.fn(),
  } as unknown as jest.Mocked<AuthenticationClient>
  const prisonRegisterClient = new PrisonRegisterClient(mockAuthenticationClient)

  config.apis.prisonRegister.url = 'http://localhost:8200'
  const prisonRegisterApi = nock(config.apis.prisonRegister.url)

  beforeEach(() => {
    jest.resetAllMocks()
    mockAuthenticationClient.getToken.mockResolvedValue(systemToken)
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('getAllPrisons', () => {
    it('should get all prisons', async () => {
      // Given
      const allPrisons: Array<PrisonResponse> = [
        aValidPrisonResponse({
          prisonId: 'ACI',
          prisonName: 'Altcourse (HMP)',
          active: false,
        }),
        aValidPrisonResponse({
          prisonId: 'ASI',
          prisonName: 'Ashfield (HMP)',
          active: true,
        }),
        aValidPrisonResponse({
          prisonId: 'MDI',
          prisonName: 'Moorland (HMP & YOI)',
          active: true,
        }),
      ]
      prisonRegisterApi.get('/prisons').matchHeader('authorization', `Bearer ${systemToken}`).reply(200, allPrisons)

      // When
      const actual = await prisonRegisterClient.getAllPrisons(username)

      // Then
      expect(actual).toEqual(allPrisons)
      expect(nock.isDone()).toBe(true)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
    })

    it('should not get all prisons given API returns an error response', async () => {
      // Given
      const expectedResponseBody = {
        status: 500,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
      }
      prisonRegisterApi
        .get('/prisons')
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .thrice()
        .reply(500, expectedResponseBody)

      // When
      try {
        await prisonRegisterClient.getAllPrisons(username)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.responseStatus).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
        expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      }
    })
  })
})
