import type { Timeline } from 'viewModels'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import toTimeline from '../data/mappers/timelineMapper'
import logger from '../../logger'
import PrisonService from './prisonService'
import { HmppsAuthClient } from '../data'
import TimelineApiFilterOptions from '../data/timelineApiFilterOptions'
import TimelineFilterTypeValue from '../enums/timelineFilterTypeValue'

export default class TimelineService {
  constructor(
    private readonly educationAndWorkPlanClient: EducationAndWorkPlanClient,
    private readonly prisonService: PrisonService,
    private readonly hmppsAuthClient: HmppsAuthClient,
  ) {}

  async getTimeline(
    prisonNumber: string,
    filterOptions: Array<TimelineFilterTypeValue>,
    username: string,
  ): Promise<Timeline> {
    try {
      const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

      const timelineApiFilterOptions = new TimelineApiFilterOptions(
        filterOptions.length === 0 ||
        (filterOptions.length === 1 && filterOptions.includes(TimelineFilterTypeValue.ALL))
          ? {
              inductions: false,
              goals: false,
              reviews: false,
              prisonEvents: false,
              eventsSince: undefined,
              prisonId: undefined,
            }
          : {
              inductions: filterOptions.includes(TimelineFilterTypeValue.INDUCTION),
              goals: filterOptions.includes(TimelineFilterTypeValue.GOALS),
              reviews: filterOptions.includes(TimelineFilterTypeValue.REVIEWS),
              prisonEvents: filterOptions.includes(TimelineFilterTypeValue.PRISON_MOVEMENTS),
              eventsSince: undefined,
              prisonId: undefined,
            },
      )

      const timelineResponse = await this.educationAndWorkPlanClient.getTimeline(
        prisonNumber,
        timelineApiFilterOptions,
        systemToken,
      )

      if (!timelineResponse) {
        logger.debug(`No Timeline for prisoner [${prisonNumber}]`)
        return {
          problemRetrievingData: false,
          events: [],
          prisonNumber,
          filteredBy: filterOptions,
        }
      }

      const prisonNamesById = await this.prisonService.getAllPrisonNamesById(username)
      return toTimeline(timelineResponse, prisonNamesById, filterOptions)
    } catch (error) {
      logger.error(`Error retrieving Timeline for Prisoner [${prisonNumber}]`, error)
      return { problemRetrievingData: true } as Timeline
    }
  }
}
