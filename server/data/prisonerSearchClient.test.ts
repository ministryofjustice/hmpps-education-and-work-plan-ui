import nock from 'nock'
import type { Prisoner } from 'prisonRegisterApiClient'
import PrisonerSearchClient from './prisonerSearchClient'
import config from '../config'

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

      const prisoner: Prisoner = {
        prisonerNumber: prisonNumber,
        firstName: 'AUSTIN',
        lastName: 'AVARY',
        dateOfBirth: '1993-12-08',
        gender: 'Male',
      }
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
})
