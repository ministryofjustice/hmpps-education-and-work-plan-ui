import type {
  ActionPlanResponse,
  ActionPlanSummaryListResponse,
  CreateGoalsRequest,
  GetActionPlanSummariesRequest,
  UpdateGoalRequest,
  TimelineResponse,
  InductionResponse,
  UpdateInductionRequest,
  CreateInductionRequest,
  ArchiveGoalRequest,
  UnarchiveGoalRequest,
  TimelineEventResponse,
  GetGoalsResponse,
  CreateEducationRequest,
  EducationResponse,
} from 'educationAndWorkPlanApiClient'
import RestClient from './restClient'
import config from '../config'
import GoalStatusValue from '../enums/goalStatusValue'

export default class EducationAndWorkPlanClient {
  private static restClient(token: string): RestClient {
    return new RestClient('Education and Work Plan API Client', config.apis.educationAndWorkPlan, token)
  }

  async createGoals(prisonNumber: string, createGoalsRequest: CreateGoalsRequest, token: string): Promise<void> {
    return EducationAndWorkPlanClient.restClient(token).post({
      path: `/action-plans/${prisonNumber}/goals`,
      data: createGoalsRequest,
    })
  }

  async getActionPlan(prisonNumber: string, token: string): Promise<ActionPlanResponse> {
    return EducationAndWorkPlanClient.restClient(token).get<ActionPlanResponse>({
      path: `/action-plans/${prisonNumber}`,
    })
  }

  async getGoalsByStatus(prisonNumber: string, status: GoalStatusValue, token: string): Promise<GetGoalsResponse> {
    return EducationAndWorkPlanClient.restClient(token).get<GetGoalsResponse>({
      path: `/action-plans/${prisonNumber}/goals`,
      query: {
        status,
      },
    })
  }

  async updateGoal(prisonNumber: string, updateGoalRequest: UpdateGoalRequest, token: string): Promise<void> {
    return EducationAndWorkPlanClient.restClient(token).put({
      path: `/action-plans/${prisonNumber}/goals/${updateGoalRequest.goalReference}`,
      data: updateGoalRequest,
    })
  }

  async archiveGoal(prisonNumber: string, archiveGoalRequest: ArchiveGoalRequest, token: string): Promise<void> {
    return EducationAndWorkPlanClient.restClient(token).put({
      path: `/action-plans/${prisonNumber}/goals/${archiveGoalRequest.goalReference}/archive`,
      data: archiveGoalRequest,
    })
  }

  async unarchiveGoal(prisonNumber: string, unarchiveGoalRequest: UnarchiveGoalRequest, token: string): Promise<void> {
    return EducationAndWorkPlanClient.restClient(token).put({
      path: `/action-plans/${prisonNumber}/goals/${unarchiveGoalRequest.goalReference}/unarchive`,
      data: unarchiveGoalRequest,
    })
  }

  async getActionPlans(prisonNumbers: string[], token: string): Promise<ActionPlanSummaryListResponse> {
    const requestBody: GetActionPlanSummariesRequest = { prisonNumbers }
    return EducationAndWorkPlanClient.restClient(token).post<ActionPlanSummaryListResponse>({
      path: '/action-plans',
      data: requestBody,
    })
  }

  async getTimeline(prisonNumber: string, token: string, eventTypes?: Array<string>): Promise<TimelineResponse> {
    const timeline = await EducationAndWorkPlanClient.restClient(token).get<TimelineResponse>({
      path: `/timelines/${prisonNumber}`,
    })
    // TODO - remove this filtering of the response and replace with a query string param whe the API supports filtering via query string
    if (!eventTypes) {
      return timeline
    }
    return {
      ...timeline,
      events: (timeline.events as Array<TimelineEventResponse>).filter(event => eventTypes.includes(event.eventType)),
    }
  }

  async getInduction(prisonNumber: string, token: string): Promise<InductionResponse> {
    return EducationAndWorkPlanClient.restClient(token).get<InductionResponse>({
      path: `/inductions/${prisonNumber}`,
    })
  }

  async updateInduction(
    prisonNumber: string,
    updateInductionRequest: UpdateInductionRequest,
    token: string,
  ): Promise<never> {
    return EducationAndWorkPlanClient.restClient(token).put({
      path: `/inductions/${prisonNumber}`,
      data: updateInductionRequest,
    })
  }

  async createInduction(
    prisonNumber: string,
    createInductionRequest: CreateInductionRequest,
    token: string,
  ): Promise<void> {
    return EducationAndWorkPlanClient.restClient(token).post({
      path: `/inductions/${prisonNumber}`,
      data: createInductionRequest,
    })
  }

  async getEducation(prisonNumber: string, token: string): Promise<EducationResponse> {
    return EducationAndWorkPlanClient.restClient(token).get<EducationResponse>({
      path: `/person/${prisonNumber}/education`,
    })
  }

  async createEducation(
    prisonNumber: string,
    createdEducationRequest: CreateEducationRequest,
    token: string,
  ): Promise<void> {
    return EducationAndWorkPlanClient.restClient(token).post({
      path: `/person/${prisonNumber}/education`,
      data: createdEducationRequest,
    })
  }
}
