import type { PrisonResponse } from 'prisonRegisterApiClient'
import toPrison from '../data/mappers/prisonMapper'
import PrisonService from './prisonService'
import PrisonRegisterStore from '../data/prisonRegisterStore/prisonRegisterStore'
import PrisonRegisterClient from '../data/prisonRegisterClient'
import { HmppsAuthClient } from '../data'
import aValidPrisonResponse from '../testsupport/prisonResponseTestDataBuilder'
import aValidPrison from '../testsupport/prisonTestDataBuilder'

jest.mock('../data/mappers/prisonMapper')

describe('prisonService', () => {
  const mockedPrisonMapper = toPrison as jest.MockedFunction<typeof toPrison>

  const prisonRegisterStore = {
    getActivePrisons: jest.fn(),
    setActivePrisons: jest.fn(),
  }

  const prisonRegisterClient = {
    getAllPrisons: jest.fn(),
  }

  const hmppsAuthClient = {
    getSystemClientToken: jest.fn(),
  }

  const prisonService = new PrisonService(
    prisonRegisterStore as unknown as PrisonRegisterStore,
    prisonRegisterClient as unknown as PrisonRegisterClient,
    hmppsAuthClient as unknown as HmppsAuthClient,
  )

  beforeEach(() => {
    jest.resetAllMocks()
  })

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

  const activePrisons: Array<PrisonResponse> = [
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
  describe('getPrisonByPrisonId', () => {
    it('should get prison by ID given prison has been previously cached', async () => {
      // Given
      const prisonId = 'MDI'
      const username = 'some-username'
      const systemToken = 'a-system-token'

      hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)

      prisonRegisterStore.getActivePrisons.mockResolvedValue(activePrisons)

      const moorlandPrisonResponse = aValidPrisonResponse({
        prisonId: 'MDI',
        prisonName: 'Moorland (HMP & YOI)',
        active: true,
      })

      const expectedPrison = aValidPrison({
        prisonId: 'MDI',
      })
      mockedPrisonMapper.mockReturnValue(expectedPrison)

      // When
      const actual = await prisonService.getPrisonByPrisonId(prisonId, username)

      // Then
      expect(actual).toEqual(expectedPrison)
      expect(prisonRegisterStore.getActivePrisons).toHaveBeenCalled()
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(mockedPrisonMapper).toHaveBeenCalledWith(moorlandPrisonResponse)
      expect(prisonRegisterClient.getAllPrisons).not.toHaveBeenCalled()
      expect(prisonRegisterStore.setActivePrisons).not.toHaveBeenCalled()
    })

    it('should get prison by ID given prison has not been previously cached', async () => {
      // Given
      const prisonId = 'MDI'
      const username = 'some-username'
      const systemToken = 'a-system-token'

      hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)

      prisonRegisterStore.getActivePrisons.mockResolvedValue([])
      prisonRegisterClient.getAllPrisons.mockResolvedValue(allPrisons)

      const moorlandPrisonResponse = aValidPrisonResponse({
        prisonId: 'MDI',
        prisonName: 'Moorland (HMP & YOI)',
        active: true,
      })

      const expectedPrison = aValidPrison({
        prisonId: 'MDI',
      })
      mockedPrisonMapper.mockReturnValue(expectedPrison)

      // When
      const actual = await prisonService.getPrisonByPrisonId(prisonId, username)

      // Then
      expect(actual).toEqual(expectedPrison)
      expect(prisonRegisterStore.getActivePrisons).toHaveBeenCalled()
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(mockedPrisonMapper).toHaveBeenCalledWith(moorlandPrisonResponse)
      expect(prisonRegisterClient.getAllPrisons).toHaveBeenCalled()
      expect(prisonRegisterStore.setActivePrisons).toHaveBeenCalledWith(activePrisons, 1)
    })

    it('should not get prison by ID given prison does not exist in cache or API', async () => {
      // Given
      const prisonId = 'some-unknown-prison-id'
      const username = 'some-username'
      const systemToken = 'a-system-token'

      hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)

      prisonRegisterStore.getActivePrisons.mockResolvedValue(activePrisons)
      prisonRegisterClient.getAllPrisons.mockResolvedValue(allPrisons)

      const expectedPrison = {
        prisonId,
        prisonName: undefined as string,
      }

      // When
      const actual = await prisonService.getPrisonByPrisonId(prisonId, username)

      // Then
      expect(actual).toEqual(expectedPrison)
      expect(prisonRegisterStore.getActivePrisons).toHaveBeenCalled()
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(mockedPrisonMapper).not.toHaveBeenCalled()
      expect(prisonRegisterClient.getAllPrisons).toHaveBeenCalled()
      expect(prisonRegisterStore.setActivePrisons).toHaveBeenCalledWith(activePrisons, 1)
    })

    it('should get prison by ID given retrieving from cache throws an error', async () => {
      // Given
      const prisonId = 'MDI'
      const username = 'some-username'
      const systemToken = 'a-system-token'

      hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)

      prisonRegisterStore.getActivePrisons.mockRejectedValue('some-error')
      prisonRegisterClient.getAllPrisons.mockResolvedValue(allPrisons)

      const moorlandPrisonResponse = aValidPrisonResponse({
        prisonId: 'MDI',
        prisonName: 'Moorland (HMP & YOI)',
        active: true,
      })

      const expectedPrison = aValidPrison({
        prisonId: 'MDI',
      })
      mockedPrisonMapper.mockReturnValue(expectedPrison)

      // When
      const actual = await prisonService.getPrisonByPrisonId(prisonId, username)

      // Then
      expect(actual).toEqual(expectedPrison)
      expect(prisonRegisterStore.getActivePrisons).toHaveBeenCalled()
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(mockedPrisonMapper).toHaveBeenCalledWith(moorlandPrisonResponse)
      expect(prisonRegisterClient.getAllPrisons).toHaveBeenCalled()
      expect(prisonRegisterStore.setActivePrisons).toHaveBeenCalledWith(activePrisons, 1)
    })

    it('should not get prison by ID given retrieving from cache and API both throw errors', async () => {
      // Given
      const prisonId = 'MDI'
      const username = 'some-username'
      const systemToken = 'a-system-token'

      hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)

      prisonRegisterStore.getActivePrisons.mockRejectedValue('some-cache-error')
      prisonRegisterClient.getAllPrisons.mockRejectedValue('some-api-error')

      const expectedPrison = {
        prisonId,
        prisonName: undefined as string,
      }

      // When
      const actual = await prisonService.getPrisonByPrisonId(prisonId, username)

      // Then
      expect(actual).toEqual(expectedPrison)
      expect(prisonRegisterStore.getActivePrisons).toHaveBeenCalled()
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(mockedPrisonMapper).not.toHaveBeenCalled()
      expect(prisonRegisterClient.getAllPrisons).toHaveBeenCalled()
      expect(prisonRegisterStore.setActivePrisons).not.toHaveBeenCalled()
    })

    it('should get prison by ID given prison has not been previously cached but putting in cache throws an error', async () => {
      // Given
      const prisonId = 'MDI'
      const username = 'some-username'
      const systemToken = 'a-system-token'

      hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)

      prisonRegisterStore.getActivePrisons.mockResolvedValue([])
      prisonRegisterClient.getAllPrisons.mockResolvedValue(allPrisons)
      prisonRegisterStore.setActivePrisons.mockRejectedValue('some-error')

      const expectedPrison = aValidPrison({
        prisonId: 'MDI',
      })
      mockedPrisonMapper.mockReturnValue(expectedPrison)

      // When
      const actual = await prisonService.getPrisonByPrisonId(prisonId, username)

      // Then
      expect(actual).toEqual(expectedPrison)
      expect(prisonRegisterStore.getActivePrisons).toHaveBeenCalled()
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(prisonRegisterClient.getAllPrisons).toHaveBeenCalled()
      expect(prisonRegisterStore.setActivePrisons).toHaveBeenCalledWith(activePrisons, 1)
    })
  })
  describe('getAllPrisonNamesById', () => {
    it('should get prison names by ID given prisons have been previously cached', async () => {
      // Given
      const username = 'some-username'
      const systemToken = 'a-system-token'

      hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)

      prisonRegisterStore.getActivePrisons.mockResolvedValue(activePrisons)

      // When
      const actual = await prisonService.getAllPrisonNamesById(username)

      // Then
      expect(actual).toEqual(
        new Map([
          ['ASI', 'Ashfield (HMP)'],
          ['MDI', 'Moorland (HMP & YOI)'],
        ]),
      )
      expect(prisonRegisterStore.getActivePrisons).toHaveBeenCalled()
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(prisonRegisterClient.getAllPrisons).not.toHaveBeenCalled()
      expect(prisonRegisterStore.setActivePrisons).not.toHaveBeenCalled()
    })

    it('should get prison names by ID given prisons have not been previously cached', async () => {
      // Given
      const username = 'some-username'
      const systemToken = 'a-system-token'

      hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)

      prisonRegisterStore.getActivePrisons.mockResolvedValue([])
      prisonRegisterClient.getAllPrisons.mockResolvedValue(allPrisons)

      // When
      const actual = await prisonService.getAllPrisonNamesById(username)

      // Then
      expect(actual).toEqual(
        new Map([
          ['ASI', 'Ashfield (HMP)'],
          ['MDI', 'Moorland (HMP & YOI)'],
        ]),
      )
      expect(prisonRegisterStore.getActivePrisons).toHaveBeenCalled()
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(prisonRegisterClient.getAllPrisons).toHaveBeenCalled()
      expect(prisonRegisterStore.setActivePrisons).toHaveBeenCalledWith(activePrisons, 1)
    })

    it('should get prison names by ID from service given retrieving from cache throws an error', async () => {
      // Given
      const username = 'some-username'
      const systemToken = 'a-system-token'

      hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)

      prisonRegisterStore.getActivePrisons.mockRejectedValue('some-error')
      prisonRegisterClient.getAllPrisons.mockResolvedValue(allPrisons)

      // When
      const actual = await prisonService.getAllPrisonNamesById(username)

      // Then
      expect(actual).toEqual(
        new Map([
          ['ASI', 'Ashfield (HMP)'],
          ['MDI', 'Moorland (HMP & YOI)'],
        ]),
      )
      expect(prisonRegisterStore.getActivePrisons).toHaveBeenCalled()
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(prisonRegisterClient.getAllPrisons).toHaveBeenCalled()
      expect(prisonRegisterStore.setActivePrisons).toHaveBeenCalledWith(activePrisons, 1)
    })

    it('should not get prison names by ID given retrieving from cache and API both throw errors', async () => {
      // Given
      const username = 'some-username'
      const systemToken = 'a-system-token'

      hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)

      prisonRegisterStore.getActivePrisons.mockRejectedValue('some-cache-error')
      prisonRegisterClient.getAllPrisons.mockRejectedValue('some-api-error')

      // When
      const actual = await prisonService.getAllPrisonNamesById(username)

      // Then
      expect(actual).toEqual(new Map())
      expect(prisonRegisterStore.getActivePrisons).toHaveBeenCalled()
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(prisonRegisterClient.getAllPrisons).toHaveBeenCalled()
      expect(prisonRegisterStore.setActivePrisons).not.toHaveBeenCalled()
    })

    it('should get prison names by ID given prisons have not been previously cached but putting in cache throws an error', async () => {
      // Given
      const username = 'some-username'
      const systemToken = 'a-system-token'

      hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)

      prisonRegisterStore.getActivePrisons.mockResolvedValue([])
      prisonRegisterClient.getAllPrisons.mockResolvedValue(allPrisons)
      prisonRegisterStore.setActivePrisons.mockRejectedValue('some-error')

      // When
      const actual = await prisonService.getAllPrisonNamesById(username)

      // Then
      expect(actual).toEqual(
        new Map([
          ['ASI', 'Ashfield (HMP)'],
          ['MDI', 'Moorland (HMP & YOI)'],
        ]),
      )
      expect(prisonRegisterStore.getActivePrisons).toHaveBeenCalled()
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(prisonRegisterClient.getAllPrisons).toHaveBeenCalled()
      expect(prisonRegisterStore.setActivePrisons).toHaveBeenCalledWith(activePrisons, 1)
    })
  })
})
