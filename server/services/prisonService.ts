import type { Prison } from 'viewModels'
import type { PrisonResponse } from 'prisonRegisterApiClient'
import PrisonRegisterStore from '../data/cache/prisonRegisterStore'
import PrisonRegisterClient from '../data/prisonRegisterClient'
import toPrison from '../data/mappers/prisonMapper'
import logger from '../../logger'

const PRISON_CACHE_TTL_DAYS = 1

export default class PrisonService {
  constructor(
    private readonly prisonRegisterStore: PrisonRegisterStore,
    private readonly prisonRegisterClient: PrisonRegisterClient,
  ) {}

  async getPrisonByPrisonId(prisonId: string, token: string): Promise<Prison | undefined> {
    const prisonResponse = await this.getPrison(prisonId, token)

    if (prisonResponse) {
      return toPrison(prisonResponse)
    }

    logger.info(`Could not find details for prison ${prisonId}`)
    return undefined
  }

  private async getPrison(prisonId: string, token: string): Promise<PrisonResponse | undefined> {
    return (
      (await this.getCachedPrison(prisonId)) ||
      (async () => {
        const allPrisonResponses = await this.retrieveAndCacheActivePrisons(prisonId, token)
        return allPrisonResponses.find(prisonResponse => prisonResponse.prisonId === prisonId)
      })()
    )
  }

  private async getCachedPrison(prisonId: string): Promise<PrisonResponse | undefined> {
    try {
      const allActivePrisons = await this.prisonRegisterStore.getActivePrisons()
      return allActivePrisons.find(prisonResponse => prisonResponse.prisonId === prisonId)
    } catch (ex) {
      // Looking up the prisons from the cached data store failed for some reason. Return undefined.
      logger.error('Error retrieving cached prisons', ex)
      return undefined
    }
  }

  private async retrieveAndCacheActivePrisons(prisonId: string, token: string): Promise<Array<PrisonResponse>> {
    logger.info('Retrieving and caching active prisons')
    try {
      const allPrisonResponses = await this.prisonRegisterClient.getAllPrisons(token)
      await this.prisonRegisterStore.setActivePrisons(allPrisonResponses, PRISON_CACHE_TTL_DAYS)
      return allPrisonResponses
    } catch (ex) {
      // Retrieving and caching prisons failed for some reason. Return an empty array.
      logger.error('Error retrieving and caching prisons', ex)
      return []
    }
  }
}
