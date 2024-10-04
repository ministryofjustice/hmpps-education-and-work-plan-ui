import PrisonerSearchStore from './prisonerSearchStore'
import aValidPrisoner from '../../testsupport/prisonerTestDataBuilder'
import { RedisClient } from '../redisClient'

describe('prisonerSearchStore', () => {
  const redisClient = {
    on: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    connect: jest.fn(),
  }
  const prisonerSearchStore = new PrisonerSearchStore(redisClient as unknown as RedisClient)

  const prisonNumber = 'A1234BC'
  const prisoner = aValidPrisoner({ prisonNumber })

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should set prisoner', async () => {
    // Given
    const durationDays = 2

    // When
    await prisonerSearchStore.setPrisoner(prisonNumber, prisoner, durationDays)

    // Then
    expect(redisClient.set).toHaveBeenCalledWith(
      'prisoner-A1234BC',
      JSON.stringify(prisoner),
      { EX: 172800 }, // 2 days in seconds
    )
  })

  it('should get prisoner given redis client returns prisoner', async () => {
    // Given
    const serializedPrisoner = JSON.stringify(prisoner)
    redisClient.get.mockResolvedValue(serializedPrisoner)

    // When
    const returnedPrisoner = await prisonerSearchStore.getPrisoner(prisonNumber)

    // Then
    expect(returnedPrisoner).toEqual(prisoner)
    expect(redisClient.get).toHaveBeenCalledWith('prisoner-A1234BC')
  })

  it('should get undefined given prisoner by prisonNumber in redis', async () => {
    // Given
    const serializedPrisoner: string = null
    redisClient.get.mockResolvedValue(serializedPrisoner)

    // When
    const returnedPrisoner = await prisonerSearchStore.getPrisoner(prisonNumber)

    // Then
    expect(returnedPrisoner).toBeUndefined()
    expect(redisClient.get).toHaveBeenCalledWith('prisoner-A1234BC')
  })

  it('should not get prisoner given redis client throws an error', async () => {
    // Given
    redisClient.get.mockRejectedValue('some error')

    // When
    try {
      await prisonerSearchStore.getPrisoner(prisonNumber)
    } catch (error) {
      // Then
      expect(error).toBe('some error')
      expect(redisClient.get).toHaveBeenCalledWith('prisoner-A1234BC')
    }
  })
})
