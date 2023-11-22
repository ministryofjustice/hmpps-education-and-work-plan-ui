import type { PrisonResponse } from 'prisonRegisterApiClient'
import toPrison from '../data/mappers/prisonMapper'
import PrisonService from './prisonService'
import PrisonRegisterStore from '../data/cache/prisonRegisterStore'
import PrisonRegisterClient from '../data/prisonRegisterClient'
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

  const prisonService = new PrisonService(
    prisonRegisterStore as unknown as PrisonRegisterStore,
    prisonRegisterClient as unknown as PrisonRegisterClient,
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
      const systemToken = 'a-system-token'

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
      const actual = await prisonService.getPrisonByPrisonId(prisonId, systemToken)

      // Then
      expect(actual).toEqual(expectedPrison)
      expect(prisonRegisterStore.getActivePrisons).toHaveBeenCalled()
      expect(mockedPrisonMapper).toHaveBeenCalledWith(moorlandPrisonResponse)
      expect(prisonRegisterClient.getAllPrisons).not.toHaveBeenCalled()
      expect(prisonRegisterStore.setActivePrisons).not.toHaveBeenCalled()
    })

    it('should get prison by ID given prison has not been previously cached', async () => {
      // Given
      const prisonId = 'MDI'
      const systemToken = 'a-system-token'

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
      const actual = await prisonService.getPrisonByPrisonId(prisonId, systemToken)

      // Then
      expect(actual).toEqual(expectedPrison)
      expect(prisonRegisterStore.getActivePrisons).toHaveBeenCalled()
      expect(mockedPrisonMapper).toHaveBeenCalledWith(moorlandPrisonResponse)
      expect(prisonRegisterClient.getAllPrisons).toHaveBeenCalled()
      expect(prisonRegisterStore.setActivePrisons).toHaveBeenCalledWith(allPrisons, 1)
    })

    it('should not get prison by ID given prison does not exist in cache or API', async () => {
      // Given
      const prisonId = 'some-unknown-prison-id'
      const systemToken = 'a-system-token'

      prisonRegisterStore.getActivePrisons.mockResolvedValue(activePrisons)
      prisonRegisterClient.getAllPrisons.mockResolvedValue(allPrisons)

      // When
      const actual = await prisonService.getPrisonByPrisonId(prisonId, systemToken)

      // Then
      expect(actual).toEqual(undefined)
      expect(prisonRegisterStore.getActivePrisons).toHaveBeenCalled()
      expect(mockedPrisonMapper).not.toHaveBeenCalled()
      expect(prisonRegisterClient.getAllPrisons).toHaveBeenCalled()
      expect(prisonRegisterStore.setActivePrisons).toHaveBeenCalledWith(allPrisons, 1)
    })

    it('should get prison by ID given retrieving from cache throws an error', async () => {
      // Given
      const prisonId = 'MDI'
      const systemToken = 'a-system-token'

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
      const actual = await prisonService.getPrisonByPrisonId(prisonId, systemToken)

      // Then
      expect(actual).toEqual(expectedPrison)
      expect(prisonRegisterStore.getActivePrisons).toHaveBeenCalled()
      expect(mockedPrisonMapper).toHaveBeenCalledWith(moorlandPrisonResponse)
      expect(prisonRegisterClient.getAllPrisons).toHaveBeenCalled()
      expect(prisonRegisterStore.setActivePrisons).toHaveBeenCalledWith(allPrisons, 1)
    })

    it('should not get prison by ID given retrieving from cache and API both throw errors', async () => {
      // Given
      const prisonId = 'MDI'
      const systemToken = 'a-system-token'

      prisonRegisterStore.getActivePrisons.mockRejectedValue('some-cache-error')
      prisonRegisterClient.getAllPrisons.mockRejectedValue('some-api-error')

      // When
      const actual = await prisonService.getPrisonByPrisonId(prisonId, systemToken)

      // Then
      expect(actual).toEqual(undefined)
      expect(prisonRegisterStore.getActivePrisons).toHaveBeenCalled()
      expect(mockedPrisonMapper).not.toHaveBeenCalled()
      expect(prisonRegisterClient.getAllPrisons).toHaveBeenCalled()
      expect(prisonRegisterStore.setActivePrisons).not.toHaveBeenCalled()
    })

    it('should get prison by ID given prison has not been previously cached but putting in cache throws an error', async () => {
      // Given
      const prisonId = 'MDI'
      const systemToken = 'a-system-token'

      prisonRegisterStore.getActivePrisons.mockResolvedValue([])
      prisonRegisterClient.getAllPrisons.mockResolvedValue(allPrisons)
      prisonRegisterStore.setActivePrisons.mockRejectedValue('some-error')

      // When
      const actual = await prisonService.getPrisonByPrisonId(prisonId, systemToken)

      // Then
      expect(actual).toEqual(undefined)
      expect(prisonRegisterStore.getActivePrisons).toHaveBeenCalled()
      expect(mockedPrisonMapper).not.toHaveBeenCalled()
      expect(prisonRegisterClient.getAllPrisons).toHaveBeenCalled()
      expect(prisonRegisterStore.setActivePrisons).toHaveBeenCalledWith(allPrisons, 1)
    })
  })
})
