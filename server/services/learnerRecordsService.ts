import type { VerifiedQualifications } from 'viewModels'
import { LearnerRecordsApiClient } from '../data'
import toVerifiedQualifications from '../data/mappers/verifiedQualificationsMapper'
import logger from '../../logger'

export default class LearnerRecordsService {
  constructor(private readonly learnerRecordsApiClient: LearnerRecordsApiClient) {}

  async getVerifiedQualifications(username: string, prisonNumber: string): Promise<VerifiedQualifications> {
    try {
      const learnerRecordsResponse = await this.learnerRecordsApiClient.getLearnerEvents(prisonNumber, username)
      return toVerifiedQualifications(prisonNumber, learnerRecordsResponse)
    } catch (e) {
      logger.error(`Error getting Verified Qualifications for [${prisonNumber}]`, e)
      throw e
    }
  }
}
