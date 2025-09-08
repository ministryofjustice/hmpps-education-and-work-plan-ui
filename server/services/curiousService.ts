import type { LearnerEducation, LearnerEducationPagedResponse, LearnerProfile } from 'curiousApiClient'
import type { FunctionalSkills, InPrisonCourse, InPrisonCourseRecords, PrisonerSupportNeeds } from 'viewModels'
import { startOfToday, sub } from 'date-fns'
import toPrisonerSupportNeeds from '../routes/overview/mappers/prisonerSupportNeedsMapper'
import CuriousClient from '../data/curiousClient'
import logger from '../../logger'
import toFunctionalSkills from '../routes/overview/mappers/functionalSkillsMapper'
import { toInPrisonCourse } from '../data/mappers/inPrisonCourseMapper'
import dateComparator from '../routes/dateComparator'
import PrisonService from './prisonService'

export default class CuriousService {
  constructor(
    private readonly curiousClient: CuriousClient,
    private readonly prisonService: PrisonService,
  ) {}

  async getPrisonerSupportNeeds(prisonNumber: string, username: string): Promise<PrisonerSupportNeeds> {
    const prisonNamesById = await this.prisonService.getAllPrisonNamesById(username)

    try {
      const learnerProfiles = await this.getLearnerProfile(prisonNumber)
      return toPrisonerSupportNeeds(learnerProfiles, prisonNamesById)
    } catch (error) {
      logger.error(`Error retrieving support needs data from Curious: ${JSON.stringify(error)}`)
      return { problemRetrievingData: true, healthAndSupportNeeds: [] }
    }
  }

  async getPrisonerFunctionalSkills(prisonNumber: string, username: string): Promise<FunctionalSkills> {
    const prisonNamesById = await this.prisonService.getAllPrisonNamesById(username)

    try {
      const learnerProfiles = await this.getLearnerProfile(prisonNumber)
      return toFunctionalSkills(learnerProfiles, prisonNumber, prisonNamesById)
    } catch (error) {
      logger.error(`Error retrieving functional skills data from Curious: ${JSON.stringify(error)}`)
      return { problemRetrievingData: true } as FunctionalSkills
    }
  }

  /**
   * Returns the specified prisoner's In Prison Course Records
   *
   * The Curious `learnerEducation` API is a paged API. This function calls the API starting from page 0 until there are no
   * more pages remaining. The cumulative array of Curious `LearnerEducation` records from all API calls are mapped and
   * grouped into arrays of `InPrisonCourse` within the returned `InPrisonCourseRecords` object.
   */
  async getPrisonerInPrisonCourses(prisonNumber: string, username: string): Promise<InPrisonCourseRecords> {
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

      const allCourses = apiLearnerEducation
        .map(learnerEducation => toInPrisonCourse(learnerEducation))
        .sort((left: InPrisonCourse, right: InPrisonCourse) =>
          dateComparator(left.courseCompletionDate, right.courseCompletionDate, 'DESC'),
        )
      const allCoursesWithPrisonNamePopulated = await this.setPrisonNamesOnInPrisonCourses(allCourses, username)

      const completedCourses = [...allCoursesWithPrisonNamePopulated].filter(
        inPrisonCourse => inPrisonCourse.courseStatus === 'COMPLETED',
      )
      const inProgressCourses = [...allCoursesWithPrisonNamePopulated].filter(
        inPrisonCourse => inPrisonCourse.courseStatus === 'IN_PROGRESS',
      )
      const withdrawnCourses = [...allCoursesWithPrisonNamePopulated].filter(
        inPrisonCourse => inPrisonCourse.courseStatus === 'WITHDRAWN',
      )
      const temporarilyWithdrawnCourses = [...allCoursesWithPrisonNamePopulated].filter(
        inPrisonCourse => inPrisonCourse.courseStatus === 'TEMPORARILY_WITHDRAWN',
      )

      const twelveMonthsAgo = sub(startOfToday(), { months: 12 })
      const coursesCompletedInLast12Months = [...completedCourses].filter(
        inPrisonCourse => inPrisonCourse.courseCompletionDate >= twelveMonthsAgo,
      )

      return {
        problemRetrievingData: false,
        totalRecords: allCourses.length,
        coursesByStatus: {
          COMPLETED: completedCourses,
          IN_PROGRESS: inProgressCourses,
          WITHDRAWN: withdrawnCourses,
          TEMPORARILY_WITHDRAWN: temporarilyWithdrawnCourses,
        },
        coursesCompletedInLast12Months,
        prisonNumber,
      }
    } catch (error) {
      logger.error('Error retrieving learner education data from Curious', error)
      return { problemRetrievingData: true } as InPrisonCourseRecords
    }
  }

  private getLearnerProfile = async (prisonNumber: string): Promise<Array<LearnerProfile>> =>
    (await this.curiousClient.getLearnerProfile(prisonNumber)) || []

  private setPrisonNamesOnInPrisonCourses = async (
    inPrisonCourses: Array<InPrisonCourse>,
    username: string,
  ): Promise<Array<InPrisonCourse>> => {
    const allPrisonNamesById = await this.getAllPrisonNamesByIdSafely(username)
    return inPrisonCourses.map(inPrisonCourse => {
      const prison = allPrisonNamesById.get(inPrisonCourse.prisonId)
      return {
        ...inPrisonCourse,
        prisonName: prison,
      }
    })
  }

  private getAllPrisonNamesByIdSafely = async (username: string): Promise<Map<string, string>> => {
    try {
      return await this.prisonService.getAllPrisonNamesById(username)
    } catch (error) {
      logger.error(`Error retrieving prison names, defaulting to just IDs: ${error}`)
      return new Map()
    }
  }
}
