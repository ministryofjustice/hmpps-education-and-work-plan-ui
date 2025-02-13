import type { PrisonerSummaries, PrisonerSummary } from 'viewModels'
import type { PagedCollectionOfPrisoners, Prisoner } from 'prisonerSearchApiClient'
import { HmppsAuthClient, PrisonerSearchClient } from '../data'
import toPrisonerSummary from '../data/mappers/prisonerSummaryMapper'
import logger from '../../logger'
import PrisonerSearchStore from '../data/prisonerSearchStore/prisonerSearchStore'
import config from '../config'

const PRISONER_CACHE_TTL_DAYS = 1

export default class PrisonerSearchService {
  constructor(
    private readonly hmppsAuthClient: HmppsAuthClient,
    private readonly prisonerSearchClient: PrisonerSearchClient,
    private readonly prisonerSearchStore: PrisonerSearchStore,
  ) {}

  /**
   * Returns the [PrisonerSummary]s for the specified prisonId
   *
   * The HMPPS `prisoner-search` API is a paged API. This function calls the API starting from page 0 until there are no
   * more pages remaining. The cumulative array of Prisoner records from all API calls are mapped and
   * grouped into an array of `PrisonerSummary` within the returned `PrisonerSummaries` object.
   */
  async getPrisonersByPrisonId(prisonId: string, username: string): Promise<PrisonerSummaries> {
    try {
      const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

      let page = 0
      const pageSize = config.apis.prisonerSearch.defaultPageSize

      let apiPagedResponse = { last: false } as PagedCollectionOfPrisoners
      const apiPrisoners: Array<Prisoner> = []

      // loop until the API response's `last` field is `true`
      while (apiPagedResponse.last === false) {
        // eslint-disable-next-line no-await-in-loop
        apiPagedResponse = (await this.prisonerSearchClient.getPrisonersByPrisonId(
          prisonId,
          page,
          pageSize,
          systemToken,
        )) || { last: true }
        apiPrisoners.push(...apiPagedResponse.content)
        page += 1
      }

      if (apiPrisoners.length === 0) {
        logger.info(`No prisoners found for prison [${prisonId}] in prisoner-search API`)
      }

      return {
        problemRetrievingData: false,
        prisoners: apiPrisoners.map(prisoner => toPrisonerSummary(prisoner)),
      }
    } catch (error) {
      logger.error(`Error retrieving prisoners for prison ${prisonId} from prisoner-search API`, error)
      return { problemRetrievingData: true } as PrisonerSummaries
    }
  }

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
