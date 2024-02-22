import type { InductionResponse } from 'educationAndWorkPlanApiClient'
import type { WorkAndInterests, EducationAndTraining } from 'viewModels'
import type { InductionDto } from 'inductionDto'
import logger from '../../logger'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import toWorkAndInterests from '../data/mappers/workAndInterestMapper'
import toEducationAndTraining from '../data/mappers/educationAndTrainingMapper'
import toInductionDto from '../data/mappers/inductionDtoMapper'

export default class InductionService {
  constructor(private readonly educationAndWorkPlanClient: EducationAndWorkPlanClient) {}

  async getWorkAndInterests(prisonNumber: string, token: string): Promise<WorkAndInterests> {
    try {
      const induction = await this.retrieveInduction(prisonNumber, token)
      return toWorkAndInterests(induction)
    } catch (error) {
      return { problemRetrievingData: true } as WorkAndInterests
    }
  }

  async getEducationAndTraining(prisonNumber: string, token: string): Promise<EducationAndTraining> {
    try {
      const induction = await this.retrieveInduction(prisonNumber, token)
      return toEducationAndTraining(induction)
    } catch (error) {
      return { problemRetrievingData: true } as EducationAndTraining
    }
  }

  async getInduction(prisonNumber: string, token: string): Promise<InductionDto> {
    try {
      const inductionResponse = await this.retrieveInduction(prisonNumber, token)
      return toInductionDto(inductionResponse)
    } catch (error) {
      logger.error('Error retrieving Induction data from Education And Work Plan API', error)
      throw error
    }
  }

  async inductionExists(prisonNumber: string, token: string): Promise<boolean> {
    return (await this.retrieveInduction(prisonNumber, token)) !== undefined
  }

  private retrieveInduction = async (prisonNumber: string, token: string): Promise<InductionResponse> => {
    try {
      return await this.educationAndWorkPlanClient.getInduction(prisonNumber, token)
    } catch (error) {
      if (error.status === 404) {
        logger.info(`No Induction found for prisoner [${prisonNumber}] in Education And Work Plan API`)
        return undefined
      }

      logger.error(`Error retrieving Induction data from Education And Work Plan: ${JSON.stringify(error)}`)
      throw error
    }
  }
}
