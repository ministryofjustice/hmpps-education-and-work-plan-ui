import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import type { AllAssessmentDTO, LearnerEducationPagedResponse, LearnerProfile } from 'curiousApiClient'
import { asSystem, RestClient } from '@ministryofjustice/hmpps-rest-client'
import restClientErrorHandler from './restClientErrorHandler'
import config from '../config'
import logger from '../../logger'

export default class CuriousClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('Curious API Client', config.apis.curious, logger, authenticationClient)
  }

  /**
   * @deprecated - this method calls a Curious 1 endpoint. Use a method that calls a suitable Curious 2 endpoint instead
   */
  async getLearnerProfile(prisonNumber: string): Promise<Array<LearnerProfile>> {
    return this.get<Array<LearnerProfile>>(
      {
        path: `/learnerProfile/${prisonNumber}`,
        errorHandler: restClientErrorHandler({ ignore404: true }),
      },
      asSystem('CURIOUS_API'),
    )
  }

  /**
   * @deprecated - this method calls a Curious 1 endpoint. Use a method that calls a suitable Curious 2 endpoint instead
   */
  async getLearnerEducationPage(prisonNumber: string, page = 0): Promise<LearnerEducationPagedResponse> {
    return this.get<LearnerEducationPagedResponse>(
      {
        path: `/learnerEducation/${prisonNumber}`,
        query: {
          page,
        },
        errorHandler: restClientErrorHandler({ ignore404: true }),
      },
      asSystem('CURIOUS_API'),
    )
  }

  /**
   * Calls the Curious V2 endpoint to get all assessments for a given prisoner
   * The returned data includes LDD and Functional Skills data as recorded in Curious 1, and all assessments (ALN,
   * Functional Skills (Maths, English and Digital Skills), ESOL and Reading) as recorded in Curious 2.
   *
   * @param prisonNumber
   * @return AllAssessmentDTO
   */
  async getAssessmentsByPrisonNumber(prisonNumber: string): Promise<AllAssessmentDTO> {
    return this.get<AllAssessmentDTO>(
      {
        path: `/learnerAssessments/v2/${prisonNumber}`,
        errorHandler: restClientErrorHandler({ ignore404: true }),
      },
      asSystem('CURIOUS_API'),
    )
  }
}
