import type { ArchiveGoalDto, CreateGoalDto, UnarchiveGoalDto, UpdateGoalDto } from 'dto'
import type { CreateGoalsRequest } from 'educationAndWorkPlanApiClient'
import type { ActionPlan, GoalsOrProblem } from 'viewModels'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import { toCreateGoalRequest } from '../data/mappers/createGoalMapper'
import { toActionPlan, toGoals } from '../data/mappers/actionPlanMapper'
import logger from '../../logger'
import { toUpdateGoalRequest } from '../data/mappers/updateGoalMapper'
import toArchiveGoalRequest from '../data/mappers/archiveGoalMapper'
import toUnarchiveGoalRequest from '../data/mappers/unarchiveGoalMapper'
import GoalStatusValue from '../enums/goalStatusValue'

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

  async getGoalsByStatus(prisonNumber: string, status: GoalStatusValue, token: string): Promise<GoalsOrProblem> {
    try {
      const response = await this.educationAndWorkPlanClient.getGoalsByStatus(prisonNumber, status, token)
      return { goals: toGoals(response), problemRetrievingData: false }
    } catch (error) {
      if (error.status === 404) {
        logger.debug(`No plan created yet so no goals with [${status}] for Prisoner [${prisonNumber}]`)
        return { goals: undefined, problemRetrievingData: false }
      }
      logger.error(`Error retrieving goals with status [${status}] for Prisoner [${prisonNumber}]: ${error}`)
      return { goals: undefined, problemRetrievingData: true }
    }
  }

  async updateGoal(prisonNumber: string, updateGoalDto: UpdateGoalDto, token: string): Promise<unknown> {
    const updateGoalRequest = toUpdateGoalRequest(updateGoalDto)
    return this.educationAndWorkPlanClient.updateGoal(prisonNumber, updateGoalRequest, token)
  }

  async archiveGoal(archiveGoalDto: ArchiveGoalDto, token: string): Promise<unknown> {
    const archiveGoalRequest = toArchiveGoalRequest(archiveGoalDto)
    return this.educationAndWorkPlanClient.archiveGoal(archiveGoalDto.prisonNumber, archiveGoalRequest, token)
  }

  async unarchiveGoal(unarchiveGoalDto: UnarchiveGoalDto, token: string): Promise<unknown> {
    const unarchiveGoalRequest = toUnarchiveGoalRequest(unarchiveGoalDto)
    return this.educationAndWorkPlanClient.unarchiveGoal(unarchiveGoalDto.prisonNumber, unarchiveGoalRequest, token)
  }
}
