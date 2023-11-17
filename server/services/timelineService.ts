import type { TimelineResponse } from 'educationAndWorkPlanApiClient'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'

export default class TimelineService {
  constructor(private readonly educationAndWorkPlanClient: EducationAndWorkPlanClient) {}

  async getTimeline(prisonNumber: string, token: string): Promise<TimelineResponse> {
    return this.educationAndWorkPlanClient.getTimeline(prisonNumber, token)
  }
}
