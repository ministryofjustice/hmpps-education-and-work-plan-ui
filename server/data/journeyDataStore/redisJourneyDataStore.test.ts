import { v4 as uuidV4 } from 'uuid'
import JourneyDataStore from './journeyDataStore'
import RedisJourneyDataStore from './redisJourneyDataStore'
import { RedisClient } from '../redisClient'
import { aValidInductionDto } from '../../testsupport/inductionDtoTestDataBuilder'

const redisClient = {
  on: jest.fn(),
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  connect: jest.fn(),
}

const username = 'AUSER_GEN'
const journeyId = uuidV4()
const expectedCacheKey = `journeyData:${username}:${journeyId}`
const journeyData: Express.JourneyData = { inductionDto: aValidInductionDto() }

describe('redisJourneyDataStore', () => {
  let journeyDataStore: JourneyDataStore

  beforeEach(() => {
    journeyDataStore = new RedisJourneyDataStore(redisClient as unknown as RedisClient)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should set journey data', async () => {
    // Given
    redisClient.set.mockResolvedValue(null)
    const durationHours = 2

    // When
    await journeyDataStore.setJourneyData(username, journeyId, journeyData, durationHours)

    // Then
    expect(redisClient.set).toHaveBeenCalledWith(
      expectedCacheKey,
      JSON.stringify(journeyData),
      { EX: 7200 }, // 2 hours in seconds
    )
  })

  it('should get journey data given redis client returns journey data', async () => {
    // Given
    const serializedJourneyData = JSON.stringify(journeyData)
    redisClient.get.mockResolvedValue(serializedJourneyData)

    // When
    const returnedJourneyData = await journeyDataStore.getJourneyData(username, journeyId)

    // Then
    expect(returnedJourneyData).toEqual(journeyData)
    expect(redisClient.get).toHaveBeenCalledWith(expectedCacheKey)
  })

  it('should get empty object given there is no journey data in redis', async () => {
    // Given
    const serializedJourneyData: string = null
    redisClient.get.mockResolvedValue(serializedJourneyData)

    const expectedJourneyData = {}

    // When
    const returnedJourneyData = await journeyDataStore.getJourneyData(username, journeyId)

    // Then
    expect(returnedJourneyData).toEqual(expectedJourneyData)
    expect(redisClient.get).toHaveBeenCalledWith(expectedCacheKey)
  })

  it('should not get journey data given redis client throws an error', async () => {
    // Given
    redisClient.get.mockRejectedValue('some error')

    // When
    try {
      await journeyDataStore.getJourneyData(username, journeyId)
    } catch (error) {
      // Then
      expect(error).toBe('some error')
      expect(redisClient.get).toHaveBeenCalledWith(expectedCacheKey)
    }
  })

  it('should delete journey data', async () => {
    // Given

    // When
    await journeyDataStore.deleteJourneyData(username, journeyId)

    // Then
    expect(redisClient.del).toHaveBeenCalledWith(expectedCacheKey)
  })
})
