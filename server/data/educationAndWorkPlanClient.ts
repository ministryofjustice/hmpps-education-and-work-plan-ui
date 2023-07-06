import type { CreateGoalDto } from 'dto'
import { toCreateGoalRequest } from './mappers/educationAndWorkPlanApiMapper'
import RestClient from './restClient'
import config from '../config'

export default class EducationAndWorkPlanClient {
  private static restClient(token: string): RestClient {
    return new RestClient('Education and Work Plan API Client', config.apis.educationAndWorkPlan, token)
  }

  async createGoal(createGoalDto: CreateGoalDto, token: string): Promise<void> {
    const createGoalRequest = toCreateGoalRequest(createGoalDto)

    await EducationAndWorkPlanClient.restClient(token).post({
      path: `/action-plans/${createGoalRequest.prisonNumber}/goals`,
      data: createGoalRequest,
    })
  }
}
