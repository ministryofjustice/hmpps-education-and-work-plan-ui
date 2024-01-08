import type { EducationAndTraining, WorkAndInterests } from 'viewModels'
import CiagInductionClient from '../data/ciagInductionClient'
import CiagInductionService from './ciagInductionService'
import { aLongQuestionSetCiagInduction } from '../testsupport/ciagInductionTestDataBuilder'
import aValidLongQuestionSetWorkAndInterests from '../testsupport/workAndInterestsTestDataBuilder'
import { toWorkAndInterests, toEducationAndTraining } from '../data/mappers/ciagInductionResponseMappers'
import { aValidLongQuestionSetEducationAndTraining } from '../testsupport/educationAndTrainingTestDataBuilder'

jest.mock('../data/mappers/ciagInductionResponseMappers')

describe('ciagInductionService', () => {
  const mockedWorkAndInterestsMapper = toWorkAndInterests as jest.MockedFunction<typeof toWorkAndInterests>
  const mockedEducationAndTrainingMapper = toEducationAndTraining as jest.MockedFunction<typeof toEducationAndTraining>

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
      mockedWorkAndInterestsMapper.mockReturnValue(expectedWorkAndInterests)

      // When
      const actual = await ciagInductionService.getWorkAndInterests(prisonNumber, userToken)

      // Then
      expect(actual).toEqual(expectedWorkAndInterests)
      expect(ciagClient.getCiagInduction).toHaveBeenCalledWith(prisonNumber, userToken)
      expect(mockedWorkAndInterestsMapper).toHaveBeenCalledWith(undefined)
    })

    it('should retrieve work and interests given CIAG Induction API returns a CIAG Induction', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const userToken = 'a-user-token'

      const ciagInduction = aLongQuestionSetCiagInduction()
      ciagClient.getCiagInduction.mockResolvedValue(ciagInduction)

      const expectedWorkAndInterests = aValidLongQuestionSetWorkAndInterests()
      mockedWorkAndInterestsMapper.mockReturnValue(expectedWorkAndInterests)

      // When
      const actual = await ciagInductionService.getWorkAndInterests(prisonNumber, userToken)

      // Then
      expect(actual).toEqual(expectedWorkAndInterests)
      expect(ciagClient.getCiagInduction).toHaveBeenCalledWith(prisonNumber, userToken)
      expect(mockedWorkAndInterestsMapper).toHaveBeenCalledWith(ciagInduction)
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
      mockedEducationAndTrainingMapper.mockReturnValue(expectedEducationAndTraining)

      // When
      const actual = await ciagInductionService.getEducationAndTraining(prisonNumber, userToken)

      // Then
      expect(actual).toEqual(expectedEducationAndTraining)
      expect(ciagClient.getCiagInduction).toHaveBeenCalledWith(prisonNumber, userToken)
      expect(mockedEducationAndTrainingMapper).toHaveBeenCalledWith(undefined)
    })

    it('should retrieve Education and Training given CIAG Induction API returns a CIAG Induction', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const userToken = 'a-user-token'

      const ciagInduction = aLongQuestionSetCiagInduction()
      ciagClient.getCiagInduction.mockResolvedValue(ciagInduction)

      const expectedEducationAndTraining = aValidLongQuestionSetEducationAndTraining()
      mockedEducationAndTrainingMapper.mockReturnValue(expectedEducationAndTraining)

      // When
      const actual = await ciagInductionService.getEducationAndTraining(prisonNumber, userToken)

      // Then
      expect(actual).toEqual(expectedEducationAndTraining)
      expect(ciagClient.getCiagInduction).toHaveBeenCalledWith(prisonNumber, userToken)
      expect(mockedEducationAndTrainingMapper).toHaveBeenCalledWith(ciagInduction)
    })
  })

  describe('ciagInductionExists', () => {
    it('should determine if CIAG Induction exists given CIAG Induction API returns an induction response', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const userToken = 'a-user-token'

      ciagClient.getCiagInduction.mockResolvedValue(aLongQuestionSetCiagInduction())

      const expected = true

      // When
      const actual = await ciagInductionService.ciagInductionExists(prisonNumber, userToken)

      // Then
      expect(actual).toEqual(expected)
      expect(ciagClient.getCiagInduction).toHaveBeenCalledWith(prisonNumber, userToken)
    })

    it('should determine if CIAG Induction exists given CIAG Induction API returns Not Found', async () => {
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

      const expected = false

      // When
      const actual = await ciagInductionService.ciagInductionExists(prisonNumber, userToken)

      // Then
      expect(actual).toEqual(expected)
      expect(ciagClient.getCiagInduction).toHaveBeenCalledWith(prisonNumber, userToken)
    })

    it('should rethrow error given CIAG Induction API returns an unexpected error', async () => {
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

      // When
      const actual = await ciagInductionService.ciagInductionExists(prisonNumber, userToken).catch(error => {
        return error
      })

      // Then
      expect(actual).toEqual(ciagInductionApiError)
      expect(ciagClient.getCiagInduction).toHaveBeenCalledWith(prisonNumber, userToken)
    })
  })
})
