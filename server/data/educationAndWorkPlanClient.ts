import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import { asSystem, RestClient } from '@ministryofjustice/hmpps-rest-client'
import type {
  ActionPlanResponse,
  ActionPlanReviewsResponse,
  ActionPlanSummaryListResponse,
  ArchiveGoalRequest,
  CompleteGoalRequest,
  CreateActionPlanRequest,
  CreateActionPlanReviewRequest,
  CreateActionPlanReviewResponse,
  CreateEducationRequest,
  CreateGoalsRequest,
  CreateInductionRequest,
  EducationResponse,
  GetActionPlanSummariesRequest,
  GetGoalsResponse,
  GoalResponse,
  InductionResponse,
  InductionScheduleResponse,
  PersonSearchResult,
  PrisonerIdsRequest,
  SessionResponses,
  SessionSummaryResponse,
  TimelineResponse,
  UnarchiveGoalRequest,
  UpdateEducationRequest,
  UpdateGoalRequest,
  UpdateInductionRequest,
  UpdateInductionScheduleStatusRequest,
  UpdateReviewScheduleStatusRequest,
} from 'educationAndWorkPlanApiClient'
import config from '../config'
import GoalStatusValue from '../enums/goalStatusValue'
import SessionStatusValue from '../enums/sessionStatusValue'
import TimelineApiFilterOptions from './timelineApiFilterOptions'
import logger from '../../logger'
import restClientErrorHandler from './restClientErrorHandler'
import SearchSortDirection from '../enums/searchSortDirection'
import SearchSortField from '../enums/searchSortField'
import SearchPlanStatus from '../enums/searchPlanStatus'

