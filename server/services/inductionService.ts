import type { CreateOrUpdateInductionDto, InductionDto } from 'inductionDto'
import logger from '../../logger'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import toInductionDto from '../data/mappers/inductionDtoMapper'
import toUpdateInductionRequest from '../data/mappers/updateInductionMapper'
import toCreateInductionRequest from '../data/mappers/createInductionMapper'
import { HmppsAuthClient } from '../data'

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
      logger.error(`Error retrieving Induction for prisoner [${prisonNumber}] from Education And Work Plan API `, error)
      throw error
    }
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
  ): Promise<never> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)
    try {
      const createInductionRequest = toCreateInductionRequest(createInductionDto)
      return await this.educationAndWorkPlanClient.createInduction(prisonNumber, createInductionRequest, systemToken)
    } catch (error) {
      logger.error(`Error creating Induction for prisoner [${prisonNumber}] in the Education And Work Plan API `, error)
      throw error
    }
  }

  async inductionExists(prisonNumber: string, username: string): Promise<boolean> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)
    try {
      await this.educationAndWorkPlanClient.getInduction(prisonNumber, systemToken)
      return true
    } catch (error) {
      if (isNotFoundError(error)) {
        logger.info(`No Induction found for prisoner [${prisonNumber}] in Education And Work Plan API`)
        return false
      }

      logger.error(`Error retrieving Induction data from Education And Work Plan: ${JSON.stringify(error)}`)
      throw error
    }
  }
}

const isNotFoundError = (error: { status: number }): boolean => error.status === 404
