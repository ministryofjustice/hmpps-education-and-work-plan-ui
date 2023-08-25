import type { OtherQualifications, WorkAndInterests } from 'viewModels'
import { HmppsAuthClient } from '../data'
import CiagInductionClient from '../data/ciagInductionClient'
import CiagInductionService from './ciagInductionService'

describe('ciagInductionService', () => {
  const hmppsAuthClient = {
    getSystemClientToken: jest.fn(),
  }
  const ciagClient = {
    getCiagInduction: jest.fn(),
  }

  const ciagInductionService = new CiagInductionService(
    hmppsAuthClient as unknown as HmppsAuthClient,
    ciagClient as unknown as CiagInductionClient,
  )

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

      const expectedWorkAndInterests = {
        problemRetrievingData: true,
        data: undefined,
      } as WorkAndInterests

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

      const expectedWorkAndInterests = {
        problemRetrievingData: false,
        data: undefined,
      } as WorkAndInterests

      // When
      const actual = await ciagInductionService.getWorkAndInterests(prisonNumber, userToken).catch(error => {
        return error
      })

      // Then
      expect(actual).toEqual(expectedWorkAndInterests)
      expect(ciagClient.getCiagInduction).toHaveBeenCalledWith(prisonNumber, userToken)
    })
  })

  describe('getOtherQualifications', () => {
    it('should handle retrieval of other qualifications given CIAG Induction API returns an unexpected error for the CIAG Induction', async () => {
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

      const expectedOtherData = {
        problemRetrievingData: true,
        highestEducationLevel: undefined,
        additionalTraining: undefined,
      } as OtherQualifications

      // When
      const actual = await ciagInductionService.getOtherQualifications(prisonNumber, userToken).catch(error => {
        return error
      })

      // Then
      expect(actual).toEqual(expectedOtherData)
      expect(ciagClient.getCiagInduction).toHaveBeenCalledWith(prisonNumber, userToken)
    })

    it('should handle retrieval of other qualifications given CIAG Induction API returns Not Found for the CIAG Induction', async () => {
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

      const expectedOtherData = {
        problemRetrievingData: false,
        highestEducationLevel: undefined,
        additionalTraining: undefined,
      } as OtherQualifications

      // When
      const actual = await ciagInductionService.getOtherQualifications(prisonNumber, userToken).catch(error => {
        return error
      })

      // Then
      expect(actual).toEqual(expectedOtherData)
      expect(ciagClient.getCiagInduction).toHaveBeenCalledWith(prisonNumber, userToken)
    })
  })
})
