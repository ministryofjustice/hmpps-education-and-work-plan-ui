import type {
  ActionPlanResponse,
  ActionPlanSummaryListResponse,
  CreateGoalsRequest,
  GetActionPlanSummariesRequest,
  UpdateGoalRequest,
  TimelineResponse,
  InductionResponse,
  UpdateInductionRequest,
} from 'educationAndWorkPlanApiClient'
import RestClient from './restClient'
import config from '../config'

export default class EducationAndWorkPlanClient {
  private static restClient(token: string): RestClient {
    return new RestClient('Education and Work Plan API Client', config.apis.educationAndWorkPlan, token)
  }

  async createGoals(createGoalsRequest: CreateGoalsRequest, token: string): Promise<unknown> {
    return EducationAndWorkPlanClient.restClient(token).post({
      path: `/action-plans/${createGoalsRequest.goals[0].prisonNumber}/goals`,
      data: createGoalsRequest,
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

  async getActionPlans(prisonNumbers: string[], token: string): Promise<ActionPlanSummaryListResponse> {
    const requestBody: GetActionPlanSummariesRequest = { prisonNumbers }
    return EducationAndWorkPlanClient.restClient(token).post({
      path: '/action-plans',
      data: requestBody,
    })
  }

  async getTimeline(prisonNumber: string, token: string): Promise<TimelineResponse> {
    return EducationAndWorkPlanClient.restClient(token).get({
      path: `/timelines/${prisonNumber}`,
    })
  }

  async getInduction(prisonNumber: string, token: string): Promise<InductionResponse> {
    return EducationAndWorkPlanClient.restClient(token).get({
      path: `/inductions/${prisonNumber}`,
    })
  }

  async updateInduction(
    prisonNumber: string,
    updateInductionRequest: UpdateInductionRequest,
    token: string,
  ): Promise<unknown> {
    return EducationAndWorkPlanClient.restClient(token).put({
      path: `/inductions/${prisonNumber}`,
      data: updateInductionRequest,
    })
  }
}
