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
      const induction = await this.educationAndWorkPlanClient.getInduction(prisonNumber, token)
      return toWorkAndInterests(induction)
    } catch (error) {
      return gracefullyHandleException(error, prisonNumber) as WorkAndInterests
    }
  }

  async getEducationAndTraining(prisonNumber: string, token: string): Promise<EducationAndTraining> {
    try {
      const induction = await this.educationAndWorkPlanClient.getInduction(prisonNumber, token)
      return toEducationAndTraining(induction)
    } catch (error) {
      return gracefullyHandleException(error, prisonNumber) as EducationAndTraining
    }
  }

  async getInduction(prisonNumber: string, token: string): Promise<InductionDto> {
    try {
      const inductionResponse = await this.educationAndWorkPlanClient.getInduction(prisonNumber, token)
      return toInductionDto(inductionResponse)
    } catch (error) {
      logger.error('Error retrieving Induction data from Education And Work Plan API', error)
      throw error
    }
  }

  async inductionExists(prisonNumber: string, token: string): Promise<boolean> {
    try {
      await this.educationAndWorkPlanClient.getInduction(prisonNumber, token)
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

/**
 * Gracefully handle an exception thrown from the educationAndWorkPlanClient by returning an object of
 *   * { problemRetrievingData: false } if it was a 404 error (there was no problem retrieving data; it's just the data didn't exist)
 *   * { problemRetrievingData: true } if it was any other status code, indicating a more serious error and problem retrieving the data from the API
 */
const gracefullyHandleException = (
  error: { status: number },
  prisonNumber: string,
): { problemRetrievingData: boolean } => {
  if (isNotFoundError(error)) {
    logger.info(`No Induction found for prisoner [${prisonNumber}] in Education And Work Plan API`)
    return { problemRetrievingData: false }
  }

  logger.error(`Error retrieving Induction data from Education And Work Plan: ${JSON.stringify(error)}`)
  return { problemRetrievingData: true }
}

const isNotFoundError = (error: { status: number }): boolean => error.status === 404
