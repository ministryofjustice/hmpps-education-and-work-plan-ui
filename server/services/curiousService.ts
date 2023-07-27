import type { LearnerNeurodivergence, LearnerProfile } from 'curiousApiClient'
import type { FunctionalSkills, PrisonerSupportNeeds } from 'viewModels'
import { toPrisonerSupportNeeds } from '../routes/overview/mappers/prisonerSupportNeedsMapper'
import CuriousClient from '../data/curiousClient'
import { HmppsAuthClient } from '../data'
import logger from '../../logger'
import { toFunctionalSkills } from '../routes/overview/mappers/functionalSkillsMapper'

export default class CuriousService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient, private readonly curiousClient: CuriousClient) {}

  async getPrisonerSupportNeeds(prisonNumber: string, username: string): Promise<PrisonerSupportNeeds> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    try {
      const learnerProfiles = await this.getLearnerProfile(prisonNumber, systemToken)
      const neuroDivergences = await this.getLearnerNeurodivergence(prisonNumber, systemToken)

      return toPrisonerSupportNeeds(learnerProfiles, neuroDivergences)
    } catch (error) {
      logger.error(`Error retrieving data from Curious: ${error}`)
      return { problemRetrievingData: true } as PrisonerSupportNeeds
    }
  }

  async getPrisonerFunctionalSkills(prisonNumber: string, username: string): Promise<FunctionalSkills> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    try {
      const learnerProfiles = await this.getLearnerProfile(prisonNumber, systemToken)
      return toFunctionalSkills(learnerProfiles)
    } catch (error) {
      logger.error(`Error retrieving data from Curious: ${error}`)
      return { problemRetrievingData: true } as FunctionalSkills
    }
  }

  private getLearnerProfile = async (prisonNumber: string, token: string): Promise<Array<LearnerProfile>> => {
    try {
      return await this.curiousClient.getLearnerProfile(prisonNumber, token)
    } catch (error) {
      if (error.status === 404) {
        logger.info(`No data found for prisoner [${prisonNumber}] in Curious`)
        return undefined
      }
      throw error
    }
  }

  private getLearnerNeurodivergence = async (
    prisonNumber: string,
    token: string,
  ): Promise<Array<LearnerNeurodivergence>> => {
    try {
      return await this.curiousClient.getLearnerNeurodivergence(prisonNumber, token)
    } catch (error) {
      if (error.status === 404) {
        logger.info(`No data found for prisoner [${prisonNumber}] in Curious`)
        return undefined
      }
      throw error
    }
  }
}
