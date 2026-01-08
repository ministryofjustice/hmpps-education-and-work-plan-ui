import type { Timeline } from 'viewModels'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import toTimeline from '../data/mappers/timelineMapper'
import logger from '../../logger'
import PrisonService from './prisonService'
import TimelineApiFilterOptions from '../data/timelineApiFilterOptions'
import TimelineFilterTypeValue from '../enums/timelineFilterTypeValue'

export default class TimelineService {
  constructor(
    private readonly educationAndWorkPlanClient: EducationAndWorkPlanClient,
    private readonly prisonService: PrisonService,
  ) {}

  async getTimeline(request: {
    prisonNumber: string
    username: string
    filterOptions: {
      inductions: boolean
      goals: boolean
      reviews: boolean
      prisonEvents: boolean
      eventsSince?: Date
      prisonId?: string
    }
  }): Promise<Timeline> {
    const { filterOptions, username, prisonNumber } = request

    try {
      const timelineApiFilterOptions = new TimelineApiFilterOptions(filterOptions)
      const timelineResponse = await this.educationAndWorkPlanClient.getTimeline(
        prisonNumber,
        timelineApiFilterOptions,
        username,
      )

      const { inductions, goals, reviews, prisonEvents, eventsSince, prisonId } = filterOptions
      const filteredBy: Array<TimelineFilterTypeValue> =
        !inductions && !goals && !reviews && !prisonEvents && !eventsSince && !prisonId
          ? [TimelineFilterTypeValue.ALL]
          : [
              inductions ? TimelineFilterTypeValue.INDUCTION : undefined,
              goals ? TimelineFilterTypeValue.GOALS : undefined,
              reviews ? TimelineFilterTypeValue.REVIEWS : undefined,
              prisonEvents ? TimelineFilterTypeValue.PRISON_MOVEMENTS : undefined,
              eventsSince ? TimelineFilterTypeValue.LAST_6_MONTHS : undefined,
              prisonId ? TimelineFilterTypeValue.CURRENT_PRISON : undefined,
            ].filter(value => value !== undefined)

      if (!timelineResponse) {
        logger.debug(`No Timeline for prisoner [${prisonNumber}]`)
        return {
          problemRetrievingData: false,
          events: [],
          prisonNumber,
          filteredBy,
        }
      }

      const prisonNamesById = await this.prisonService.getAllPrisonNamesById(username)
      return toTimeline(timelineResponse, prisonNamesById, filteredBy)
    } catch (error) {
      logger.error(`Error retrieving Timeline for Prisoner [${prisonNumber}]`, error)
      return { problemRetrievingData: true } as Timeline
    }
  }
}
