import type { LearnerNeurodivergence, LearnerProfile } from 'curiousApiClient'
import type { SupportNeeds } from 'viewModels'
import { toSupportNeeds } from '../routes/overview/mappers/supportNeedsMapper'
import CuriousClient from '../data/curiousClient'
import { HmppsAuthClient } from '../data'
import logger from '../../logger'

export default class CuriousService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient, private readonly curiousClient: CuriousClient) {}

  async getPrisonerSupportNeeds(
    prisonNumber: string,
    establishmentId: string,
    username: string,
  ): Promise<SupportNeeds> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    try {
      const learnerProfile: LearnerProfile = await this.curiousClient.getLearnerProfile(
        prisonNumber,
        establishmentId,
        systemToken,
      )
      const neuroDivergence: LearnerNeurodivergence = await this.curiousClient.getLearnerNeurodivergence(
        prisonNumber,
        establishmentId,
        systemToken,
      )

      return toSupportNeeds(learnerProfile, neuroDivergence)
    } catch (error) {
      logger.info(error)
      if (error.code === 404) {
        logger.info(`No data found for prisoner [${prisonNumber}] in Curious`)
        return toSupportNeeds(undefined, undefined)
      }
      throw error
    }
  }
}
