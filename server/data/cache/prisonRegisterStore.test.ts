import type { Prison } from 'prisonRegisterApiClient'
import PrisonRegisterStore from './prisonRegisterStore'
import { RedisClient } from './redisClient'
import aValidPrison from '../../testsupport/prisonTestDataBuilder'

const redisClient = {
  on: jest.fn(),
  get: jest.fn(),
  set: jest.fn(),
  connect: jest.fn(),
}

const allPrisons: Array<Prison> = [
  aValidPrison({
    prisonID: 'ACI',
    prisonName: 'Altcourse (HMP)',
    active: false,
  }),
  aValidPrison({
    prisonID: 'ASI',
    prisonName: 'Ashfield (HMP)',
    active: true,
  }),
  aValidPrison({
    prisonID: 'MDI',
    prisonName: 'Moorland (HMP & YOI)',
    active: true,
  }),
]

const activePrisons: Array<Prison> = [
  aValidPrison({
    prisonID: 'ASI',
    prisonName: 'Ashfield (HMP)',
    active: true,
  }),
  aValidPrison({
    prisonID: 'MDI',
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

    const expectedActivePrisons: Array<Prison> = []

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
