import type { ArchiveGoalDto, CreateGoalDto, UnarchiveGoalDto, UpdateGoalDto } from 'dto'
import type { CreateGoalsRequest } from 'educationAndWorkPlanApiClient'
import type { ActionPlan, Goals } from 'viewModels'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import HmppsAuthClient from '../data/hmppsAuthClient'
import { toCreateGoalRequest } from '../data/mappers/createGoalMapper'
import { toActionPlan, toGoals } from '../data/mappers/actionPlanMapper'
import logger from '../../logger'
import { toUpdateGoalRequest } from '../data/mappers/updateGoalMapper'
import toArchiveGoalRequest from '../data/mappers/archiveGoalMapper'
import toUnarchiveGoalRequest from '../data/mappers/unarchiveGoalMapper'
import GoalStatusValue from '../enums/goalStatusValue'

export default class EducationAndWorkPlanService {
  constructor(
    private readonly educationAndWorkPlanClient: EducationAndWorkPlanClient,
    private readonly hmppsAuthClient: HmppsAuthClient,
  ) {}

  async createGoals(createGoalDtos: CreateGoalDto[], username: string): Promise<unknown> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)
    const createGoalsRequest: CreateGoalsRequest = {
      goals: createGoalDtos.map(createGoalDto => toCreateGoalRequest(createGoalDto)),
    }
    return this.educationAndWorkPlanClient.createGoals(createGoalsRequest, systemToken)
  }

  async getActionPlan(prisonNumber: string, username: string): Promise<ActionPlan> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)
    try {
      const actionPlanResponse = await this.educationAndWorkPlanClient.getActionPlan(prisonNumber, systemToken)
      return toActionPlan(actionPlanResponse, false)
    } catch (error) {
      logger.error(`Error retrieving Action Plan for Prisoner [${prisonNumber}]: ${error}`)
      return { problemRetrievingData: true } as ActionPlan
    }
  }

  async getGoalsByStatus(prisonNumber: string, status: GoalStatusValue, username: string): Promise<Goals> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)
    try {
      const response = await this.educationAndWorkPlanClient.getGoalsByStatus(prisonNumber, status, systemToken)
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

  async updateGoal(prisonNumber: string, updateGoalDto: UpdateGoalDto, username: string): Promise<unknown> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)
    const updateGoalRequest = toUpdateGoalRequest(updateGoalDto)
    return this.educationAndWorkPlanClient.updateGoal(prisonNumber, updateGoalRequest, systemToken)
  }

  async archiveGoal(archiveGoalDto: ArchiveGoalDto, username: string): Promise<unknown> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)
    const archiveGoalRequest = toArchiveGoalRequest(archiveGoalDto)
    return this.educationAndWorkPlanClient.archiveGoal(archiveGoalDto.prisonNumber, archiveGoalRequest, systemToken)
  }

  async unarchiveGoal(unarchiveGoalDto: UnarchiveGoalDto, username: string): Promise<unknown> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)
    const unarchiveGoalRequest = toUnarchiveGoalRequest(unarchiveGoalDto)
    return this.educationAndWorkPlanClient.unarchiveGoal(
      unarchiveGoalDto.prisonNumber,
      unarchiveGoalRequest,
      systemToken,
    )
  }
}
