import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import InductionService from './inductionService'
import aValidInductionResponse from '../testsupport/inductionResponseTestDataBuilder'
import { aValidInductionDto } from '../testsupport/inductionDtoTestDataBuilder'
import aValidUpdateInductionRequest from '../testsupport/updateInductionRequestTestDataBuilder'
import toInductionDto from '../data/mappers/inductionDtoMapper'
import toCreateInductionRequest from '../data/mappers/createInductionMapper'
import toUpdateInductionRequest from '../data/mappers/updateInductionMapper'
import aValidCreateInductionDto from '../testsupport/createInductionDtoTestDataBuilder'
import aValidUpdateInductionDto from '../testsupport/updateInductionDtoTestDataBuilder'
import aValidCreateInductionRequest from '../testsupport/createInductionRequestTestDataBuilder'

jest.mock('../data/educationAndWorkPlanClient')
jest.mock('../data/mappers/inductionDtoMapper')
jest.mock('../data/mappers/updateInductionMapper')
jest.mock('../data/mappers/createInductionMapper')

describe('inductionService', () => {
  const mockedInductionDtoMapper = toInductionDto as jest.MockedFunction<typeof toInductionDto>
  const mockedUpdateInductionMapper = toUpdateInductionRequest as jest.MockedFunction<typeof toUpdateInductionRequest>
  const mockedCreateInductionMapper = toCreateInductionRequest as jest.MockedFunction<typeof toCreateInductionRequest>

  const educationAndWorkPlanClient = new EducationAndWorkPlanClient() as jest.Mocked<EducationAndWorkPlanClient>
  const inductionService = new InductionService(educationAndWorkPlanClient)

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('inductionExists', () => {
    it('should determine if Induction exists given Education and Work Plan API returns an Induction', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const userToken = 'a-user-token'

      educationAndWorkPlanClient.getInduction.mockResolvedValue(aValidInductionResponse())

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

      const inductionResponse = aValidInductionResponse()
      educationAndWorkPlanClient.getInduction.mockResolvedValue(inductionResponse)
      const expectedInductionDto = aValidInductionDto()
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

      const updateInductionDto = aValidUpdateInductionDto()
      const updateInductionRequest = aValidUpdateInductionRequest()
      educationAndWorkPlanClient.updateInduction.mockResolvedValue(updateInductionRequest)
      mockedUpdateInductionMapper.mockReturnValue(updateInductionRequest)

      // When
      await inductionService.updateInduction(prisonNumber, updateInductionDto, userToken)

      // Then
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
      const updateInductionDto = aValidUpdateInductionDto()
      const updateInductionRequest = aValidUpdateInductionRequest()
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
        updateInductionRequest,
        userToken,
      )
      expect(mockedUpdateInductionMapper).toHaveBeenCalledWith(updateInductionDto)
    })
  })

  describe('createInduction', () => {
    it('should create Induction', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const userToken = 'a-user-token'

      const createInductionDto = aValidCreateInductionDto()
      const createInductionRequest = aValidCreateInductionRequest()
      mockedCreateInductionMapper.mockReturnValue(createInductionRequest)

      // When
      await inductionService.createInduction(prisonNumber, createInductionDto, userToken)

      // Then
      expect(educationAndWorkPlanClient.createInduction).toHaveBeenCalledWith(
        prisonNumber,
        createInductionRequest,
        userToken,
      )
      expect(mockedCreateInductionMapper).toHaveBeenCalledWith(createInductionDto)
    })

    it('should not create Induction given Education and Work Plan API returns an error', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const userToken = 'a-user-token'
      const createInductionDto = aValidCreateInductionDto()
      const createInductionRequest = aValidCreateInductionRequest()
      mockedCreateInductionMapper.mockReturnValue(createInductionRequest)

      const eductionAndWorkPlanApiError = {
        status: 500,
        data: {
          status: 500,
          userMessage: `Error creating Induction for prisoner [${prisonNumber}]`,
          developerMessage: `Error creating Induction for prisoner [${prisonNumber}]`,
        },
      }
      educationAndWorkPlanClient.createInduction.mockRejectedValue(eductionAndWorkPlanApiError)

      // When
      const actual = await inductionService
        .createInduction(prisonNumber, createInductionDto, userToken)
        .catch(error => {
          return error
        })

      // Then
      expect(actual).toEqual(eductionAndWorkPlanApiError)
      expect(educationAndWorkPlanClient.createInduction).toHaveBeenCalledWith(
        prisonNumber,
        createInductionRequest,
        userToken,
      )
      expect(mockedCreateInductionMapper).toHaveBeenCalledWith(createInductionDto)
    })
  })
})
