import type {
  LearnerEducation,
  LearnerEductionPagedResponse,
  LearnerNeurodivergence,
  LearnerProfile,
} from 'curiousApiClient'
import type { FunctionalSkills, InPrisonCourse, InPrisonCourseRecords, PrisonerSupportNeeds } from 'viewModels'
import { toPrisonerSupportNeeds } from '../routes/overview/mappers/prisonerSupportNeedsMapper'
import CuriousClient from '../data/curiousClient'
import { HmppsAuthClient } from '../data'
import logger from '../../logger'
import toFunctionalSkills from '../routes/overview/mappers/functionalSkillsMapper'
import { toInPrisonCourse } from '../data/mappers/inPrisonCourseMapper'
import dateComparator from '../routes/dateComparator'
import PrisonService from './prisonService'

export default class CuriousService {
  constructor(
    private readonly hmppsAuthClient: HmppsAuthClient,
    private readonly curiousClient: CuriousClient,
    private readonly prisonService: PrisonService,
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
      return toFunctionalSkills(learnerProfiles, prisonNumber)
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

      const allCourses = apiLearnerEducation
        .map(learnerEducation => toInPrisonCourse(learnerEducation))
        .sort((left: InPrisonCourse, right: InPrisonCourse) =>
          dateComparator(left.courseCompletionDate, right.courseCompletionDate, 'DESC'),
        )
      const allCoursesWithPrisonNamePopulated = await this.setPrisonNamesOnInPrisonCourses(allCourses, username)

      const completedCourses = allCoursesWithPrisonNamePopulated.filter(
        inPrisonCourse => inPrisonCourse.courseStatus === 'COMPLETED',
      )
      const inProgressCourses = allCoursesWithPrisonNamePopulated.filter(
        inPrisonCourse => inPrisonCourse.courseStatus === 'IN_PROGRESS',
      )
      const withdrawnCourses = allCoursesWithPrisonNamePopulated.filter(
        inPrisonCourse => inPrisonCourse.courseStatus === 'WITHDRAWN',
      )
      const temporarilyWithdrawnCourses = allCoursesWithPrisonNamePopulated.filter(
        inPrisonCourse => inPrisonCourse.courseStatus === 'TEMPORARILY_WITHDRAWN',
      )

      const coursesCompletedInLast12Months = [...completedCourses].filter(inPrisonCourse => {
        const twelveMonthsAgo = new Date()
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)
        return inPrisonCourse.courseCompletionDate >= twelveMonthsAgo
      })

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
      if (error.status === 404) {
        logger.info(`No learner education data found for prisoner [${prisonNumber}] in Curious`)
        return {
          problemRetrievingData: false,
          totalRecords: 0,
          coursesByStatus: {
            COMPLETED: [],
            IN_PROGRESS: [],
            WITHDRAWN: [],
            TEMPORARILY_WITHDRAWN: [],
          },
          coursesCompletedInLast12Months: [],
          prisonNumber,
        }
      }

      logger.error('Error retrieving learner education data from Curious', error)
      return { problemRetrievingData: true } as InPrisonCourseRecords
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

  private async setPrisonNamesOnInPrisonCourses(
    inPrisonCourses: Array<InPrisonCourse>,
    username: string,
  ): Promise<Array<InPrisonCourse>> {
    return Promise.all(
      inPrisonCourses.map(async inPrisonCourse => {
        const prison = await this.prisonService.getPrisonByPrisonId(inPrisonCourse.prisonId, username)
        return {
          ...inPrisonCourse,
          prisonName: prison?.prisonName,
        }
      }),
    )
  }
}
