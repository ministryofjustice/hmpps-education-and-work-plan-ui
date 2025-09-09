import type { PrisonResponse } from 'prisonRegisterApiClient'
import PrisonRegisterStore from '../data/prisonRegisterStore/prisonRegisterStore'
import PrisonRegisterClient from '../data/prisonRegisterClient'
import logger from '../../logger'

const PRISON_CACHE_TTL_DAYS = 1

/**
 * Service class to retrieve and cache prisons from the `prison-register` API.
 */
export default class PrisonService {
  constructor(
    private readonly prisonRegisterStore: PrisonRegisterStore,
    private readonly prisonRegisterClient: PrisonRegisterClient,
  ) {}

  /**
   * Returns a simple object of prison id to prison name
   */
  async getAllPrisonNamesById(username: string): Promise<Record<string, string>> {
    try {
      const prisons = (await this.getCachedPrisons()) || (await this.retrieveAndCacheActivePrisons(username))
      return prisons.reduce((acc, prison) => {
        acc[prison.prisonId] = prison.prisonName
        return acc
      }, {})
    } catch (e) {
      logger.error(`Error looking up prisons`, e)
      return {}
    }
  }

  private async getCachedPrisons(): Promise<Array<PrisonResponse>> {
    try {
      const allActivePrisons = await this.prisonRegisterStore.getActivePrisons()
      if (allActivePrisons && allActivePrisons.length > 0) {
        return allActivePrisons
      }
      logger.debug(`Prisons not found in cache`)
    } catch (ex) {
      // Looking up the prisons from the cached data store failed for some reason. Return undefined.
      logger.error('Error retrieving cached prisons', ex)
    }
    return undefined
  }

  /**
   * Calls the prison-register API to retrieve all prisons, then caches just the active ones in the cache.
   * Returns an array of active prisons that were cached.
   */
  private async retrieveAndCacheActivePrisons(username: string): Promise<Array<PrisonResponse>> {
    logger.info('Retrieving and caching active prisons')
    let allPrisonResponses: Array<PrisonResponse>
    try {
      allPrisonResponses = (await this.prisonRegisterClient.getAllPrisons(username)) || []
    } catch (ex) {
      // Retrieving prisons from the API failed. Return an empty array.
      logger.error('Error retrieving prisons', ex)
      return []
    }

    const activePrisons = allPrisonResponses.filter(prison => prison.active === true)
    try {
      await this.prisonRegisterStore.setActivePrisons(activePrisons, PRISON_CACHE_TTL_DAYS)
    } catch (ex) {
      // Caching prisons retrieved from the API failed. Log a warning but return the prisons anyway. Next time the service is called the caching will be retried.
      logger.warn('Error caching prisons', ex)
    }
    return activePrisons
  }
}
