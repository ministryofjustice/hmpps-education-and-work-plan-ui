import type { CreateGoalDto, UpdateGoalDto } from 'dto'
import type { CreateGoalsRequest } from 'educationAndWorkPlanApiClient'
import type { ActionPlan, Timeline } from 'viewModels'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import { toCreateGoalRequest } from '../data/mappers/createGoalMapper'
import { toActionPlan } from '../data/mappers/actionPlanMapper'
import logger from '../../logger'
import { toUpdateGoalRequest } from '../data/mappers/updateGoalMapper'

export default class EducationAndWorkPlanService {
  constructor(private readonly educationAndWorkPlanClient: EducationAndWorkPlanClient) {}

  async createGoals(createGoalDtos: CreateGoalDto[], token: string): Promise<unknown> {
    const createGoalsRequest: CreateGoalsRequest = {
      goals: createGoalDtos.map(createGoalDto => toCreateGoalRequest(createGoalDto)),
    }
    return this.educationAndWorkPlanClient.createGoals(createGoalsRequest, token)
  }

  async getActionPlan(prisonNumber: string, token: string): Promise<ActionPlan> {
    try {
      const actionPlanResponse = await this.educationAndWorkPlanClient.getActionPlan(prisonNumber, token)
      return toActionPlan(actionPlanResponse, false)
    } catch (error) {
      logger.error(`Error retrieving Action Plan for Prisoner [${prisonNumber}]: ${error}`)
      return { problemRetrievingData: true } as ActionPlan
    }
  }

  async updateGoal(prisonNumber: string, updateGoalDto: UpdateGoalDto, token: string): Promise<unknown> {
    const updateGoalRequest = toUpdateGoalRequest(updateGoalDto)
    return this.educationAndWorkPlanClient.updateGoal(prisonNumber, updateGoalRequest, token)
  }

  async getTimeline(prisonNumber: string, token: string): Promise<Timeline> {
    return this.educationAndWorkPlanClient.getTimeline(prisonNumber, token)
  }
}
