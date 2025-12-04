import type { PrisonResponse } from 'prisonRegisterApiClient'
import { RedisClient } from '../redisClient'
import logger from '../../../logger'
import PrisonRegisterStore from './prisonRegisterStore'

const ACTIVE_PRISONS = 'activePrisons'
const prefix = 'prisonRegister:'

export default class RedisPrisonRegisterStore implements PrisonRegisterStore {
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

  async setActivePrisons(activePrisons: Array<PrisonResponse>, durationDays = 1): Promise<void> {
    await this.ensureConnected()
    this.client.set(`${prefix}${ACTIVE_PRISONS}`, JSON.stringify(activePrisons), { EX: durationDays * 24 * 60 * 60 })
  }

  async getActivePrisons(): Promise<Array<PrisonResponse>> {
    await this.ensureConnected()
    const serializedActivePrisons = await this.client.get(`${prefix}${ACTIVE_PRISONS}`)
    return serializedActivePrisons ? (JSON.parse(serializedActivePrisons.toString()) as Array<PrisonResponse>) : []
  }
}
