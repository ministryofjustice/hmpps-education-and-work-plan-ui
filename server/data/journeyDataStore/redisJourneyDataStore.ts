import { RedisClient } from '../redisClient'
import logger from '../../../logger'
import JourneyDataStore from './journeyDataStore'
import dataParsingReviver from './dataParsingReviver'

const DATE_FIELDS = ['createdAt', 'updatedAt']
const prefix = 'journeyData:'

export default class RedisJourneyDataStore implements JourneyDataStore {
  constructor(private readonly client: RedisClient) {
    client.on('error', error => {
      logger.error(error, `Redis error`)
    })
  }

  private async ensureConnected() {
    if (!this.client.isOpen) {
      await this.client.connect()
    }
  }

  async setJourneyData(
    username: string,
    journeyId: string,
    journeyData: Express.JourneyData,
    durationHours = 1,
  ): Promise<void> {
    await this.ensureConnected()
    this.client.set(`${prefix}${username}:${journeyId}`, JSON.stringify(journeyData), { EX: durationHours * 60 * 60 })
  }

  async getJourneyData(username: string, journeyId: string): Promise<Express.JourneyData> {
    await this.ensureConnected()
    const serializedJourneyData = await this.client.get(`${prefix}${username}:${journeyId}`)
    return serializedJourneyData ? JSON.parse(serializedJourneyData.toString(), dataParsingReviver(DATE_FIELDS)) : {}
  }

  async deleteJourneyData(username: string, journeyId: string): Promise<void> {
    await this.ensureConnected()
    await this.client.del(`${prefix}${username}:${journeyId}`)
  }
}
