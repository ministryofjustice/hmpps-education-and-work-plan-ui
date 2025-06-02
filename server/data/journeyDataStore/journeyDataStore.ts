import { isValid, parseISO } from 'date-fns'
import { RedisClient } from '../redisClient'
import logger from '../../../logger'

const DATE_FIELDS = ['createdAt', 'updatedAt']

export default class JourneyDataStore {
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
    this.client.set(`journey.${username}.${journeyId}`, JSON.stringify(journeyData), { EX: durationHours * 60 * 60 })
  }

  async getJourneyData(username: string, journeyId: string): Promise<Express.JourneyData> {
    await this.ensureConnected()
    const serializedJourneyData = await this.client.get(`journey.${username}.${journeyId}`)
    return serializedJourneyData ? JSON.parse(serializedJourneyData.toString(), dataParsingReviver(DATE_FIELDS)) : {}
  }

  async deleteJourneyData(username: string, journeyId: string): Promise<void> {
    await this.ensureConnected()
    await this.client.del(`journey.${username}.${journeyId}`)
  }
}

/**
 * JSON Parse reviver function that identifies fields that should be parsed as real Date objects rather than string
 * values. (The JSON parse function does not natively parse values into Date objects, so it needs help via a function
 * such as this)
 */
const dataParsingReviver = (dateFields: Array<string>) => {
  return (key: string, value: never) => {
    if (typeof value !== 'string') {
      return value
    }
    const dateObj = parseISO(value)
    return dateFields.includes(key) && isValid(dateObj) ? dateObj : value
  }
}
