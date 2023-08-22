import type { WorkAndInterests, PrePrisonQualifications } from 'viewModels'
import type { CiagInduction } from 'ciagInductionApiClient'
import { HmppsAuthClient } from '../data'
import CiagInductionClient from '../data/ciagInductionClient'
import logger from '../../logger'
import toWorkAndInterests from '../data/mappers/workAndInterestMapper'
import toPrePrisonQualifications from '../data/mappers/prePrisonQualificationsMapper'

export default class CiagInductionService {
  constructor(
    private readonly hmppsAuthClient: HmppsAuthClient,
    private readonly ciagInductionClient: CiagInductionClient,
  ) {}

  async getWorkAndInterests(prisonNumber: string, username: string): Promise<WorkAndInterests> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    try {
      const ciagInduction = await this.getCiagInduction(prisonNumber, systemToken)
      return toWorkAndInterests(ciagInduction)
    } catch (error) {
      logger.error(`Error retrieving data from CIAG Induction API: ${JSON.stringify(error)}`)
      return { problemRetrievingData: true } as WorkAndInterests
    }
  }

  async getPrePrisonQualifications(prisonNumber: string, username: string): Promise<PrePrisonQualifications> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    try {
      const ciagInduction = await this.getCiagInduction(prisonNumber, systemToken)
      return toPrePrisonQualifications(ciagInduction)
    } catch (error) {
      logger.error(`Error retrieving data from CIAG Induction API: ${JSON.stringify(error)}`)
      return { problemRetrievingData: true } as PrePrisonQualifications
    }
  }

  private getCiagInduction = async (prisonNumber: string, token: string): Promise<CiagInduction> => {
    try {
      return await this.ciagInductionClient.getCiagInduction(prisonNumber, token)
    } catch (error) {
      if (error.status === 404) {
        logger.info(`No CIAG Induction found for prisoner [${prisonNumber}] in CIAG Induction API`)
        return undefined
      }
      throw error
    }
  }
}
