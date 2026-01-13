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
import toUpdateEducationRequest from '../data/mappers/updateEducationMapper'
import toCreateActionPlanRequest from '../data/mappers/createActionPlanMapper'

export default class EducationAndWorkPlanService {
  constructor(
    private readonly educationAndWorkPlanClient: EducationAndWorkPlanClient,
    private readonly prisonService: PrisonService,
  ) {}

  async getActionPlan(prisonNumber: string, username: string): Promise<ActionPlan> {
    try {
      const actionPlanResponse = await this.educationAndWorkPlanClient.getActionPlan(prisonNumber, username)

      if (!actionPlanResponse) {
        logger.debug(`No Action Plan exists yet for Prisoner [${prisonNumber}]`)
        return { prisonNumber, goals: [], problemRetrievingData: false }
      }

      const prisonNamesById = await this.prisonService.getAllPrisonNamesById(username)
      return toActionPlan(actionPlanResponse, false, prisonNamesById)
    } catch (error) {
      logger.error(`Error retrieving Action Plan for Prisoner [${prisonNumber}]`, error)
      return { prisonNumber, goals: [], problemRetrievingData: true }
    }
  }

  async createActionPlan(createActionPlanDto: CreateActionPlanDto, username: string): Promise<unknown> {
    const createActionPlanRequest = toCreateActionPlanRequest(createActionPlanDto)
    return this.educationAndWorkPlanClient.createActionPlan(
      createActionPlanDto.prisonNumber,
      createActionPlanRequest,
      username,
    )
  }

  async createGoals(prisonNumber: string, createGoalDtos: CreateGoalDto[], username: string): Promise<unknown> {
    const createGoalsRequest: CreateGoalsRequest = {
      goals: createGoalDtos.map(createGoalDto => toCreateGoalRequest(createGoalDto)),
    }
    return this.educationAndWorkPlanClient.createGoals(prisonNumber, createGoalsRequest, username)
  }

  async getGoalsByStatus(prisonNumber: string, status: GoalStatusValue, username: string): Promise<Goals> {
    try {
      const response = (await this.educationAndWorkPlanClient.getGoalsByStatus(prisonNumber, status, username)) || {
        goals: [],
      }
      const prisonNamesById = await this.prisonService.getAllPrisonNamesById(username)
      return { goals: toGoals(response, prisonNamesById), problemRetrievingData: false }
    } catch (error) {
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

  async updateGoal(prisonNumber: string, updateGoalDto: UpdateGoalDto, username: string): Promise<unknown> {
    const updateGoalRequest = toUpdateGoalRequest(updateGoalDto)
    return this.educationAndWorkPlanClient.updateGoal(prisonNumber, updateGoalRequest, username)
  }

  async archiveGoal(archiveGoalDto: ArchiveGoalDto, username: string): Promise<unknown> {
    const archiveGoalRequest = toArchiveGoalRequest(archiveGoalDto)
    return this.educationAndWorkPlanClient.archiveGoal(archiveGoalDto.prisonNumber, archiveGoalRequest, username)
  }

  async unarchiveGoal(unarchiveGoalDto: UnarchiveGoalDto, username: string): Promise<unknown> {
    const unarchiveGoalRequest = toUnarchiveGoalRequest(unarchiveGoalDto)
    return this.educationAndWorkPlanClient.unarchiveGoal(unarchiveGoalDto.prisonNumber, unarchiveGoalRequest, username)
  }

  async completeGoal(completeGoalDto: CompleteGoalDto, username: string): Promise<unknown> {
    const completeGoalRequest = toCompleteGoalRequest(completeGoalDto)
    return this.educationAndWorkPlanClient.completeGoal(completeGoalDto.prisonNumber, completeGoalRequest, username)
  }

  async getEducation(prisonNumber: string, username: string): Promise<EducationDto> {
    const educationResponse = await this.educationAndWorkPlanClient.getEducation(prisonNumber, username)
    return educationResponse ? toEducationDto(educationResponse, prisonNumber) : null
  }

  async createEducation(
    prisonNumber: string,
    createEducationDto: CreateOrUpdateEducationDto,
    username: string,
  ): Promise<void> {
    try {
      const createEducationRequest = toCreateEducationRequest(createEducationDto)
      return await this.educationAndWorkPlanClient.createEducation(prisonNumber, createEducationRequest, username)
    } catch (error) {
      logger.error(`Error creating Education for prisoner [${prisonNumber}] in the Education And Work Plan API `, error)
      throw error
    }
  }

  async updateEducation(
    prisonNumber: string,
    updateEducationDto: CreateOrUpdateEducationDto,
    username: string,
  ): Promise<void> {
    try {
      const updateEducationRequest = toUpdateEducationRequest(updateEducationDto)
      return await this.educationAndWorkPlanClient.updateEducation(prisonNumber, updateEducationRequest, username)
    } catch (error) {
      logger.error(`Error updating Education for prisoner [${prisonNumber}] in the Education And Work Plan API `, error)
      throw error
    }
  }
}
