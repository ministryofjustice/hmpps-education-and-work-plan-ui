import type { PrisonResponse } from 'prisonRegisterApiClient'
import nock from 'nock'
import config from '../config'
import PrisonRegisterClient from './prisonRegisterClient'
import aValidPrisonResponse from '../testsupport/prisonResponseTestDataBuilder'

describe('prisonRegisterClient', () => {
  const prisonRegisterClient = new PrisonRegisterClient()

  config.apis.prisonRegister.url = 'http://localhost:8200'
  let prisonRegisterApi: nock.Scope

  beforeEach(() => {
    prisonRegisterApi = nock(config.apis.prisonRegister.url)
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('getAllPrisons', () => {
    it('should get all prisons', async () => {
      // Given
      const systemToken = 'a-system-token'
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
      prisonRegisterApi.get('/prisons').reply(200, allPrisons)

      // When
      const actual = await prisonRegisterClient.getAllPrisons(systemToken)

      // Then
      expect(actual).toEqual(allPrisons)
      expect(nock.isDone()).toBe(true)
    })

    it('should not get all prisons given API returns an error response', async () => {
      // Given
      const systemToken = 'a-system-token'

      const expectedResponseBody = {
        status: 500,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
      }
      prisonRegisterApi.get('/prisons').thrice().reply(500, expectedResponseBody)

      // When
      try {
        await prisonRegisterClient.getAllPrisons(systemToken)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.status).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
      }
    })
  })
})
