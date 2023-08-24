import nock from 'nock'
import type { CiagInduction } from 'ciagInductionApiClient'
import config from '../config'
import CiagInductionClient from './ciagInductionClient'
import { aCiagInductionWithJobInterests } from '../testsupport/ciagInductionTestDataBuilder'

describe('ciagInductionClient', () => {
  const ciagInductionClient = new CiagInductionClient()

  config.apis.curious.url = 'http://localhost:8200'
  let curiousApi: nock.Scope

  beforeEach(() => {
    curiousApi = nock(config.apis.ciagInduction.url)
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('getCiagInduction', () => {
    it('should get learner profile', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const token = 'a-user-token'

      const ciagInduction: CiagInduction = aCiagInductionWithJobInterests(prisonNumber)
      curiousApi.get(`/ciag/induction/${prisonNumber}`).reply(200, ciagInduction)

      // When
      const actual = await ciagInductionClient.getCiagInduction(prisonNumber, token)

      // Then
      expect(actual).toEqual(ciagInduction)
      expect(nock.isDone()).toBe(true)
    })

    it('should not get learner profile given API returns an error response', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const token = 'a-user-token'

      const expectedResponseBody = {
        status: 500,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
      }
      curiousApi.get(`/ciag/induction/${prisonNumber}`).reply(500, expectedResponseBody)

      // When
      try {
        await ciagInductionClient.getCiagInduction(prisonNumber, token)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.status).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
      }
    })
  })
})
