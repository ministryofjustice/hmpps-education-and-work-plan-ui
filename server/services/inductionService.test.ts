import type { EducationAndTraining, WorkAndInterests } from 'viewModels'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import InductionService from './inductionService'
import { aLongQuestionSetInduction } from '../testsupport/inductionResponseTestDataBuilder'
import aValidLongQuestionSetWorkAndInterests from '../testsupport/workAndInterestsTestDataBuilder'
import toWorkAndInterests from '../data/mappers/workAndInterestMapper'
import toEducationAndTraining from '../data/mappers/educationAndTrainingMapper'
import { aValidLongQuestionSetEducationAndTraining } from '../testsupport/educationAndTrainingTestDataBuilder'

jest.mock('../data/mappers/workAndInterestMapper')
jest.mock('../data/mappers/educationAndTrainingMapper')

describe('inductionService', () => {
  const mockedWorkAndInterestsMapper = toWorkAndInterests as jest.MockedFunction<typeof toWorkAndInterests>
  const mockedEducationAndTrainingMapper = toEducationAndTraining as jest.MockedFunction<typeof toEducationAndTraining>

  const educationAndWorkPlanClient = {
    getInduction: jest.fn(),
  }

  const inductionService = new InductionService(educationAndWorkPlanClient as unknown as EducationAndWorkPlanClient)

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getWorkAndInterests', () => {
    it('should handle retrieval of work and interests given Education and Work Plan API returns an unexpected error for the Induction', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const userToken = 'a-user-token'

      const eductionAndWorkPlanApiError = {
        status: 500,
        data: {
          status: 500,
          userMessage: 'An unexpected error occurred',
          developerMessage: 'An unexpected error occurred',
        },
      }
      educationAndWorkPlanClient.getInduction.mockRejectedValue(eductionAndWorkPlanApiError)

      const expectedWorkAndInterests: WorkAndInterests = {
        problemRetrievingData: true,
        inductionQuestionSet: undefined,
        data: undefined,
      }

      // When
      const actual = await inductionService.getWorkAndInterests(prisonNumber, userToken).catch(error => {
        return error
      })

      // Then
      expect(actual).toEqual(expectedWorkAndInterests)
      expect(educationAndWorkPlanClient.getInduction).toHaveBeenCalledWith(prisonNumber, userToken)
    })

    it('should handle retrieval of work and interests given Education and Work Plan API returns Not Found for the Induction', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const userToken = 'a-user-token'

      const eductionAndWorkPlanApiError = {
        status: 404,
        data: {
          status: 404,
          userMessage: `Induction not found for prisoner [${prisonNumber}]`,
          developerMessage: `Induction not found for prisoner [${prisonNumber}]`,
        },
      }
      educationAndWorkPlanClient.getInduction.mockRejectedValue(eductionAndWorkPlanApiError)

      const expectedWorkAndInterests: WorkAndInterests = {
        problemRetrievingData: false,
        inductionQuestionSet: undefined,
        data: undefined,
      }
      mockedWorkAndInterestsMapper.mockReturnValue(expectedWorkAndInterests)

      // When
      const actual = await inductionService.getWorkAndInterests(prisonNumber, userToken)

      // Then
      expect(actual).toEqual(expectedWorkAndInterests)
      expect(educationAndWorkPlanClient.getInduction).toHaveBeenCalledWith(prisonNumber, userToken)
      expect(mockedWorkAndInterestsMapper).toHaveBeenCalledWith(undefined)
    })

    it('should retrieve work and interests given Education and Work Plan API returns an Induction', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const userToken = 'a-user-token'

      const induction = aLongQuestionSetInduction()
      educationAndWorkPlanClient.getInduction.mockResolvedValue(induction)

      const expectedWorkAndInterests = aValidLongQuestionSetWorkAndInterests()
      mockedWorkAndInterestsMapper.mockReturnValue(expectedWorkAndInterests)

      // When
      const actual = await inductionService.getWorkAndInterests(prisonNumber, userToken)

      // Then
      expect(actual).toEqual(expectedWorkAndInterests)
      expect(educationAndWorkPlanClient.getInduction).toHaveBeenCalledWith(prisonNumber, userToken)
      expect(mockedWorkAndInterestsMapper).toHaveBeenCalledWith(induction)
    })
  })

  describe('getEducationAndTraining', () => {
    it('should handle retrieval of Education and Training given Education and Work Plan API returns an unexpected error for the Induction', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const userToken = 'a-user-token'

      const eductionAndWorkPlanApiError = {
        status: 500,
        data: {
          status: 500,
          userMessage: 'An unexpected error occurred',
          developerMessage: 'An unexpected error occurred',
        },
      }
      educationAndWorkPlanClient.getInduction.mockRejectedValue(eductionAndWorkPlanApiError)

      const expectedEducationAndTraining: EducationAndTraining = {
        problemRetrievingData: true,
        inductionQuestionSet: undefined,
        data: undefined,
      }

      // When
      const actual = await inductionService.getEducationAndTraining(prisonNumber, userToken).catch(error => {
        return error
      })

      // Then
      expect(actual).toEqual(expectedEducationAndTraining)
      expect(educationAndWorkPlanClient.getInduction).toHaveBeenCalledWith(prisonNumber, userToken)
    })

    it('should handle retrieval of Education and Training given Education and Work Plan API returns Not Found for the Induction', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const userToken = 'a-user-token'

      const eductionAndWorkPlanApiError = {
        status: 404,
        data: {
          status: 404,
          userMessage: `Induction not found for prisoner [${prisonNumber}]`,
          developerMessage: `Induction not found for prisoner [${prisonNumber}]`,
        },
      }
      educationAndWorkPlanClient.getInduction.mockRejectedValue(eductionAndWorkPlanApiError)

      const expectedEducationAndTraining: EducationAndTraining = {
        problemRetrievingData: false,
        inductionQuestionSet: undefined,
        data: undefined,
      }
      mockedEducationAndTrainingMapper.mockReturnValue(expectedEducationAndTraining)

      // When
      const actual = await inductionService.getEducationAndTraining(prisonNumber, userToken)

      // Then
      expect(actual).toEqual(expectedEducationAndTraining)
      expect(educationAndWorkPlanClient.getInduction).toHaveBeenCalledWith(prisonNumber, userToken)
      expect(mockedEducationAndTrainingMapper).toHaveBeenCalledWith(undefined)
    })

    it('should retrieve Education and Training given Education and Work Plan API returns an Induction', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const userToken = 'a-user-token'

      const induction = aLongQuestionSetInduction()
      educationAndWorkPlanClient.getInduction.mockResolvedValue(induction)

      const expectedEducationAndTraining = aValidLongQuestionSetEducationAndTraining()
      mockedEducationAndTrainingMapper.mockReturnValue(expectedEducationAndTraining)

      // When
      const actual = await inductionService.getEducationAndTraining(prisonNumber, userToken)

      // Then
      expect(actual).toEqual(expectedEducationAndTraining)
      expect(educationAndWorkPlanClient.getInduction).toHaveBeenCalledWith(prisonNumber, userToken)
      expect(mockedEducationAndTrainingMapper).toHaveBeenCalledWith(induction)
    })
  })

  describe('inductionExists', () => {
    it('should determine if Induction exists given Education and Work Plan API returns an Induction', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const userToken = 'a-user-token'

      educationAndWorkPlanClient.getInduction.mockResolvedValue(aLongQuestionSetInduction())

      const expected = true

      // When
      const actual = await inductionService.inductionExists(prisonNumber, userToken)

      // Then
      expect(actual).toEqual(expected)
      expect(educationAndWorkPlanClient.getInduction).toHaveBeenCalledWith(prisonNumber, userToken)
    })

    it('should determine if Induction exists given Education and Work Plan API returns Not Found', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const userToken = 'a-user-token'

      const eductionAndWorkPlanApiError = {
        status: 404,
        data: {
          status: 404,
          userMessage: `Induction not found for prisoner [${prisonNumber}]`,
          developerMessage: `Induction not found for prisoner [${prisonNumber}]`,
        },
      }
      educationAndWorkPlanClient.getInduction.mockRejectedValue(eductionAndWorkPlanApiError)

      const expected = false

      // When
      const actual = await inductionService.inductionExists(prisonNumber, userToken)

      // Then
      expect(actual).toEqual(expected)
      expect(educationAndWorkPlanClient.getInduction).toHaveBeenCalledWith(prisonNumber, userToken)
    })

    it('should rethrow error given Education and Work Plan API returns an unexpected error', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const userToken = 'a-user-token'

      const eductionAndWorkPlanApiError = {
        status: 500,
        data: {
          status: 500,
          userMessage: 'An unexpected error occurred',
          developerMessage: 'An unexpected error occurred',
        },
      }
      educationAndWorkPlanClient.getInduction.mockRejectedValue(eductionAndWorkPlanApiError)

      // When
      const actual = await inductionService.inductionExists(prisonNumber, userToken).catch(error => {
        return error
      })

      // Then
      expect(actual).toEqual(eductionAndWorkPlanApiError)
      expect(educationAndWorkPlanClient.getInduction).toHaveBeenCalledWith(prisonNumber, userToken)
    })
  })
})
