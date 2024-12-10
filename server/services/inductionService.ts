import type { CreateOrUpdateInductionDto, InductionDto } from 'inductionDto'
import type { InductionSchedule } from 'viewModels'
import logger from '../../logger'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import toInductionDto from '../data/mappers/inductionDtoMapper'
import toUpdateInductionRequest from '../data/mappers/updateInductionMapper'
import toCreateInductionRequest from '../data/mappers/createInductionMapper'
import { HmppsAuthClient } from '../data'
import toInductionSchedule from '../data/mappers/inductionScheduleMapper'

export default class InductionService {
  constructor(
    private readonly educationAndWorkPlanClient: EducationAndWorkPlanClient,
    private readonly hmppsAuthClient: HmppsAuthClient,
  ) {}

  async getInduction(prisonNumber: string, username: string): Promise<InductionDto> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)
    try {
      const inductionResponse = await this.educationAndWorkPlanClient.getInduction(prisonNumber, systemToken)
      return toInductionDto(inductionResponse)
    } catch (error) {
      if (error.status === 404) {
        logger.debug(`No Induction for prisoner [${prisonNumber}] in Education And Work Plan API`)
        return undefined
      }

      logger.error(`Error retrieving Induction for prisoner [${prisonNumber}] from Education And Work Plan API `, error)
      throw error
    }
  }

  async updateInduction(
    prisonNumber: string,
    updateInductionDto: CreateOrUpdateInductionDto,
    token: string,
  ): Promise<never> {
    try {
      const updateInductionRequest = toUpdateInductionRequest(updateInductionDto)
      return await this.educationAndWorkPlanClient.updateInduction(prisonNumber, updateInductionRequest, token)
    } catch (error) {
      logger.error(`Error updating Induction for prisoner [${prisonNumber}] in the Education And Work Plan API `, error)
      throw error
    }
  }

  async createInduction(
    prisonNumber: string,
    createInductionDto: CreateOrUpdateInductionDto,
    token: string,
  ): Promise<void> {
    try {
      const createInductionRequest = toCreateInductionRequest(createInductionDto)
      return await this.educationAndWorkPlanClient.createInduction(prisonNumber, createInductionRequest, token)
    } catch (error) {
      logger.error(`Error creating Induction for prisoner [${prisonNumber}] in the Education And Work Plan API `, error)
      throw error
    }
  }

  async getInductionSchedule(prisonNumber: string, username: string): Promise<InductionSchedule> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)
    try {
      const inductionScheduleResponse = await this.educationAndWorkPlanClient.getInductionSchedule(
        prisonNumber,
        systemToken,
      )
      return toInductionSchedule(inductionScheduleResponse)
    } catch (error) {
      logger.error(
        `Error retrieving Induction Schedule for prisoner [${prisonNumber}] from Education And Work Plan API `,
        error,
      )
      return { problemRetrievingData: true } as InductionSchedule
    }
  }
}
