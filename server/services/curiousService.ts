import type { LearnerEducation, LearnerEducationPagedResponse, LearnerProfile } from 'curiousApiClient'
import type { FunctionalSkills, InPrisonCourseRecords, PrisonerSupportNeeds } from 'viewModels'
import toPrisonerSupportNeeds from '../routes/overview/mappers/prisonerSupportNeedsMapper'
import CuriousClient from '../data/curiousClient'
import logger from '../../logger'
import toFunctionalSkills from '../routes/overview/mappers/functionalSkillsMapper'
import PrisonService from './prisonService'
import toInPrisonCourseRecords from '../data/mappers/inPrisonCourseRecordsMapper'

export default class CuriousService {
  constructor(
    private readonly curiousClient: CuriousClient,
    private readonly prisonService: PrisonService,
  ) {}

  async getPrisonerSupportNeeds(prisonNumber: string): Promise<PrisonerSupportNeeds> {
    try {
      const allPrisonerAssessments = await this.curiousClient.getAssessmentsByPrisonNumber(prisonNumber)
      return toPrisonerSupportNeeds(allPrisonerAssessments)
    } catch (error) {
      logger.error('Error retrieving support needs data from Curious', error)
      throw error
    }
  }

  async getPrisonerFunctionalSkills(prisonNumber: string): Promise<FunctionalSkills> {
    try {
      const learnerProfiles = await this.getLearnerProfile(prisonNumber)
      return toFunctionalSkills(learnerProfiles)
    } catch (error) {
      logger.error('Error retrieving functional skills data from Curious', error)
      throw error
    }
  }

  /**
   * Returns the specified prisoner's In Prison Course Records
   *
   * The Curious `learnerEducation` API is a paged API. This function calls the API starting from page 0 until there are no
   * more pages remaining. The cumulative array of Curious `LearnerEducation` records from all API calls are mapped and
   * grouped into arrays of `InPrisonCourse` within the returned `InPrisonCourseRecords` object.
   */
  async getPrisonerInPrisonCourses(prisonNumber: string): Promise<InPrisonCourseRecords> {
    try {
      let page = 0
      let apiPagedResponse = { last: false } as LearnerEducationPagedResponse
      const apiLearnerEducation: Array<LearnerEducation> = []

      // loop until the API response's `last` field is `true`
      while (apiPagedResponse.last === false) {
        // eslint-disable-next-line no-await-in-loop
        apiPagedResponse = (await this.curiousClient.getLearnerEducationPage(prisonNumber, page)) || {
          last: true,
          content: [],
        }
        apiLearnerEducation.push(...apiPagedResponse.content)
        page += 1
      }

      if (apiLearnerEducation.length === 0) {
        logger.info(`No learner education data found for prisoner [${prisonNumber}] in Curious`)
      }

      return toInPrisonCourseRecords(apiLearnerEducation)
    } catch (error) {
      logger.error('Error retrieving learner education data from Curious', error)
      throw error
    }
  }

  private getLearnerProfile = async (prisonNumber: string): Promise<Array<LearnerProfile>> =>
    (await this.curiousClient.getLearnerProfile(prisonNumber)) || []
}
