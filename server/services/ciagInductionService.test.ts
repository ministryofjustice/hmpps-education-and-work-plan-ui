import type { EducationAndTraining, WorkAndInterests } from 'viewModels'
import CiagInductionClient from '../data/ciagInductionClient'
import CiagInductionService from './ciagInductionService'

describe('ciagInductionService', () => {
  const ciagClient = {
    getCiagInduction: jest.fn(),
  }

  const ciagInductionService = new CiagInductionService(ciagClient as unknown as CiagInductionClient)

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getWorkAndInterests', () => {
    it('should handle retrieval of work and interests given CIAG Induction API returns an unexpected error for the CIAG Induction', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const userToken = 'a-user-token'

      const ciagInductionApiError = {
        status: 500,
        data: {
          status: 500,
          userMessage: 'An unexpected error occurred',
          developerMessage: 'An unexpected error occurred',
        },
      }
      ciagClient.getCiagInduction.mockRejectedValue(ciagInductionApiError)

      const expectedWorkAndInterests: WorkAndInterests = {
        problemRetrievingData: true,
        inductionQuestionSet: undefined,
        data: undefined,
      }

      // When
      const actual = await ciagInductionService.getWorkAndInterests(prisonNumber, userToken).catch(error => {
        return error
      })

      // Then
      expect(actual).toEqual(expectedWorkAndInterests)
      expect(ciagClient.getCiagInduction).toHaveBeenCalledWith(prisonNumber, userToken)
    })

    it('should handle retrieval of work and interests given CIAG Induction API returns Not Found for the CIAG Induction', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const userToken = 'a-user-token'

      const ciagInductionApiError = {
        status: 404,
        data: {
          status: 404,
          userMessage: `CIAG profile does not exist for offender ${prisonNumber}`,
          developerMessage: `CIAG profile does not exist for offender ${prisonNumber}`,
        },
      }
      ciagClient.getCiagInduction.mockRejectedValue(ciagInductionApiError)

      const expectedWorkAndInterests: WorkAndInterests = {
        problemRetrievingData: false,
        inductionQuestionSet: undefined,
        data: undefined,
      }

      // When
      const actual = await ciagInductionService.getWorkAndInterests(prisonNumber, userToken).catch(error => {
        return error
      })

      // Then
      expect(actual).toEqual(expectedWorkAndInterests)
      expect(ciagClient.getCiagInduction).toHaveBeenCalledWith(prisonNumber, userToken)
    })
  })

  describe('getEducationAndTraining', () => {
    it('should handle retrieval of Education and Training given CIAG Induction API returns an unexpected error for the CIAG Induction', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const userToken = 'a-user-token'

      const ciagInductionApiError = {
        status: 500,
        data: {
          status: 500,
          userMessage: 'An unexpected error occurred',
          developerMessage: 'An unexpected error occurred',
        },
      }
      ciagClient.getCiagInduction.mockRejectedValue(ciagInductionApiError)

      const expectedEducationAndTraining: EducationAndTraining = {
        problemRetrievingData: true,
        inductionQuestionSet: undefined,
        data: undefined,
      }

      // When
      const actual = await ciagInductionService.getEducationAndTraining(prisonNumber, userToken).catch(error => {
        return error
      })

      // Then
      expect(actual).toEqual(expectedEducationAndTraining)
      expect(ciagClient.getCiagInduction).toHaveBeenCalledWith(prisonNumber, userToken)
    })

    it('should handle retrieval of Education and Training given CIAG Induction API returns Not Found for the CIAG Induction', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const userToken = 'a-user-token'

      const ciagInductionApiError = {
        status: 404,
        data: {
          status: 404,
          userMessage: `CIAG profile does not exist for offender ${prisonNumber}`,
          developerMessage: `CIAG profile does not exist for offender ${prisonNumber}`,
        },
      }
      ciagClient.getCiagInduction.mockRejectedValue(ciagInductionApiError)

      const expectedEducationAndTraining: EducationAndTraining = {
        problemRetrievingData: false,
        inductionQuestionSet: undefined,
        data: undefined,
      }

      // When
      const actual = await ciagInductionService.getEducationAndTraining(prisonNumber, userToken).catch(error => {
        return error
      })

      // Then
      expect(actual).toEqual(expectedEducationAndTraining)
      expect(ciagClient.getCiagInduction).toHaveBeenCalledWith(prisonNumber, userToken)
    })
  })
})
