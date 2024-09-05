import type { ArchiveGoalDto, CreateGoalDto, EducationDto, UnarchiveGoalDto, UpdateGoalDto } from 'dto'
import type { CreateGoalsRequest } from 'educationAndWorkPlanApiClient'
import type { ActionPlan, Goals } from 'viewModels'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import { toCreateGoalRequest } from '../data/mappers/createGoalMapper'
import { toActionPlan, toGoals } from '../data/mappers/actionPlanMapper'
import logger from '../../logger'
import { toUpdateGoalRequest } from '../data/mappers/updateGoalMapper'
import toArchiveGoalRequest from '../data/mappers/archiveGoalMapper'
import toUnarchiveGoalRequest from '../data/mappers/unarchiveGoalMapper'
import GoalStatusValue from '../enums/goalStatusValue'
import PrisonService from './prisonService'
import toEducationDto from '../data/mappers/educationMapper'

export default class EducationAndWorkPlanService {
  constructor(
    private readonly educationAndWorkPlanClient: EducationAndWorkPlanClient,
    private readonly prisonService: PrisonService,
  ) {}

  async createGoals(prisonNumber: string, createGoalDtos: CreateGoalDto[], token: string): Promise<unknown> {
    const createGoalsRequest: CreateGoalsRequest = {
      goals: createGoalDtos.map(createGoalDto => toCreateGoalRequest(createGoalDto)),
    }
    return this.educationAndWorkPlanClient.createGoals(prisonNumber, createGoalsRequest, token)
  }

  async getActionPlan(prisonNumber: string, token: string): Promise<ActionPlan> {
    try {
      const actionPlanResponse = await this.educationAndWorkPlanClient.getActionPlan(prisonNumber, token)
      const prisonNamesById = await this.getAllPrisonNamesByIdSafely(token)
      return toActionPlan(actionPlanResponse, false, prisonNamesById)
    } catch (error) {
      logger.error(`Error retrieving Action Plan for Prisoner [${prisonNumber}]: ${error}`)
      return { problemRetrievingData: true } as ActionPlan
    }
  }

  async getGoalsByStatus(prisonNumber: string, status: GoalStatusValue, token: string): Promise<Goals> {
    try {
      const response = await this.educationAndWorkPlanClient.getGoalsByStatus(prisonNumber, status, token)
      const prisonNamesById = await this.getAllPrisonNamesByIdSafely(token)
      return { goals: toGoals(response, prisonNamesById), problemRetrievingData: false }
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

  private async getAllPrisonNamesByIdSafely(token: string): Promise<Map<string, string>> {
    try {
      return await this.prisonService.getAllPrisonNamesById(token)
    } catch (error) {
      logger.error(`Error retrieving prison names, defaulting to just IDs: ${error}`)
      return new Map()
    }
  }

  async getEducation(prisonNumber: string, token: string): Promise<EducationDto> {
    try {
      const educationResponse = await this.educationAndWorkPlanClient.getEducationResponse(prisonNumber, token)
      return toEducationDto(educationResponse, prisonNumber)
    } catch (error) {
      logger.error(`Error retrieving Education for Prisoner [${prisonNumber}]: ${error}`)
      throw error
    }
  }
}
