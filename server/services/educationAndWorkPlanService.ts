import type {
  ArchiveGoalDto,
  CompleteGoalDto,
  CreateActionPlanDto,
  CreateGoalDto,
  CreateOrUpdateEducationDto,
  EducationDto,
  UnarchiveGoalDto,
  UpdateGoalDto,
} from 'dto'
import type { CreateGoalsRequest } from 'educationAndWorkPlanApiClient'
import type { ActionPlan, Goals, PrisonerGoals } from 'viewModels'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import toCompleteGoalRequest from '../data/mappers/completeGoalMapper'
import { toCreateGoalRequest } from '../data/mappers/createGoalMapper'
import { toActionPlan, toGoals } from '../data/mappers/actionPlanMapper'
import logger from '../../logger'
import { toUpdateGoalRequest } from '../data/mappers/updateGoalMapper'
import toArchiveGoalRequest from '../data/mappers/archiveGoalMapper'
import toUnarchiveGoalRequest from '../data/mappers/unarchiveGoalMapper'
import GoalStatusValue from '../enums/goalStatusValue'
import PrisonService from './prisonService'
import toEducationDto from '../data/mappers/educationMapper'
import toCreateEducationRequest from '../data/mappers/createEducationMapper'
import HmppsAuthClient from '../data/hmppsAuthClient'
import toUpdateEducationRequest from '../data/mappers/updateEducationMapper'
import toCreateActionPlanRequest from '../data/mappers/createActionPlanMapper'

export default class EducationAndWorkPlanService {
  constructor(
    private readonly educationAndWorkPlanClient: EducationAndWorkPlanClient,
    private readonly prisonService: PrisonService,
    private readonly hmppsAuthClient: HmppsAuthClient,
  ) {}

  async getActionPlan(prisonNumber: string, username: string): Promise<ActionPlan> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)
    try {
      const actionPlanResponse = await this.educationAndWorkPlanClient.getActionPlan(prisonNumber, systemToken)
      const prisonNamesById = await this.getAllPrisonNamesByIdSafely(systemToken)
      return toActionPlan(actionPlanResponse, false, prisonNamesById)
    } catch (error) {
      if (error.status === 404) {
        logger.debug(`No Action Plan exists yet for Prisoner [${prisonNumber}]`)
        return { prisonNumber, goals: [], problemRetrievingData: false }
      }
      logger.error(`Error retrieving Action Plan for Prisoner [${prisonNumber}]: ${error}`)
      return { prisonNumber, goals: [], problemRetrievingData: true }
    }
  }

  async createActionPlan(createActionPlanDto: CreateActionPlanDto, username: string): Promise<unknown> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)
    const createActionPlanRequest = toCreateActionPlanRequest(createActionPlanDto)
    return this.educationAndWorkPlanClient.createActionPlan(
      createActionPlanDto.prisonNumber,
      createActionPlanRequest,
      systemToken,
    )
  }

  async createGoals(prisonNumber: string, createGoalDtos: CreateGoalDto[], token: string): Promise<unknown> {
    const createGoalsRequest: CreateGoalsRequest = {
      goals: createGoalDtos.map(createGoalDto => toCreateGoalRequest(createGoalDto)),
    }
    return this.educationAndWorkPlanClient.createGoals(prisonNumber, createGoalsRequest, token)
  }

  async getGoalsByStatus(prisonNumber: string, status: GoalStatusValue, username: string): Promise<Goals> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)
    try {
      const response = await this.educationAndWorkPlanClient.getGoalsByStatus(prisonNumber, status, systemToken)
      const prisonNamesById = await this.getAllPrisonNamesByIdSafely(systemToken)
      return { goals: toGoals(response, prisonNamesById), problemRetrievingData: false }
    } catch (error) {
      if (error.status === 404) {
        logger.debug(`No plan created yet so no goals with [${status}] for Prisoner [${prisonNumber}]`)
        return { goals: [], problemRetrievingData: false }
      }
      logger.error(`Error retrieving goals with status [${status}] for Prisoner [${prisonNumber}]: ${error}`)
      return { goals: [], problemRetrievingData: true }
    }
  }

  async getAllGoalsForPrisoner(prisonNumber: string, username: string): Promise<PrisonerGoals> {
    const actionPlan = await this.getActionPlan(prisonNumber, username)
    return {
      prisonNumber,
      goals: {
        ACTIVE: actionPlan.goals ? actionPlan.goals.filter(goal => goal.status === GoalStatusValue.ACTIVE) : [],
        ARCHIVED: actionPlan.goals ? actionPlan.goals.filter(goal => goal.status === GoalStatusValue.ARCHIVED) : [],
        COMPLETED: actionPlan.goals ? actionPlan.goals.filter(goal => goal.status === GoalStatusValue.COMPLETED) : [],
      },
      problemRetrievingData: actionPlan.problemRetrievingData,
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

  async completeGoal(completeGoalDto: CompleteGoalDto, token: string): Promise<unknown> {
    const completeGoalRequest = toCompleteGoalRequest(completeGoalDto)
    return this.educationAndWorkPlanClient.completeGoal(completeGoalDto.prisonNumber, completeGoalRequest, token)
  }

  async getEducation(prisonNumber: string, username: string): Promise<EducationDto> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)
    try {
      const educationResponse = await this.educationAndWorkPlanClient.getEducation(prisonNumber, systemToken)
      return toEducationDto(educationResponse, prisonNumber)
    } catch (error) {
      logger.error(`Error retrieving Education for Prisoner [${prisonNumber}]: ${error}`)
      throw error
    }
  }

  async createEducation(
    prisonNumber: string,
    createEducationDto: CreateOrUpdateEducationDto,
    token: string,
  ): Promise<void> {
    try {
      const createEducationRequest = toCreateEducationRequest(createEducationDto)
      return await this.educationAndWorkPlanClient.createEducation(prisonNumber, createEducationRequest, token)
    } catch (error) {
      logger.error(`Error creating Education for prisoner [${prisonNumber}] in the Education And Work Plan API `, error)
      throw error
    }
  }

  async updateEducation(
    prisonNumber: string,
    updateEducationDto: CreateOrUpdateEducationDto,
    token: string,
  ): Promise<void> {
    try {
      const updateEducationRequest = toUpdateEducationRequest(updateEducationDto)
      return await this.educationAndWorkPlanClient.updateEducation(prisonNumber, updateEducationRequest, token)
    } catch (error) {
      logger.error(`Error updating Education for prisoner [${prisonNumber}] in the Education And Work Plan API `, error)
      throw error
    }
  }

  private async getAllPrisonNamesByIdSafely(token: string): Promise<Map<string, string>> {
    try {
      return await this.prisonService.getAllPrisonNamesById(token)
    } catch (error) {
      logger.error(`Error retrieving prison names, defaulting to just IDs: ${error}`)
      return new Map()
    }
  }
}
