import type { Timeline } from 'viewModels'
import type { TimelineResponse } from 'educationAndWorkPlanApiClient'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import { toTimeline } from '../data/mappers/timelineMapper'
import logger from '../../logger'

export default class TimelineService {
  constructor(private readonly educationAndWorkPlanClient: EducationAndWorkPlanClient) {}

  async getTimeline(prisonNumber: string, token: string): Promise<Timeline> {
    try {
      const timelineResponse = await this.educationAndWorkPlanClient.getTimeline(prisonNumber, token)
      const timelineResponseFilteredEvents = this.filterTimelineByActionPlanCreatedEvent(timelineResponse)
      timelineResponse.events = timelineResponseFilteredEvents
      return toTimeline(timelineResponse)
    } catch (error) {
      logger.error(`Error retrieving Timeline for Prisoner [${prisonNumber}]: ${error}`)
      return { problemRetrievingData: true } as Timeline
    }
  }

  filterTimelineByActionPlanCreatedEvent = (timelineResponse: TimelineResponse) => {
    return timelineResponse.events.filter((event: { eventType: string }) => event.eventType === 'ACTION_PLAN_CREATED')
  }
}
