import type { PrisonResponse } from 'prisonRegisterApiClient'
import { createRedisClient, RedisClient } from './redisClient'
import RedisStore from './redisStore'

const ACTIVE_PRISONS = 'activePrisons'

export default class PrisonRegisterStore extends RedisStore {
  constructor(redisClient: RedisClient = createRedisClient('prisonRegister:')) {
    super(redisClient)
  }

  async setActivePrisons(prisons: Array<PrisonResponse>, durationDays = 1): Promise<string> {
    const activePrisons = prisons.filter(prison => prison.active === true)
    return this.setEntry(ACTIVE_PRISONS, JSON.stringify(activePrisons), durationDays * 24 * 60 * 60)
  }

  async getActivePrisons(): Promise<Array<PrisonResponse>> {
    const serializedActivePrisons = await this.getEntry(ACTIVE_PRISONS)
    return serializedActivePrisons ? (JSON.parse(serializedActivePrisons) as Array<PrisonResponse>) : []
  }
}
