import type { TimelineResponse } from 'educationAndWorkPlanApiClient'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import toTimeline from '../routes/overview/mappers/timelineMapper'
import logger from '../../logger'

export default class TimelineService {
  constructor(private readonly educationAndWorkPlanClient: EducationAndWorkPlanClient) {}

  async getTimeline(prisonNumber: string, token: string): Promise<TimelineResponse> {
    try {
      const timelineResponse = await this.educationAndWorkPlanClient.getTimeline(prisonNumber, token)
      return toTimeline(timelineResponse)
    } catch (error) {
      logger.error(`Error retrieving Timeline for Prisoner [${prisonNumber}]: ${error}`)
      return { problemRetrievingData: true } as TimelineResponse
    }
  }
}
