import nock from 'nock'
import PrisonerSearchClient from './prisonerSearchClient'
import config from '../config'
import aValidPagedCollectionOfPrisoners from '../testsupport/pagedCollectionOfPrisonersTestDataBuilder'
import aValidPrisoner from '../testsupport/prisonerTestDataBuilder'

describe('prisonerSearchClient', () => {
  const prisonerSearchClient = new PrisonerSearchClient()

  config.apis.prisonerSearch.url = 'http://localhost:8200'
  let prisonerSearchApi: nock.Scope

  beforeEach(() => {
    prisonerSearchApi = nock(config.apis.prisonerSearch.url)
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('getPrisonerByPrisonNumber', () => {
    it('should get prisoner by prison number given prisoner exists', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const systemToken = 'a-system-token'

      const prisoner = aValidPrisoner()
      prisonerSearchApi.get(`/prisoner/${prisonNumber}`).reply(200, prisoner)

      // When
      const actual = await prisonerSearchClient.getPrisonerByPrisonNumber(prisonNumber, systemToken)

      // Then
      expect(actual).toEqual(prisoner)
      expect(nock.isDone()).toBe(true)
    })

    it('should not get prisoner by prison number given prisoner does not exist', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const systemToken = 'a-system-token'

      prisonerSearchApi.get(`/prisoner/${prisonNumber}`).reply(404)

      // When
      const actual = await prisonerSearchClient.getPrisonerByPrisonNumber(prisonNumber, systemToken).catch(error => {
        return error
      })

      // Then
      expect(actual).toEqual(Error('Not Found'))
      expect(nock.isDone()).toBe(true)
    })
  })

  describe('getPrisonersByPrisonId', () => {
    it('should get prisoners by prison id given prison ID exists', async () => {
      // Given
      const prisonId = 'BXI'
      const systemToken = 'a-system-token'

      const page = 0
      const pageSize = 100

      const pagedCollectionOfPrisoners = aValidPagedCollectionOfPrisoners({
        number: 2,
        content: [
          aValidPrisoner({ firstName: 'Fred', lastName: 'Blogs' }),
          aValidPrisoner({ firstName: 'Martin', lastName: 'McDougal' }),
        ],
      })
      prisonerSearchApi
        .get(`/prison-search/prison/${prisonId}?page=${page}&size=${pageSize}`)
        .reply(200, pagedCollectionOfPrisoners)

      // When
      const actual = await prisonerSearchClient.getPrisonersByPrisonId(prisonId, page, pageSize, systemToken)

      // Then
      expect(actual).toEqual(pagedCollectionOfPrisoners)
      expect(nock.isDone()).toBe(true)
    })

    it('should get zero prisoners by prison id given prison ID does not exist', async () => {
      // Given
      const prisonId = 'some-unknown-prison-id'
      const systemToken = 'a-system-token'

      const page = 0
      const pageSize = 100

      const pagedCollectionOfPrisoners = aValidPagedCollectionOfPrisoners({
        number: 0,
        content: [],
      })
      prisonerSearchApi
        .get(`/prison-search/prison/${prisonId}?page=${page}&size=${pageSize}`)
        .reply(200, pagedCollectionOfPrisoners)

      // When
      const actual = await prisonerSearchClient.getPrisonersByPrisonId(prisonId, page, pageSize, systemToken)

      // Then
      expect(actual).toEqual(pagedCollectionOfPrisoners)
      expect(nock.isDone()).toBe(true)
    })
  })
})
