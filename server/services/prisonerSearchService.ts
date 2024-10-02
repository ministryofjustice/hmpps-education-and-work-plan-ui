import type { PrisonerSummary } from 'viewModels'
import type { Prisoner } from 'prisonerSearchApiClient'
import { HmppsAuthClient, PrisonerSearchClient } from '../data'
import toPrisonerSummary from '../data/mappers/prisonerSummaryMapper'
import logger from '../../logger'
import PrisonerSearchStore from '../data/prisonerSearchStore/prisonerSearchStore'

const PRISONER_CACHE_TTL_DAYS = 1

export default class PrisonerSearchService {
  constructor(
    private readonly hmppsAuthClient: HmppsAuthClient,
    private readonly prisonerSearchClient: PrisonerSearchClient,
    private readonly prisonerSearchStore: PrisonerSearchStore,
  ) {}

  async getPrisonerByPrisonNumber(prisonNumber: string, username: string): Promise<PrisonerSummary> {
    let prisoner: Prisoner
    prisoner = await this.getCachedPrisoner(prisonNumber)
    if (!prisoner) {
      const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)
      prisoner = await this.retrieveAndCachePrisoner(prisonNumber, systemToken)
    }
    return toPrisonerSummary(prisoner)
  }

  private async getCachedPrisoner(prisonNumber: string): Promise<Prisoner> {
    try {
      const prisoner = await this.prisonerSearchStore.getPrisoner(prisonNumber)
      if (prisoner) {
        return prisoner
      }
      logger.debug(`Prisoner not found in cache`)
    } catch (ex) {
      // Looking up the prisoner from the cached data store failed for some reason. Return undefined.
      logger.error('Error retrieving cached prisoner', ex)
    }
    return undefined
  }

  /**
   * Calls the prisoner-search API to retrieve a given prisoner, then caches it in the cache.
   * Returns the cached prisoner.
   */
  private async retrieveAndCachePrisoner(prisonNumber: string, token: string): Promise<Prisoner> {
    logger.info(`Retrieving and caching prisoner ${prisonNumber}`)
    let prisoner: Prisoner
    try {
      prisoner = await this.prisonerSearchClient.getPrisonerByPrisonNumber(prisonNumber, token)
    } catch (ex) {
      // Retrieving prisoner from the API failed.
      logger.error('Error retrieving prisons', ex)
      throw ex
    }

    try {
      await this.prisonerSearchStore.setPrisoner(prisonNumber, prisoner, PRISONER_CACHE_TTL_DAYS)
    } catch (ex) {
      // Caching prisoner retrieved from the API failed. Log a warning but return the prisoner anyway. Next time the service is called the caching will be retried.
      logger.warn('Error caching prisoner', ex)
    }
    return prisoner
  }
}
