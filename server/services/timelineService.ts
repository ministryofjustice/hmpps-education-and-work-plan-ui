import type { Timeline } from 'viewModels'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import toTimeline from '../data/mappers/timelineMapper'
import logger from '../../logger'
import PrisonService from './prisonService'
import { HmppsAuthClient } from '../data'
import TimelineApiFilterOptions from '../data/timelineApiFilterOptions'

export default class TimelineService {
  constructor(
    private readonly educationAndWorkPlanClient: EducationAndWorkPlanClient,
    private readonly prisonService: PrisonService,
    private readonly hmppsAuthClient: HmppsAuthClient,
  ) {}

  async getTimeline(prisonNumber: string, username: string): Promise<Timeline> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)
    try {
      const timelineApiFilterOptions = new TimelineApiFilterOptions({
        inductions: true,
        goals: true,
        reviews: true,
        prisonEvents: true,
      })

      const timelineResponse = await this.educationAndWorkPlanClient.getTimeline(
        prisonNumber,
        timelineApiFilterOptions,
        systemToken,
      )

      if (!timelineResponse) {
        logger.debug(`No Timeline for prisoner [${prisonNumber}]`)
        return null
      }

      const prisonNamesById = await this.prisonService.getAllPrisonNamesById(username)
      return toTimeline(timelineResponse, prisonNamesById)
    } catch (error) {
      logger.error(`Error retrieving Timeline for Prisoner [${prisonNumber}]`, error)
      return { problemRetrievingData: true } as Timeline
    }
  }
}
