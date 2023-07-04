import type { Prisoner } from 'prisonRegisterApiClient'
import { HmppsAuthClient, PrisonerSearchClient } from '../data'
import PrisonerSearchService from './prisonerSearchService'

describe('prisonerSearchService', () => {
  const hmppsAuthClient = {
    getSystemClientToken: jest.fn(),
  }

  const prisonerSearchClient = {
    getPrisonerByPrisonNumber: jest.fn(),
  }

  const prisonerSearchService = new PrisonerSearchService(
    hmppsAuthClient as unknown as HmppsAuthClient,
    prisonerSearchClient as unknown as PrisonerSearchClient,
  )

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getPrisonerByPrisonNumber', () => {
    it('should get prisoner by prison number given prisoner search returns a prisoner', async () => {
      // Given
      const prisonNumber = 'A1234BC'

      const userToken = 'a-user-token'
      // const systemToken = 'a-system-token'
      // hmppsAuthClient.getSystemClientToken.mockImplementation(() => Promise.resolve(systemToken))

      const prisoner: Prisoner = {
        prisonerNumber: prisonNumber,
        firstName: 'AUSTIN',
        lastName: 'AVARY',
        dateOfBirth: '1993-12-08',
        gender: 'Male',
      }
      prisonerSearchClient.getPrisonerByPrisonNumber.mockImplementation(() => Promise.resolve(prisoner))

      // When
      const actual = await prisonerSearchService.getPrisonerByPrisonNumber(prisonNumber, userToken)

      // Then
      expect(actual).toEqual(prisoner)
      // expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith() // expect to be called with no args
      expect(prisonerSearchClient.getPrisonerByPrisonNumber).toHaveBeenCalledWith(prisonNumber, userToken)
    })

    it('should not get prisoner by prison number given prisoner search returns an error', async () => {
      // Given
      const prisonNumber = 'A1234BC'

      const userToken = 'a-user-token'
      // const systemToken = 'a-system-token'
      // hmppsAuthClient.getSystemClientToken.mockImplementation(() => Promise.resolve(systemToken))

      prisonerSearchClient.getPrisonerByPrisonNumber.mockImplementation(() => Promise.reject(Error('Not Found')))

      // When
      const actual = await prisonerSearchService.getPrisonerByPrisonNumber(prisonNumber, userToken).catch(error => {
        return error
      })

      // Then
      expect(actual).toEqual(Error('Not Found'))
    })
  })
})
