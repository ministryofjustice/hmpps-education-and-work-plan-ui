import type {
  LearnerEducation,
  LearnerEductionPagedResponse,
  LearnerNeurodivergence,
  LearnerProfile,
} from 'curiousApiClient'
import type { FunctionalSkills, InPrisonEducationRecords, PrisonerSupportNeeds } from 'viewModels'
import { toPrisonerSupportNeeds } from '../routes/overview/mappers/prisonerSupportNeedsMapper'
import CuriousClient from '../data/curiousClient'
import { HmppsAuthClient } from '../data'
import logger from '../../logger'
import toFunctionalSkills from '../routes/overview/mappers/functionalSkillsMapper'
import toInPrisonEducation from '../data/mappers/inPrisonEducationMapper'

export default class CuriousService {
  constructor(
    private readonly hmppsAuthClient: HmppsAuthClient,
    private readonly curiousClient: CuriousClient,
  ) {}

  async getPrisonerSupportNeeds(prisonNumber: string, username: string): Promise<PrisonerSupportNeeds> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    try {
      const learnerProfiles = await this.getLearnerProfile(prisonNumber, systemToken)
      const neuroDivergences = await this.getLearnerNeurodivergence(prisonNumber, systemToken)

      return toPrisonerSupportNeeds(learnerProfiles, neuroDivergences)
    } catch (error) {
      logger.error(`Error retrieving support needs data from Curious: ${JSON.stringify(error)}`)
      return { problemRetrievingData: true } as PrisonerSupportNeeds
    }
  }

  async getPrisonerFunctionalSkills(prisonNumber: string, username: string): Promise<FunctionalSkills> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    try {
      const learnerProfiles = await this.getLearnerProfile(prisonNumber, systemToken)
      return toFunctionalSkills(learnerProfiles)
    } catch (error) {
      logger.error(`Error retrieving functional skills data from Curious: ${JSON.stringify(error)}`)
      return { problemRetrievingData: true } as FunctionalSkills
    }
  }

  /**
   * Returns the specified prisoner's Education Records
   *
   * The Curious `learnerEducation` API is a paged API. This function calls the API starting from page 0 until there are no
   * more pages remaining. The cumulative array of Curious `LearnerEducation` records from all API calls are mapped into
   * and an array of `InPrisonEducation` within the returned `InPrisonEducationRecords` object.
   */
  async getLearnerEducation(prisonNumber: string, username: string): Promise<InPrisonEducationRecords> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    try {
      let page = 0
      let apiPagedResponse = { last: false } as LearnerEductionPagedResponse
      const apiLearnerEducation: Array<LearnerEducation> = []

      // loop until the API response's `last` field is `true`
      while (apiPagedResponse.last === false) {
        // eslint-disable-next-line no-await-in-loop
        apiPagedResponse = await this.curiousClient.getLearnerEducationPage(prisonNumber, systemToken, page)
        apiLearnerEducation.push(...apiPagedResponse.content)
        page += 1
      }

      return {
        problemRetrievingData: false,
        educationRecords: apiLearnerEducation.map(learnerEducation => toInPrisonEducation(learnerEducation)),
      } as InPrisonEducationRecords
    } catch (error) {
      if (error.status === 404) {
        logger.info(`No learner education data found for prisoner [${prisonNumber}] in Curious`)
        return { problemRetrievingData: false, educationRecords: undefined } as InPrisonEducationRecords
      }

      logger.error(`Error retrieving learner education data from Curious: ${JSON.stringify(error)}`)
      return { problemRetrievingData: true, educationRecords: undefined } as InPrisonEducationRecords
    }
  }

  private getLearnerProfile = async (prisonNumber: string, token: string): Promise<Array<LearnerProfile>> => {
    try {
      return await this.curiousClient.getLearnerProfile(prisonNumber, token)
    } catch (error) {
      if (error.status === 404) {
        logger.info(`No learner profile data found for prisoner [${prisonNumber}] in Curious`)
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
        logger.info(`No neurodivergence data found for prisoner [${prisonNumber}] in Curious`)
        return undefined
      }
      throw error
    }
  }
}
