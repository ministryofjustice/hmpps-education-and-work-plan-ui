import { HmppsAuthClient, PrisonerSearchClient } from '../data'
import PrisonerSearchService from './prisonerSearchService'
import aValidPrisoner from '../testsupport/prisonerTestDataBuilder'
import aValidPrisonerSummary from '../testsupport/prisonerSummaryTestDataBuilder'
import toPrisonerSummary from '../data/mappers/prisonerSummaryMapper'

jest.mock('../data/mappers/prisonerSummaryMapper')

describe('prisonerSearchService', () => {
  const mockedPrisonerSummaryMapper = toPrisonerSummary as jest.MockedFunction<typeof toPrisonerSummary>

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

      const username = 'a-dps-user'
      const systemToken = 'a-system-token'
      hmppsAuthClient.getSystemClientToken.mockImplementation(() => Promise.resolve(systemToken))

      const prisoner = aValidPrisoner({ prisonNumber })
      prisonerSearchClient.getPrisonerByPrisonNumber.mockImplementation(() => Promise.resolve(prisoner))

      const expectedPrisonerSummary = aValidPrisonerSummary(prisonNumber)
      mockedPrisonerSummaryMapper.mockReturnValue(expectedPrisonerSummary)

      // When
      const actual = await prisonerSearchService.getPrisonerByPrisonNumber(prisonNumber, username)

      // Then
      expect(actual).toEqual(expectedPrisonerSummary)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(prisonerSearchClient.getPrisonerByPrisonNumber).toHaveBeenCalledWith(prisonNumber, systemToken)
      expect(mockedPrisonerSummaryMapper).toHaveBeenCalledWith(prisoner)
    })

    it('should not get prisoner by prison number given prisoner search returns an error', async () => {
      // Given
      const prisonNumber = 'A1234BC'

      const username = 'a-dps-user'
      const systemToken = 'a-system-token'
      hmppsAuthClient.getSystemClientToken.mockImplementation(() => Promise.resolve(systemToken))

      prisonerSearchClient.getPrisonerByPrisonNumber.mockImplementation(() => Promise.reject(Error('Not Found')))

      // When
      const actual = await prisonerSearchService.getPrisonerByPrisonNumber(prisonNumber, username).catch(error => {
        return error
      })

      // Then
      expect(actual).toEqual(Error('Not Found'))
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
    })
  })
})
