import type { PrisonResponse } from 'prisonRegisterApiClient'
import PrisonRegisterStore from './prisonRegisterStore'
import { RedisClient } from '../redisClient'
import aValidPrisonResponse from '../../testsupport/prisonResponseTestDataBuilder'

const redisClient = {
  on: jest.fn(),
  get: jest.fn(),
  set: jest.fn(),
  connect: jest.fn(),
}

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

describe('prisonRegisterStore', () => {
  let prisonRegisterStore: PrisonRegisterStore

  beforeEach(() => {
    prisonRegisterStore = new PrisonRegisterStore(redisClient as unknown as RedisClient)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should set active prisons', async () => {
    // Given
    redisClient.set.mockResolvedValue(null)
    const durationDays = 2

    // When
    await prisonRegisterStore.setActivePrisons(allPrisons, durationDays)

    // Then
    expect(redisClient.set).toHaveBeenCalledWith(
      'activePrisons',
      JSON.stringify(activePrisons),
      { EX: 172800 }, // 2 days in seconds
    )
  })

  it('should get active prisons given redis client returns active prisons', async () => {
    // Given
    const serializedActivePrisons = JSON.stringify(activePrisons)
    redisClient.get.mockResolvedValue(serializedActivePrisons)

    // When
    const returnedActivePrisons = await prisonRegisterStore.getActivePrisons()

    // Then
    expect(returnedActivePrisons).toStrictEqual(activePrisons)
    expect(redisClient.get).toHaveBeenCalledWith('activePrisons')
  })

  it('should get empty array of active prisons given there are no active prisons in redis', async () => {
    // Given
    const serializedActivePrisons: string = null
    redisClient.get.mockResolvedValue(serializedActivePrisons)

    const expectedActivePrisons: Array<PrisonResponse> = []

    // When
    const returnedActivePrisons = await prisonRegisterStore.getActivePrisons()

    // Then
    expect(returnedActivePrisons).toStrictEqual(expectedActivePrisons)
    expect(redisClient.get).toHaveBeenCalledWith('activePrisons')
  })

  it('should not get active prisons given redis client throws an error', async () => {
    // Given
    redisClient.get.mockRejectedValue('some error')

    // When
    try {
      await prisonRegisterStore.getActivePrisons()
    } catch (error) {
      // Then
      expect(error).toBe('some error')
      expect(redisClient.get).toHaveBeenCalledWith('activePrisons')
    }
  })
})
