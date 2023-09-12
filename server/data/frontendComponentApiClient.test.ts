import nock from 'nock'
import config from '../config'
import FrontendComponentApiClient from './frontendComponentApiClient'
import aValidFrontEndComponentFooter from '../testsupport/frontendComponentTestDataBuilder'

describe('frontendComponentApiClient', () => {
  const frontendComponentApiClient = new FrontendComponentApiClient()

  config.apis.frontendComponents.url = 'http://localhost:8200'
  let fakeFrontendComponentApi: nock.Scope

  beforeEach(() => {
    fakeFrontendComponentApi = nock(config.apis.frontendComponents.url)
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('getComponents', () => {
    it('should return data from api', async () => {
      // Given
      const userToken = 'a-user-token'

      const expectedResponse = aValidFrontEndComponentFooter()

      fakeFrontendComponentApi.get('/footer').matchHeader('x-user-token', userToken).reply(200, expectedResponse)

      // When
      const actual = await frontendComponentApiClient.getComponents('footer', userToken)

      // Then
      expect(actual).toEqual(expectedResponse)
      expect(nock.isDone()).toBe(true)
    })
  })
})
