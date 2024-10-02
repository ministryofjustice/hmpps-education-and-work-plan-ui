import HmppsAuthClient from '../data/hmppsAuthClient'
import PrisonerSearchClient from '../data/prisonerSearchClient'
import PrisonerSearchStore from '../data/prisonerSearchStore/prisonerSearchStore'
import PrisonerSearchService from './prisonerSearchService'
import aValidPrisoner from '../testsupport/prisonerTestDataBuilder'
import aValidPrisonerSummary from '../testsupport/prisonerSummaryTestDataBuilder'
import toPrisonerSummary from '../data/mappers/prisonerSummaryMapper'

jest.mock('../data/mappers/prisonerSummaryMapper')
jest.mock('../data/hmppsAuthClient')
jest.mock('../data/prisonerSearchClient')
jest.mock('../data/prisonerSearchStore/prisonerSearchStore')

describe('prisonerSearchService', () => {
  const mockedPrisonerSummaryMapper = toPrisonerSummary as jest.MockedFunction<typeof toPrisonerSummary>

  const hmppsAuthClient = new HmppsAuthClient(null) as jest.Mocked<HmppsAuthClient>
  const prisonerSearchClient = new PrisonerSearchClient() as jest.Mocked<PrisonerSearchClient>
  const prisonerSearchStore = new PrisonerSearchStore(null) as jest.Mocked<PrisonerSearchStore>

  const prisonerSearchService = new PrisonerSearchService(hmppsAuthClient, prisonerSearchClient, prisonerSearchStore)

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getPrisonerByPrisonNumber', () => {
    it('should get and cache prisoner by prison number given prisoner not in cache and prisoner search returns a prisoner', async () => {
      // Given
      const prisonNumber = 'A1234BC'

      prisonerSearchStore.getPrisoner.mockResolvedValue(null)

      const username = 'a-dps-user'
      const systemToken = 'a-system-token'
      hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)

      const prisoner = aValidPrisoner({ prisonNumber })
      prisonerSearchClient.getPrisonerByPrisonNumber.mockResolvedValue(prisoner)

      const expectedPrisonerSummary = aValidPrisonerSummary(prisonNumber)
      mockedPrisonerSummaryMapper.mockReturnValue(expectedPrisonerSummary)

      // When
      const actual = await prisonerSearchService.getPrisonerByPrisonNumber(prisonNumber, username)

      // Then
      expect(actual).toEqual(expectedPrisonerSummary)
      expect(prisonerSearchStore.getPrisoner).toHaveBeenCalledWith(prisonNumber)
      expect(prisonerSearchStore.setPrisoner).toHaveBeenCalledWith(prisonNumber, prisoner, 1)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(prisonerSearchClient.getPrisonerByPrisonNumber).toHaveBeenCalledWith(prisonNumber, systemToken)
      expect(mockedPrisonerSummaryMapper).toHaveBeenCalledWith(prisoner)
    })

    it('should get prisoner by prison number given prisoner is in cache', async () => {
      // Given
      const prisonNumber = 'A1234BC'

      const username = 'a-dps-user'

      const prisoner = aValidPrisoner({ prisonNumber })
      prisonerSearchStore.getPrisoner.mockResolvedValue(prisoner)

      const expectedPrisonerSummary = aValidPrisonerSummary(prisonNumber)
      mockedPrisonerSummaryMapper.mockReturnValue(expectedPrisonerSummary)

      // When
      const actual = await prisonerSearchService.getPrisonerByPrisonNumber(prisonNumber, username)

      // Then
      expect(actual).toEqual(expectedPrisonerSummary)
      expect(prisonerSearchStore.getPrisoner).toHaveBeenCalledWith(prisonNumber)
      expect(prisonerSearchStore.setPrisoner).not.toHaveBeenCalled()
      expect(hmppsAuthClient.getSystemClientToken).not.toHaveBeenCalled()
      expect(prisonerSearchClient.getPrisonerByPrisonNumber).not.toHaveBeenCalled()
      expect(mockedPrisonerSummaryMapper).toHaveBeenCalledWith(prisoner)
    })

    it('should not get prisoner by prison number given prisoner is not in the cache and prisoner search returns an error', async () => {
      // Given
      const prisonNumber = 'A1234BC'

      prisonerSearchStore.getPrisoner.mockResolvedValue(null)

      const username = 'a-dps-user'
      const systemToken = 'a-system-token'
      hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)

      prisonerSearchClient.getPrisonerByPrisonNumber.mockRejectedValue(Error('Not Found'))

      // When
      const actual = await prisonerSearchService.getPrisonerByPrisonNumber(prisonNumber, username).catch(error => {
        return error
      })

      // Then
      expect(actual).toEqual(Error('Not Found'))
      expect(prisonerSearchStore.getPrisoner).toHaveBeenCalledWith(prisonNumber)
      expect(prisonerSearchStore.setPrisoner).not.toHaveBeenCalled()
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(prisonerSearchClient.getPrisonerByPrisonNumber).toHaveBeenCalledWith(prisonNumber, systemToken)
      expect(mockedPrisonerSummaryMapper).not.toHaveBeenCalled()
    })

    it('should get prisoner by prison number given prisoner not in cache and prisoner search returns a prisoner and cache returns an error', async () => {
      // Given
      const prisonNumber = 'A1234BC'

      prisonerSearchStore.getPrisoner.mockResolvedValue(null)
      prisonerSearchStore.setPrisoner.mockRejectedValue(Error('some error caching the prisoner'))

      const username = 'a-dps-user'
      const systemToken = 'a-system-token'
      hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)

      const prisoner = aValidPrisoner({ prisonNumber })
      prisonerSearchClient.getPrisonerByPrisonNumber.mockResolvedValue(prisoner)

      const expectedPrisonerSummary = aValidPrisonerSummary(prisonNumber)
      mockedPrisonerSummaryMapper.mockReturnValue(expectedPrisonerSummary)

      // When
      const actual = await prisonerSearchService.getPrisonerByPrisonNumber(prisonNumber, username)

      // Then
      expect(actual).toEqual(expectedPrisonerSummary)
      expect(prisonerSearchStore.getPrisoner).toHaveBeenCalledWith(prisonNumber)
      expect(prisonerSearchStore.setPrisoner).toHaveBeenCalledWith(prisonNumber, prisoner, 1)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(prisonerSearchClient.getPrisonerByPrisonNumber).toHaveBeenCalledWith(prisonNumber, systemToken)
      expect(mockedPrisonerSummaryMapper).toHaveBeenCalledWith(prisoner)
    })
  })
})
