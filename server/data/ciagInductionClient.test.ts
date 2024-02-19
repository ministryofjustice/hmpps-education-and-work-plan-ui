import nock from 'nock'
import config from '../config'
import CiagInductionClient from './ciagInductionClient'
import { aLongQuestionSetCiagInduction } from '../testsupport/ciagInductionTestDataBuilder'
import aValidCiagInductionListResponse from '../testsupport/ciagInductionListResponseTestDataBuilder'

describe('ciagInductionClient', () => {
  const ciagInductionClient = new CiagInductionClient()

  config.apis.ciagInduction.url = 'http://localhost:8200'
  let ciagApi: nock.Scope

  beforeEach(() => {
    ciagApi = nock(config.apis.ciagInduction.url)
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('getCiagInductionsForPrisonNumbers', () => {
    it('should get CIAG Inductions', async () => {
      // Given
      const prisonNumbers = ['A1234BC', 'B5544GD']
      const token = 'a-user-token'

      const expectedCiagInductionListResponse = aValidCiagInductionListResponse({
        ciagProfileList: [
          aLongQuestionSetCiagInduction({ prisonNumber: 'A1234BC' }),
          aLongQuestionSetCiagInduction({ prisonNumber: 'B5544GD' }),
        ],
      })
      ciagApi.post('/ciag/induction/list', { offenderIds: prisonNumbers }).reply(200, expectedCiagInductionListResponse)

      // When
      const actual = await ciagInductionClient.getCiagInductionsForPrisonNumbers(prisonNumbers, token)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedCiagInductionListResponse)
    })

    it('should get zero CIAG Inductions given none of the specified prisoners have CIAG Inductions', async () => {
      // Given
      const prisonNumbers = ['A1234BC', 'B5544GD']
      const token = 'a-user-token'

      const expectedCiagInductionListResponse = aValidCiagInductionListResponse({
        ciagProfileList: [],
      })
      ciagApi.post('/ciag/induction/list', { offenderIds: prisonNumbers }).reply(200, expectedCiagInductionListResponse)

      // When
      const actual = await ciagInductionClient.getCiagInductionsForPrisonNumbers(prisonNumbers, token)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedCiagInductionListResponse)
    })

    it('should not get CIAG Inductions given API returns an error response', async () => {
      // Given
      const prisonNumbers = ['A1234BC', 'B5544GD']
      const token = 'a-user-token'

      const expectedResponseBody = {
        status: 500,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
      }
      ciagApi.post('/ciag/induction/list', { offenderIds: prisonNumbers }).reply(500, expectedResponseBody)

      // When
      try {
        await ciagInductionClient.getCiagInductionsForPrisonNumbers(prisonNumbers, token)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.status).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
      }
    })
  })
})
