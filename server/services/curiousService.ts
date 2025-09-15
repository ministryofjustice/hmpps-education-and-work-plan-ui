import type { FunctionalSkills, InPrisonCourseRecords, PrisonerSupportNeeds } from 'viewModels'
import toPrisonerSupportNeeds from '../routes/overview/mappers/prisonerSupportNeedsMapper'
import CuriousClient from '../data/curiousClient'
import logger from '../../logger'
import toFunctionalSkills from '../routes/overview/mappers/functionalSkillsMapper'
import toInPrisonCourseRecords from '../data/mappers/inPrisonCourseRecordsMapper'

export default class CuriousService {
  constructor(private readonly curiousClient: CuriousClient) {}

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
      const learnerProfiles = (await this.curiousClient.getLearnerProfile(prisonNumber)) || []
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
      const allPrisonerQualifications = await this.curiousClient.getQualificationsByPrisonNumber(prisonNumber)
      return toInPrisonCourseRecords(allPrisonerQualifications)
    } catch (error) {
      logger.error('Error retrieving learner education data from Curious', error)
      throw error
    }
  }
}