export default class EducationAndWorkPlanClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('Education and Work Plan API Client', config.apis.educationAndWorkPlan, logger, authenticationClient)
  }

  async getActionPlan(prisonNumber: string, username: string): Promise<ActionPlanResponse> {
    return this.get<ActionPlanResponse>(
      {
        path: `/action-plans/${prisonNumber}`,
        errorHandler: restClientErrorHandler({ ignore404: true }),
      },
      asSystem(username),
    )
  }

  async createActionPlan(
    prisonNumber: string,
    createActionPlanRequest: CreateActionPlanRequest,
    username: string,
  ): Promise<void> {
    return this.post(
      {
        path: `/action-plans/${prisonNumber}`,
        data: createActionPlanRequest,
      },
      asSystem(username),
    )
  }

  async createGoals(prisonNumber: string, createGoalsRequest: CreateGoalsRequest, username: string): Promise<void> {
    return this.post(
      {
        path: `/action-plans/${prisonNumber}/goals`,
        data: createGoalsRequest,
      },
      asSystem(username),
    )
  }

  async getGoalsByStatus(prisonNumber: string, status: GoalStatusValue, username: string): Promise<GetGoalsResponse> {
    return this.get<GetGoalsResponse>(
      {
        path: `/action-plans/${prisonNumber}/goals`,
        query: {
          status,
        },
        errorHandler: restClientErrorHandler({ ignore404: true }),
      },
      asSystem(username),
    )
  }

  async getGoal(prisonNumber: string, goalReference: string, username: string): Promise<GoalResponse> {
    return this.get<GoalResponse>(
      {
        path: `/action-plans/${prisonNumber}/goals/${goalReference}`,
        errorHandler: restClientErrorHandler({ ignore404: true }),
      },
      asSystem(username),
    )
  }

  async updateGoal(prisonNumber: string, updateGoalRequest: UpdateGoalRequest, username: string): Promise<void> {
    return this.put(
      {
        path: `/action-plans/${prisonNumber}/goals/${updateGoalRequest.goalReference}`,
        data: updateGoalRequest,
      },
      asSystem(username),
    )
  }

  async archiveGoal(prisonNumber: string, archiveGoalRequest: ArchiveGoalRequest, username: string): Promise<void> {
    return this.put(
      {
        path: `/action-plans/${prisonNumber}/goals/${archiveGoalRequest.goalReference}/archive`,
        data: archiveGoalRequest,
      },
      asSystem(username),
    )
  }

  async unarchiveGoal(
    prisonNumber: string,
    unarchiveGoalRequest: UnarchiveGoalRequest,
    username: string,
  ): Promise<void> {
    return this.put(
      {
        path: `/action-plans/${prisonNumber}/goals/${unarchiveGoalRequest.goalReference}/unarchive`,
        data: unarchiveGoalRequest,
      },
      asSystem(username),
    )
  }

  async completeGoal(prisonNumber: string, completeGoalRequest: CompleteGoalRequest, username: string): Promise<void> {
    return this.put(
      {
        path: `/action-plans/${prisonNumber}/goals/${completeGoalRequest.goalReference}/complete`,
        data: completeGoalRequest,
      },
      asSystem(username),
    )
  }

  async getActionPlans(prisonNumbers: string[], username: string): Promise<ActionPlanSummaryListResponse> {
    const requestBody: GetActionPlanSummariesRequest = { prisonNumbers }
    return this.post<ActionPlanSummaryListResponse>(
      {
        path: '/action-plans',
        data: requestBody,
      },
      asSystem(username),
    )
  }

  async createActionPlanReview(
    prisonNumber: string,
    createActionPlanReviewRequest: CreateActionPlanReviewRequest,
    username: string,
  ): Promise<CreateActionPlanReviewResponse> {
    return this.post(
      {
        path: `/action-plans/${prisonNumber}/reviews`,
        data: createActionPlanReviewRequest,
      },
      asSystem(username),
    )
  }

  async getActionPlanReviews(prisonNumber: string, username: string): Promise<ActionPlanReviewsResponse> {
    return this.get(
      {
        path: `/action-plans/${prisonNumber}/reviews`,
        errorHandler: restClientErrorHandler({ ignore404: true }),
      },
      asSystem(username),
    )
  }

  async updateActionPlanReviewScheduleStatus(
    prisonNumber: string,
    updateReviewScheduleStatusRequest: UpdateReviewScheduleStatusRequest,
    username: string,
  ): Promise<void> {
    return this.put(
      {
        path: `/action-plans/${prisonNumber}/reviews/schedule-status`,
        data: updateReviewScheduleStatusRequest,
      },
      asSystem(username),
    )
  }

  async getTimeline(
    prisonNumber: string,
    apiFilterOptions: TimelineApiFilterOptions,
    username: string,
  ): Promise<TimelineResponse> {
    return this.get<TimelineResponse>(
      {
        path: `/timelines/${prisonNumber}`,
        query: apiFilterOptions.queryParams,
        errorHandler: restClientErrorHandler({ ignore404: true }),
      },
      asSystem(username),
    )
  }

  async getInduction(prisonNumber: string, username: string): Promise<InductionResponse> {
    return this.get<InductionResponse>(
      {
        path: `/inductions/${prisonNumber}`,
        errorHandler: restClientErrorHandler({ ignore404: true }),
      },
      asSystem(username),
    )
  }

  async updateInduction(
    prisonNumber: string,
    updateInductionRequest: UpdateInductionRequest,
    username: string,
  ): Promise<never> {
    return this.put(
      {
        path: `/inductions/${prisonNumber}`,
        data: updateInductionRequest,
      },
      asSystem(username),
    )
  }

  async createInduction(
    prisonNumber: string,
    createInductionRequest: CreateInductionRequest,
    username: string,
  ): Promise<void> {
    return this.post(
      {
        path: `/inductions/${prisonNumber}`,
        data: createInductionRequest,
      },
      asSystem(username),
    )
  }

  async getInductionSchedule(prisonNumber: string, username: string): Promise<InductionScheduleResponse> {
    return this.get(
      {
        path: `/inductions/${prisonNumber}/induction-schedule`,
        errorHandler: restClientErrorHandler({ ignore404: true }),
      },
      asSystem(username),
    )
  }

  async updateInductionScheduleStatus(
    prisonNumber: string,
    updateReviewScheduleStatusRequest: UpdateInductionScheduleStatusRequest,
    username: string,
  ): Promise<void> {
    return this.put(
      {
        path: `/inductions/${prisonNumber}/induction-schedule`,
        data: updateReviewScheduleStatusRequest,
      },
      asSystem(username),
    )
  }

  async getEducation(prisonNumber: string, username: string): Promise<EducationResponse> {
    return this.get<EducationResponse>(
      {
        path: `/person/${prisonNumber}/education`,
        errorHandler: restClientErrorHandler({ ignore404: true }),
      },
      asSystem(username),
    )
  }

  async createEducation(
    prisonNumber: string,
    createEducationRequest: CreateEducationRequest,
    username: string,
  ): Promise<void> {
    return this.post(
      {
        path: `/person/${prisonNumber}/education`,
        data: createEducationRequest,
      },
      asSystem(username),
    )
  }

  async updateEducation(
    prisonNumber: string,
    updateEducationRequest: UpdateEducationRequest,
    username: string,
  ): Promise<void> {
    return this.put(
      {
        path: `/person/${prisonNumber}/education`,
        data: updateEducationRequest,
      },
      asSystem(username),
    )
  }

  async getSessionSummary(prisonId: string, username: string): Promise<SessionSummaryResponse> {
    return this.get<SessionSummaryResponse>(
      {
        path: `/session/${prisonId}/summary`,
        errorHandler: restClientErrorHandler({ ignore404: true }),
      },
      asSystem(username),
    )
  }

  async getSessions(prisonNumbers: string[], username: string, status: SessionStatusValue): Promise<SessionResponses> {
    const requestBody: PrisonerIdsRequest = { prisonNumbers }
    return this.post<SessionResponses>(
      {
        path: '/session/summary',
        data: requestBody,
        query: {
          status,
        },
      },
      asSystem(username),
    )
  }

  async searchByPrison(
    prisonId: string,
    username: string,
    prisonerNameOrNumber?: string,
    planStatus?: SearchPlanStatus,
    page?: number,
    pageSize?: number,
    sortBy?: SearchSortField,
    sortDirection?: SearchSortDirection,
  ): Promise<PersonSearchResult> {
    return this.get<PersonSearchResult>(
      {
        path: `/search/prisons/${prisonId}/people`,
        query: {
          prisonerNameOrNumber,
          planStatus,
          page,
          pageSize,
          sortBy,
          sortDirection,
        },
        errorHandler: restClientErrorHandler({ ignore404: true }),
      },
      asSystem(username),
    )
  }
}
