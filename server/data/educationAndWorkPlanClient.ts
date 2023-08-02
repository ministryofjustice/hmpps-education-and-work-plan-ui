import type { ActionPlanResponse, CreateGoalRequest, UpdateGoalRequest } from 'educationAndWorkPlanApiClient'
import RestClient from './restClient'
import config from '../config'

export default class EducationAndWorkPlanClient {
  private static restClient(token: string): RestClient {
    return new RestClient('Education and Work Plan API Client', config.apis.educationAndWorkPlan, token)
  }

  async createGoal(createGoalRequest: CreateGoalRequest, token: string): Promise<unknown> {
    return EducationAndWorkPlanClient.restClient(token).post({
      path: `/action-plans/${createGoalRequest.prisonNumber}/goals`,
      data: createGoalRequest,
    })
  }

  async getActionPlan(prisonNumber: string, token: string): Promise<ActionPlanResponse> {
    return EducationAndWorkPlanClient.restClient(token).get({
      path: `/action-plans/${prisonNumber}`,
    })
  }

  async updateGoal(prisonNumber: string, updateGoalRequest: UpdateGoalRequest, token: string): Promise<unknown> {
    return EducationAndWorkPlanClient.restClient(token).put({
      path: `/action-plans/${prisonNumber}/goals/${updateGoalRequest.goalReference}`,
      data: updateGoalRequest,
    })
  }
}
