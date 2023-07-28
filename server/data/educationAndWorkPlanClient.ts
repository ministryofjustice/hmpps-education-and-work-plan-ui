import type { ActionPlanResponse, CreateGoalRequest } from 'educationAndWorkPlanApiClient'
import RestClient from './restClient'
import config from '../config'

export default class EducationAndWorkPlanClient {
  private static restClient(token: string): RestClient {
    return new RestClient('Education and Work Plan API Client', config.apis.educationAndWorkPlan, token)
  }

  async createGoal(createGoalRequest: CreateGoalRequest, token: string): Promise<void> {
    await EducationAndWorkPlanClient.restClient(token).post({
      path: `/action-plans/${createGoalRequest.prisonNumber}/goals`,
      data: createGoalRequest,
    })
  }

  async getActionPlan(prisonNumber: string, token: string): Promise<ActionPlanResponse> {
    const actionPlanResponse = (await EducationAndWorkPlanClient.restClient(token).get({
      path: `/action-plans/${prisonNumber}`,
    })) as Promise<ActionPlanResponse>
    return actionPlanResponse
  }
}
