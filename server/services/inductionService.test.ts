import type { EducationAndTraining, WorkAndInterests } from 'viewModels'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import InductionService from './inductionService'
import { aLongQuestionSetInduction } from '../testsupport/inductionResponseTestDataBuilder'
import aValidLongQuestionSetWorkAndInterests from '../testsupport/workAndInterestsTestDataBuilder'
import { aValidLongQuestionSetEducationAndTraining } from '../testsupport/educationAndTrainingTestDataBuilder'
import { aLongQuestionSetInductionDto } from '../testsupport/inductionDtoTestDataBuilder'
import { aLongQuestionSetUpdateInductionRequest } from '../testsupport/updateInductionRequestTestDataBuilder'
import toWorkAndInterests from '../data/mappers/workAndInterestMapper'
import toEducationAndTraining from '../data/mappers/educationAndTrainingMapper'
import toInductionDto from '../data/mappers/inductionDtoMapper'
import toUpdateInductionRequest from '../data/mappers/updateInductionMapper'
import { aLongQuestionSetUpdateInductionDto } from '../testsupport/updateInductionDtoTestDataBuilder'

jest.mock('../data/mappers/workAndInterestMapper')
jest.mock('../data/mappers/educationAndTrainingMapper')
jest.mock('../data/mappers/inductionDtoMapper')
jest.mock('../data/mappers/updateInductionMapper')

describe('inductionService', () => {
  const mockedWorkAndInterestsMapper = toWorkAndInterests as jest.MockedFunction<typeof toWorkAndInterests>
  const mockedEducationAndTrainingMapper = toEducationAndTraining as jest.MockedFunction<typeof toEducationAndTraining>
  const mockedInductionDtoMapper = toInductionDto as jest.MockedFunction<typeof toInductionDto>
  const mockedUpdateInductionMapper = toUpdateInductionRequest as jest.MockedFunction<typeof toUpdateInductionRequest>

  const educationAndWorkPlanClient = {
    getInduction: jest.fn(),
    updateInduction: jest.fn(),
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
      const actual = await inductionService.getWorkAndInterests(prisonNumber, userToken)

      // Then
      expect(actual).toEqual(expectedWorkAndInterests)
      expect(educationAndWorkPlanClient.getInduction).toHaveBeenCalledWith(prisonNumber, userToken)
      expect(mockedEducationAndTrainingMapper).not.toHaveBeenCalled()
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

      // When
      const actual = await inductionService.getWorkAndInterests(prisonNumber, userToken)

      // Then
      expect(actual).toEqual(expectedWorkAndInterests)
      expect(educationAndWorkPlanClient.getInduction).toHaveBeenCalledWith(prisonNumber, userToken)
      expect(mockedEducationAndTrainingMapper).not.toHaveBeenCalled()
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
      const actual = await inductionService.getEducationAndTraining(prisonNumber, userToken)

      // Then
      expect(actual).toEqual(expectedEducationAndTraining)
      expect(educationAndWorkPlanClient.getInduction).toHaveBeenCalledWith(prisonNumber, userToken)
      expect(mockedEducationAndTrainingMapper).not.toHaveBeenCalled()
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

      // When
      const actual = await inductionService.getEducationAndTraining(prisonNumber, userToken)

      // Then
      expect(actual).toEqual(expectedEducationAndTraining)
      expect(educationAndWorkPlanClient.getInduction).toHaveBeenCalledWith(prisonNumber, userToken)
      expect(mockedEducationAndTrainingMapper).not.toHaveBeenCalled()
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

  describe('getInduction', () => {
    it('should get Induction given Education and Work Plan API returns an Induction', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const userToken = 'a-user-token'

      const inductionResponse = aLongQuestionSetInduction()
      educationAndWorkPlanClient.getInduction.mockResolvedValue(inductionResponse)
      const expectedInductionDto = aLongQuestionSetInductionDto()
      mockedInductionDtoMapper.mockReturnValue(expectedInductionDto)

      // When
      const actual = await inductionService.getInduction(prisonNumber, userToken)

      // Then
      expect(actual).toEqual(expectedInductionDto)
      expect(educationAndWorkPlanClient.getInduction).toHaveBeenCalledWith(prisonNumber, userToken)
      expect(mockedInductionDtoMapper).toHaveBeenCalledWith(inductionResponse)
    })

    it('should rethrow error given Education and Work Plan API returns Not Found', async () => {
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

      // When
      const actual = await inductionService.getInduction(prisonNumber, userToken).catch(error => {
        return error
      })

      // Then
      expect(actual).toEqual(eductionAndWorkPlanApiError)
      expect(educationAndWorkPlanClient.getInduction).toHaveBeenCalledWith(prisonNumber, userToken)
      expect(mockedInductionDtoMapper).not.toHaveBeenCalled()
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
      const actual = await inductionService.getInduction(prisonNumber, userToken).catch(error => {
        return error
      })

      // Then
      expect(actual).toEqual(eductionAndWorkPlanApiError)
      expect(educationAndWorkPlanClient.getInduction).toHaveBeenCalledWith(prisonNumber, userToken)
      expect(mockedInductionDtoMapper).not.toHaveBeenCalled()
    })
  })

  describe('updateInduction', () => {
    it('should update Induction', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const userToken = 'a-user-token'

      const updateInductionDto = aLongQuestionSetUpdateInductionDto()
      const updateInductionRequest = aLongQuestionSetUpdateInductionRequest()
      educationAndWorkPlanClient.updateInduction.mockResolvedValue(updateInductionRequest)
      mockedUpdateInductionMapper.mockReturnValue(updateInductionRequest)

      // When
      const actual = await inductionService.updateInduction(prisonNumber, updateInductionDto, userToken)

      // Then
      expect(actual).toEqual(updateInductionRequest)
      expect(educationAndWorkPlanClient.updateInduction).toHaveBeenCalledWith(
        prisonNumber,
        updateInductionRequest,
        userToken,
      )
      expect(mockedUpdateInductionMapper).toHaveBeenCalledWith(updateInductionDto)
    })

    it('should not update Induction given Education and Work Plan API returns an error', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const userToken = 'a-user-token'
      const updateInductionDto = aLongQuestionSetUpdateInductionDto()
      const updateInductionRequest = aLongQuestionSetUpdateInductionRequest()
      mockedUpdateInductionMapper.mockReturnValue(updateInductionRequest)

      const eductionAndWorkPlanApiError = {
        status: 500,
        data: {
          status: 500,
          userMessage: `Error updating Induction for prisoner [${prisonNumber}]`,
          developerMessage: `Error updating Induction for prisoner [${prisonNumber}]`,
        },
      }
      educationAndWorkPlanClient.updateInduction.mockRejectedValue(eductionAndWorkPlanApiError)

      // When
      const actual = await inductionService
        .updateInduction(prisonNumber, updateInductionDto, userToken)
        .catch(error => {
          return error
        })

      // Then
      expect(actual).toEqual(eductionAndWorkPlanApiError)
      expect(educationAndWorkPlanClient.updateInduction).toHaveBeenCalledWith(
        prisonNumber,
        updateInductionDto,
        userToken,
      )
      expect(mockedUpdateInductionMapper).toHaveBeenCalledWith(updateInductionDto)
    })
  })
})
