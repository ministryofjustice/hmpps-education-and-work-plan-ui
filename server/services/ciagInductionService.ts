import type { WorkAndInterests, OtherQualifications } from 'viewModels'
import type { CiagInduction } from 'ciagInductionApiClient'
import { HmppsAuthClient } from '../data'
import CiagInductionClient from '../data/ciagInductionClient'
import logger from '../../logger'
import toWorkAndInterests from '../data/mappers/workAndInterestMapper'
import toOtherQualifications from '../data/mappers/otherQualificationsMapper'

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

  async getOtherQualifications(prisonNumber: string, username: string): Promise<OtherQualifications> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    try {
      const ciagInduction = await this.getCiagInduction(prisonNumber, systemToken)
      return toOtherQualifications(ciagInduction)
    } catch (error) {
      logger.error(`Error retrieving data from CIAG Induction API: ${JSON.stringify(error)}`)
      return { problemRetrievingData: true } as OtherQualifications
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
