import type { PrisonerSummary } from 'viewModels'
import { HmppsAuthClient, PrisonerSearchClient } from '../data'
import toPrisonerSummary from '../data/mappers/prisonerSummaryMapper'

export default class PrisonerSearchService {
  constructor(
    private readonly hmppsAuthClient: HmppsAuthClient,
    private readonly prisonerSearchClient: PrisonerSearchClient,
  ) {}

  async getPrisonerByPrisonNumber(prisonNumber: string, username: string): Promise<PrisonerSummary> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)
    const prisoner = await this.prisonerSearchClient.getPrisonerByPrisonNumber(prisonNumber, systemToken)
    return toPrisonerSummary(prisoner)
  }
}
