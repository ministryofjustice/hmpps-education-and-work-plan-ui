import type { LearnerNeurodivergence, LearnerProfile } from 'curiousApiClient'
import type { PrisonerSupportNeeds } from 'viewModels'
import { toPrisonerSupportNeeds } from '../routes/overview/mappers/prisonerSupportNeedsMapper'
import CuriousClient from '../data/curiousClient'
import { HmppsAuthClient } from '../data'
import logger from '../../logger'

export default class CuriousService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient, private readonly curiousClient: CuriousClient) {}

  async getPrisonerSupportNeeds(prisonNumber: string, username: string): Promise<PrisonerSupportNeeds> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    try {
      const learnerProfile: Array<LearnerProfile> = await this.curiousClient.getLearnerProfile(
        prisonNumber,
        systemToken,
      )
      const neuroDivergence: Array<LearnerNeurodivergence> = await this.curiousClient.getLearnerNeurodivergence(
        prisonNumber,
        systemToken,
      )

      return toPrisonerSupportNeeds(learnerProfile, neuroDivergence)
    } catch (error) {
      logger.info(error)
      if (error.code === 404) {
        // TODO - we need to check if this is right, but Curious has been unavailable
        logger.info(`No data found for prisoner [${prisonNumber}] in Curious`)
        return toPrisonerSupportNeeds(undefined, undefined)
      }
      throw error
    }
  }
}
