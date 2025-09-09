import type { PrisonResponse } from 'prisonRegisterApiClient'
import PrisonService from './prisonService'
import RedisPrisonRegisterStore from '../data/prisonRegisterStore/redisPrisonRegisterStore'
import PrisonRegisterClient from '../data/prisonRegisterClient'
import aValidPrisonResponse from '../testsupport/prisonResponseTestDataBuilder'

jest.mock('../data/prisonRegisterStore/redisPrisonRegisterStore')
jest.mock('../data/prisonRegisterClient')

describe('prisonService', () => {
  const prisonRegisterStore = new RedisPrisonRegisterStore(null) as jest.Mocked<RedisPrisonRegisterStore>
  const prisonRegisterClient = new PrisonRegisterClient(null) as jest.Mocked<PrisonRegisterClient>
  const prisonService = new PrisonService(prisonRegisterStore, prisonRegisterClient)

  const username = 'some-username'

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

  describe('getAllPrisonNamesById', () => {
    it('should get prison names by ID given prisons have been previously cached', async () => {
      // Given
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
      expect(prisonRegisterClient.getAllPrisons).not.toHaveBeenCalled()
      expect(prisonRegisterStore.setActivePrisons).not.toHaveBeenCalled()
    })

    it('should get prison names by ID given prisons have not been previously cached', async () => {
      // Given
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
      expect(prisonRegisterClient.getAllPrisons).toHaveBeenCalledWith(username)
      expect(prisonRegisterStore.setActivePrisons).toHaveBeenCalledWith(activePrisons, 1)
    })

    it('should get prison names by ID from service given retrieving from cache throws an error', async () => {
      // Given
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
      expect(prisonRegisterClient.getAllPrisons).toHaveBeenCalledWith(username)
      expect(prisonRegisterStore.setActivePrisons).toHaveBeenCalledWith(activePrisons, 1)
    })

    it('should not get prison names by ID given retrieving from cache and API both throw errors', async () => {
      // Given
      prisonRegisterStore.getActivePrisons.mockRejectedValue('some-cache-error')
      prisonRegisterClient.getAllPrisons.mockRejectedValue('some-api-error')

      // When
      const actual = await prisonService.getAllPrisonNamesById(username)

      // Then
      expect(actual).toEqual(new Map())
      expect(prisonRegisterStore.getActivePrisons).toHaveBeenCalled()
      expect(prisonRegisterClient.getAllPrisons).toHaveBeenCalledWith(username)
      expect(prisonRegisterStore.setActivePrisons).not.toHaveBeenCalled()
    })

    it('should get prison names by ID given prisons have not been previously cached but putting in cache throws an error', async () => {
      // Given
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
      expect(prisonRegisterClient.getAllPrisons).toHaveBeenCalledWith(username)
      expect(prisonRegisterStore.setActivePrisons).toHaveBeenCalledWith(activePrisons, 1)
    })
  })
})
