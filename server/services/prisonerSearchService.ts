import type { Prisoner } from 'prisonRegisterApiClient'
import { HmppsAuthClient, PrisonerSearchClient } from '../data'

export default class PrisonerSearchService {
  constructor(
    private readonly hmppsAuthClient: HmppsAuthClient,
    private readonly prisonerSearchClient: PrisonerSearchClient,
  ) {}

  async getPrisonerByPrisonNumber(prisonNumber: string, username: string): Promise<Prisoner> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)
    return this.prisonerSearchClient.getPrisonerByPrisonNumber(prisonNumber, systemToken)
  }
}
