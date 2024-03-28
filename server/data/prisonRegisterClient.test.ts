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

  describe('getPrisonByPrisonId', () => {
    it('should get prison by ID given prison exists', async () => {
      // Given
      const systemToken = 'a-system-token'
      const prisonId = 'MDI'
      const moorland = aValidPrisonResponse({
        prisonId,
        prisonName: 'Moorland (HMP & YOI)',
      })
      prisonRegisterApi.get(`/prisons/id/${prisonId}`).reply(200, moorland)

      // When
      const actual = await prisonRegisterClient.getPrisonByPrisonId(prisonId, systemToken)

      // Then
      expect(actual).toEqual(moorland)
      expect(nock.isDone()).toBe(true)
    })

    it('should not get prison by ID given prison does not exist', async () => {
      // Given
      const systemToken = 'a-system-token'
      const prisonId = 'unknown-prison-id'

      const expectedResponseBody = {
        status: 404,
        errorCode: null as string,
        userMessage: 'Prison not found exception',
        developerMessage: 'Prison unknown-prison-id not found',
        moreInfo: null as string,
      }
      prisonRegisterApi.get(`/prisons/id/${prisonId}`).reply(404, expectedResponseBody)

      // When
      try {
        await prisonRegisterClient.getPrisonByPrisonId(prisonId, systemToken)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.status).toEqual(404)
        expect(e.data).toEqual(expectedResponseBody)
      }
    })

    it('should not get prison by ID given API returns an error response', async () => {
      // Given
      const systemToken = 'a-system-token'
      const prisonId = 'MDI'

      const expectedResponseBody = {
        status: 500,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
      }
      prisonRegisterApi.get(`/prisons/id/${prisonId}`).thrice().reply(500, expectedResponseBody)

      // When
      try {
        await prisonRegisterClient.getPrisonByPrisonId(prisonId, systemToken)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.status).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
      }
    })
  })
})
