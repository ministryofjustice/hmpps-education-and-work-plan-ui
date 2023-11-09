import type { WorkAndInterests, EducationAndTraining } from 'viewModels'
import type { CiagInduction } from 'ciagInductionApiClient'
import CiagInductionClient from '../data/ciagInductionClient'
import logger from '../../logger'
import toWorkAndInterests from '../data/mappers/workAndInterestMapper'
import toEducationAndTraining from '../data/mappers/educationAndTrainingMapper'

export default class CiagInductionService {
  constructor(private readonly ciagInductionClient: CiagInductionClient) {}

  async getWorkAndInterests(prisonNumber: string, token: string): Promise<WorkAndInterests> {
    try {
      const ciagInduction = await this.getCiagInduction(prisonNumber, token)
      return toWorkAndInterests(ciagInduction)
    } catch (error) {
      return { problemRetrievingData: true } as WorkAndInterests
    }
  }

  async getEducationAndTraining(prisonNumber: string, token: string): Promise<EducationAndTraining> {
    try {
      const ciagInduction = await this.getCiagInduction(prisonNumber, token)
      return toEducationAndTraining(ciagInduction)
    } catch (error) {
      return { problemRetrievingData: true } as EducationAndTraining
    }
  }

  async ciagInductionExists(prisonNumber: string, token: string): Promise<boolean> {
    return (await this.getCiagInduction(prisonNumber, token)) !== undefined
  }

  private getCiagInduction = async (prisonNumber: string, token: string): Promise<CiagInduction> => {
    try {
      return await this.ciagInductionClient.getCiagInduction(prisonNumber, token)
    } catch (error) {
      if (error.status === 404) {
        logger.info(`No CIAG Induction found for prisoner [${prisonNumber}] in CIAG Induction API`)
        return undefined
      }

      logger.error(`Error retrieving data from CIAG Induction API: ${JSON.stringify(error)}`)
      throw error
    }
  }
}
