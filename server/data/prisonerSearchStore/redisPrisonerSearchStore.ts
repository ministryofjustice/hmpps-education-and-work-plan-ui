import type { Prisoner } from 'prisonerSearchApiClient'
import { RedisClient } from '../redisClient'
import logger from '../../../logger'
import PrisonerSearchStore from './prisonerSearchStore'

const PRISONER = 'prisoner'

export default class RedisPrisonerSearchStore implements PrisonerSearchStore {
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

  async setPrisoner(prisonNumber: string, prisoner: Prisoner, durationHours = 24): Promise<void> {
    await this.ensureConnected()
    this.client.set(`${PRISONER}-${prisonNumber}`, JSON.stringify(prisoner), { EX: durationHours * 60 * 60 })
  }

  async getPrisoner(prisonNumber: string): Promise<Prisoner> {
    await this.ensureConnected()
    const serializedPrisoner = await this.client.get(`${PRISONER}-${prisonNumber}`)
    return serializedPrisoner ? (JSON.parse(serializedPrisoner.toString()) as Prisoner) : undefined
  }
}
