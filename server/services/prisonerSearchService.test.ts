import type { PrisonerSummaries } from 'viewModels'
import HmppsAuthClient from '../data/hmppsAuthClient'
import PrisonerSearchClient from '../data/prisonerSearchClient'
import RedisPrisonerSearchStore from '../data/prisonerSearchStore/redisPrisonerSearchStore'
import PrisonerSearchService from './prisonerSearchService'
import aValidPrisoner from '../testsupport/prisonerTestDataBuilder'
import aValidPrisonerSummary from '../testsupport/prisonerSummaryTestDataBuilder'
import toPrisonerSummary from '../data/mappers/prisonerSummaryMapper'
import aValidPagedCollectionOfPrisoners from '../testsupport/pagedCollectionOfPrisonersTestDataBuilder'

jest.mock('../data/mappers/prisonerSummaryMapper')
jest.mock('../data/hmppsAuthClient')
jest.mock('../data/prisonerSearchClient')
jest.mock('../data/prisonerSearchStore/redisPrisonerSearchStore')

describe('prisonerSearchService', () => {
  const mockedPrisonerSummaryMapper = toPrisonerSummary as jest.MockedFunction<typeof toPrisonerSummary>

  const hmppsAuthClient = new HmppsAuthClient(null) as jest.Mocked<HmppsAuthClient>
  const prisonerSearchClient = new PrisonerSearchClient() as jest.Mocked<PrisonerSearchClient>
  const prisonerSearchStore = new RedisPrisonerSearchStore(null) as jest.Mocked<RedisPrisonerSearchStore>

  const prisonerSearchService = new PrisonerSearchService(hmppsAuthClient, prisonerSearchClient, prisonerSearchStore)

  const prisonNumber = 'A1234BC'
  const prisonId = 'BXI'
  const username = 'a-dps-user'
  const systemToken = 'a-system-token'

  beforeEach(() => {
    jest.resetAllMocks()
    hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)
  })

  describe('getPrisonerByPrisonNumber', () => {
    it('should get and cache prisoner by prison number given prisoner not in cache and prisoner search returns a prisoner', async () => {
      // Given
      prisonerSearchStore.getPrisoner.mockResolvedValue(null)

      const prisoner = aValidPrisoner({ prisonNumber })
      prisonerSearchClient.getPrisonerByPrisonNumber.mockResolvedValue(prisoner)

      const expectedPrisonerSummary = aValidPrisonerSummary({ prisonNumber })
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
      const prisoner = aValidPrisoner({ prisonNumber })
      prisonerSearchStore.getPrisoner.mockResolvedValue(prisoner)

      const expectedPrisonerSummary = aValidPrisonerSummary({ prisonNumber })
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
      prisonerSearchStore.getPrisoner.mockResolvedValue(null)
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
      prisonerSearchStore.getPrisoner.mockResolvedValue(null)
      prisonerSearchStore.setPrisoner.mockRejectedValue(Error('some error caching the prisoner'))

      const prisoner = aValidPrisoner({ prisonNumber })
      prisonerSearchClient.getPrisonerByPrisonNumber.mockResolvedValue(prisoner)

      const expectedPrisonerSummary = aValidPrisonerSummary({ prisonNumber })
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

  describe('getPrisonersByPrisonId', () => {
    it('should get prisoners by prisonId given there is only 1 page of data', async () => {
      // Given
      const prisonersPage1Of1 = aValidPagedCollectionOfPrisoners({
        content: [aValidPrisoner({ prisonNumber: 'A1234BC' }), aValidPrisoner({ prisonNumber: 'B9876AA' })],
        first: true,
        last: true,
        size: 2,
        totalElements: 2,
        totalPages: 1,
      })
      prisonerSearchClient.getPrisonersByPrisonId.mockResolvedValue(prisonersPage1Of1)

      const expectedPrisonerSummary1 = aValidPrisonerSummary({ prisonNumber: 'A1234BC' })
      const expectedPrisonerSummary2 = aValidPrisonerSummary({ prisonNumber: 'B9876AA' })
      mockedPrisonerSummaryMapper
        .mockReturnValueOnce(expectedPrisonerSummary1)
        .mockReturnValueOnce(expectedPrisonerSummary2)

      const expected: PrisonerSummaries = {
        problemRetrievingData: false,
        prisoners: [expectedPrisonerSummary1, expectedPrisonerSummary2],
      }

      // When
      const actual = await prisonerSearchService.getPrisonersByPrisonId(prisonId, username)

      // Then
      expect(actual).toEqual(expected)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(prisonerSearchClient.getPrisonersByPrisonId).toHaveBeenCalledTimes(1)
      expect(prisonerSearchClient.getPrisonersByPrisonId).toHaveBeenCalledWith(prisonId, 0, 9999, systemToken)
    })

    it('should get prisoners by prisonId given there are 2 pages of data', async () => {
      // Given
      const prisonersPage1Of2 = aValidPagedCollectionOfPrisoners({
        content: [aValidPrisoner({ prisonNumber: 'A1234BC' }), aValidPrisoner({ prisonNumber: 'B9876AA' })],
        first: true,
        last: false,
        size: 2,
        totalElements: 3,
        totalPages: 2,
      })
      const prisonersPage2Of2 = aValidPagedCollectionOfPrisoners({
        content: [aValidPrisoner({ prisonNumber: 'Z1234XX' })],
        first: false,
        last: true,
        size: 1,
        totalElements: 3,
        totalPages: 2,
      })
      prisonerSearchClient.getPrisonersByPrisonId
        .mockResolvedValueOnce(prisonersPage1Of2)
        .mockResolvedValueOnce(prisonersPage2Of2)

      const expectedPrisonerSummary1 = aValidPrisonerSummary({ prisonNumber: 'A1234BC' })
      const expectedPrisonerSummary2 = aValidPrisonerSummary({ prisonNumber: 'B9876AA' })
      const expectedPrisonerSummary3 = aValidPrisonerSummary({ prisonNumber: 'Z9876XX' })
      mockedPrisonerSummaryMapper
        .mockReturnValueOnce(expectedPrisonerSummary1)
        .mockReturnValueOnce(expectedPrisonerSummary2)
        .mockReturnValueOnce(expectedPrisonerSummary3)

      const expected: PrisonerSummaries = {
        problemRetrievingData: false,
        prisoners: [expectedPrisonerSummary1, expectedPrisonerSummary2, expectedPrisonerSummary3],
      }

      // When
      const actual = await prisonerSearchService.getPrisonersByPrisonId(prisonId, username)

      // Then
      expect(actual).toEqual(expected)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(prisonerSearchClient.getPrisonersByPrisonId).toHaveBeenCalledTimes(2)
      expect(prisonerSearchClient.getPrisonersByPrisonId).toHaveBeenCalledWith(prisonId, 0, 9999, systemToken)
      expect(prisonerSearchClient.getPrisonersByPrisonId).toHaveBeenCalledWith(prisonId, 1, 9999, systemToken)
    })

    it('should not get prisoners by prisonId given page 1 returns an error', async () => {
      // Given
      const prisonSearchApiError = {
        status: 500,
        data: {
          status: 500,
          userMessage: 'An unexpected error occurred',
          developerMessage: 'An unexpected error occurred',
        },
      }
      prisonerSearchClient.getPrisonersByPrisonId.mockRejectedValue(prisonSearchApiError)

      const expected = {
        problemRetrievingData: true,
      } as PrisonerSummaries

      // When
      const actual = await prisonerSearchService.getPrisonersByPrisonId(prisonId, username)

      // Then
      expect(actual).toEqual(expected)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(prisonerSearchClient.getPrisonersByPrisonId).toHaveBeenCalledTimes(1)
      expect(prisonerSearchClient.getPrisonersByPrisonId).toHaveBeenCalledWith(prisonId, 0, 9999, systemToken)
      expect(mockedPrisonerSummaryMapper).not.toHaveBeenCalled()
    })

    it('should not get prisoners by prisonId given page 2 returns an error', async () => {
      // Given
      const prisonSearchApiError = {
        status: 500,
        data: {
          status: 500,
          userMessage: 'An unexpected error occurred',
          developerMessage: 'An unexpected error occurred',
        },
      }

      const prisonersPage1Of2 = aValidPagedCollectionOfPrisoners({
        content: [aValidPrisoner({ prisonNumber: 'A1234BC' }), aValidPrisoner({ prisonNumber: 'B9876AA' })],
        first: true,
        last: false,
        size: 2,
        totalElements: 3,
        totalPages: 2,
      })
      prisonerSearchClient.getPrisonersByPrisonId
        .mockResolvedValueOnce(prisonersPage1Of2)
        .mockRejectedValueOnce(prisonSearchApiError)

      const expected = {
        problemRetrievingData: true,
      } as PrisonerSummaries

      // When
      const actual = await prisonerSearchService.getPrisonersByPrisonId(prisonId, username)

      // Then
      expect(actual).toEqual(expected)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(prisonerSearchClient.getPrisonersByPrisonId).toHaveBeenCalledTimes(2)
      expect(prisonerSearchClient.getPrisonersByPrisonId).toHaveBeenCalledWith(prisonId, 0, 9999, systemToken)
      expect(prisonerSearchClient.getPrisonersByPrisonId).toHaveBeenCalledWith(prisonId, 1, 9999, systemToken)
      expect(mockedPrisonerSummaryMapper).not.toHaveBeenCalled()
    })

    it('should handle retrieval of prisoners by prisonId given prisoner-search API client returns null indicating not found error', async () => {
      // Given
      prisonerSearchClient.getPrisonersByPrisonId.mockResolvedValue(null)

      const expected = {
        problemRetrievingData: true,
      } as PrisonerSummaries

      // When
      const actual = await prisonerSearchService.getPrisonersByPrisonId(prisonId, username)

      // Then
      expect(actual).toEqual(expected)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(prisonerSearchClient.getPrisonersByPrisonId).toHaveBeenCalledTimes(1)
      expect(prisonerSearchClient.getPrisonersByPrisonId).toHaveBeenCalledWith(prisonId, 0, 9999, systemToken)
      expect(mockedPrisonerSummaryMapper).not.toHaveBeenCalled()
    })
  })
})
