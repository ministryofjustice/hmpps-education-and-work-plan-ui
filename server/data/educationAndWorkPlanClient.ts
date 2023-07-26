import type { ActionPlanDto, CreateGoalDto } from 'dto'
import type { ActionPlanResponse } from 'educationAndWorkPlanApiClient'
import { toCreateGoalRequest } from './mappers/createGoalMapper'
import RestClient from './restClient'
import config from '../config'
import { toActionPlanDto } from './mappers/actionPlanMapper'

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

  async getActionPlan(prisonNumber: string, token: string): Promise<ActionPlanDto> {
    const actionPlanResponse = (await EducationAndWorkPlanClient.restClient(token).get({
      path: `/action-plans/${prisonNumber}`,
    })) as Promise<ActionPlanResponse>
    return toActionPlanDto(actionPlanResponse)
  }
}
