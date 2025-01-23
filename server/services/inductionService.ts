import type { CreateOrUpdateInductionDto, InductionDto, InductionExemptionDto } from 'inductionDto'
import type { InductionSchedule } from 'viewModels'
import logger from '../../logger'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import toInductionDto from '../data/mappers/inductionDtoMapper'
import toUpdateInductionRequest from '../data/mappers/updateInductionMapper'
import toCreateInductionRequest from '../data/mappers/createInductionMapper'
import { HmppsAuthClient } from '../data'
import toInductionSchedule from '../data/mappers/inductionScheduleMapper'
import toUpdateInductionScheduleStatusRequest from '../data/mappers/updateInductionScheduleStatusRequestMapper'

export default class InductionService {
  constructor(
    private readonly educationAndWorkPlanClient: EducationAndWorkPlanClient,
    private readonly hmppsAuthClient: HmppsAuthClient,
  ) {}

  async getInduction(prisonNumber: string, username: string): Promise<InductionDto> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)
    const inductionResponse = await this.educationAndWorkPlanClient.getInduction(prisonNumber, systemToken)
    return toInductionDto(inductionResponse)
  }

  async updateInduction(
    prisonNumber: string,
    updateInductionDto: CreateOrUpdateInductionDto,
    username: string,
  ): Promise<never> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)
    try {
      const updateInductionRequest = toUpdateInductionRequest(updateInductionDto)
      return await this.educationAndWorkPlanClient.updateInduction(prisonNumber, updateInductionRequest, systemToken)
    } catch (error) {
      logger.error(`Error updating Induction for prisoner [${prisonNumber}] in the Education And Work Plan API `, error)
      throw error
    }
  }

  async createInduction(
    prisonNumber: string,
    createInductionDto: CreateOrUpdateInductionDto,
    username: string,
  ): Promise<void> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)
    try {
      const createInductionRequest = toCreateInductionRequest(createInductionDto)
      return await this.educationAndWorkPlanClient.createInduction(prisonNumber, createInductionRequest, systemToken)
    } catch (error) {
      logger.error(`Error creating Induction for prisoner [${prisonNumber}] in the Education And Work Plan API `, error)
      throw error
    }
  }

  async getInductionSchedule(prisonNumber: string, username: string): Promise<InductionSchedule> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)
    const inductionScheduleResponse = await this.educationAndWorkPlanClient.getInductionSchedule(
      prisonNumber,
      systemToken,
    )
    return toInductionSchedule(inductionScheduleResponse)
  }

  async updateInductionScheduleStatus(inductionExemptionDto: InductionExemptionDto, username: string): Promise<void> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    try {
      const updateInductionScheduleStatusRequest = toUpdateInductionScheduleStatusRequest(inductionExemptionDto)
      await this.educationAndWorkPlanClient.updateInductionScheduleStatus(
        inductionExemptionDto.prisonNumber,
        updateInductionScheduleStatusRequest,
        systemToken,
      )
    } catch (error) {
      logger.error(
        `Error updating Induction Schedule Status for prisoner [${inductionExemptionDto.prisonNumber}] in the Education And Work Plan API `,
        error,
      )
      throw error
    }
  }
}
