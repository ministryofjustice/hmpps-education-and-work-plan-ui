import type { Prisoner } from 'prisonerSearchApiClient'
import { RedisClient } from '../redisClient'
import logger from '../../../logger'

const PRISONER = 'prisoner'

export default class PrisonerSearchStore {
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

  async setPrisoner(prisonNumber: string, prisoner: Prisoner, durationDays = 1): Promise<string> {
    await this.ensureConnected()
    return this.client.set(`${PRISONER}-${prisonNumber}`, JSON.stringify(prisoner), { EX: durationDays * 24 * 60 * 60 })
  }

  async getPrisoner(prisonNumber: string): Promise<Prisoner> {
    await this.ensureConnected()
    const serializedPrisoner = await this.client.get(`${PRISONER}-${prisonNumber}`)
    return serializedPrisoner ? (JSON.parse(serializedPrisoner) as Prisoner) : undefined
  }
}
