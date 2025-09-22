import type { FunctionalSkills, InPrisonCourseRecords, CuriousAlnAndLddAssessments } from 'viewModels'
import toCuriousAlnAndLddAssessments from '../routes/overview/mappers/curiousAlnAndLddAssessmentsMapper'
import CuriousClient from '../data/curiousClient'
import logger from '../../logger'
import toFunctionalSkills from '../routes/overview/mappers/functionalSkillsMapper'
import toInPrisonCourseRecords from '../data/mappers/inPrisonCourseRecordsMapper'

export default class CuriousService {
  constructor(private readonly curiousClient: CuriousClient) {}

  /**
   * Returns the Additional Learning Needs (ALN) and Learning Difficulties and Disabilities (LDD) assessments for a
   * given prisoner.
   */
  async getAlnAndLddAssessments(prisonNumber: string): Promise<CuriousAlnAndLddAssessments> {
    try {
      const allPrisonerAssessments = await this.curiousClient.getAssessmentsByPrisonNumber(prisonNumber)
      return toCuriousAlnAndLddAssessments(allPrisonerAssessments)
    } catch (error) {
      logger.error('Error retrieving support needs data from Curious', error)
      throw error
    }
  }

  async getPrisonerFunctionalSkills(
    prisonNumber: string,
    options: { useCurious1ApiForFunctionalSkills: boolean } = { useCurious1ApiForFunctionalSkills: false },
  ): Promise<FunctionalSkills> {
    try {
      const allPrisonerAssessments = await this.curiousClient.getAssessmentsByPrisonNumber(prisonNumber)
      const learnerProfiles =
        options.useCurious1ApiForFunctionalSkills === true
          ? (await this.curiousClient.getLearnerProfile(prisonNumber)) || []
          : null

      return toFunctionalSkills(allPrisonerAssessments, learnerProfiles)
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
