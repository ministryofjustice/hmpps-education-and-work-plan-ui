import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import HmppsAuthClient from '../data/hmppsAuthClient'
import InductionService from './inductionService'
import aValidInductionResponse from '../testsupport/inductionResponseTestDataBuilder'
import aValidInductionDto from '../testsupport/inductionDtoTestDataBuilder'
import aValidUpdateInductionRequest from '../testsupport/updateInductionRequestTestDataBuilder'
import toInductionDto from '../data/mappers/inductionDtoMapper'
import toCreateInductionRequest from '../data/mappers/createInductionMapper'
import toUpdateInductionRequest from '../data/mappers/updateInductionMapper'
import aValidCreateOrUpdateInductionDto from '../testsupport/createInductionDtoTestDataBuilder'
import aValidCreateInductionRequest from '../testsupport/createInductionRequestTestDataBuilder'

jest.mock('../data/educationAndWorkPlanClient')
jest.mock('../data/hmppsAuthClient')
jest.mock('../data/mappers/inductionDtoMapper')
jest.mock('../data/mappers/updateInductionMapper')
jest.mock('../data/mappers/createInductionMapper')

describe('inductionService', () => {
  const mockedInductionDtoMapper = toInductionDto as jest.MockedFunction<typeof toInductionDto>
  const mockedUpdateInductionMapper = toUpdateInductionRequest as jest.MockedFunction<typeof toUpdateInductionRequest>
  const mockedCreateInductionMapper = toCreateInductionRequest as jest.MockedFunction<typeof toCreateInductionRequest>

  const educationAndWorkPlanClient = new EducationAndWorkPlanClient() as jest.Mocked<EducationAndWorkPlanClient>
  const hmppsAuthClient = new HmppsAuthClient(null) as jest.Mocked<HmppsAuthClient>
  const inductionService = new InductionService(educationAndWorkPlanClient, hmppsAuthClient)

  const prisonNumber = 'A1234BC'
  const username = 'a-dps-user'
  const systemToken = 'a-system-token'

  beforeEach(() => {
    jest.resetAllMocks()
    hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)
  })

  describe('inductionExists', () => {
    it('should determine if Induction exists given Education and Work Plan API returns an Induction', async () => {
      // Given
      educationAndWorkPlanClient.getInduction.mockResolvedValue(aValidInductionResponse())

      const expected = true

      // When
      const actual = await inductionService.inductionExists(prisonNumber, username)

      // Then
      expect(actual).toEqual(expected)
      expect(educationAndWorkPlanClient.getInduction).toHaveBeenCalledWith(prisonNumber, systemToken)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
    })

    it('should determine if Induction exists given Education and Work Plan API returns Not Found', async () => {
      // Given
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
      const actual = await inductionService.inductionExists(prisonNumber, username)

      // Then
      expect(actual).toEqual(expected)
      expect(educationAndWorkPlanClient.getInduction).toHaveBeenCalledWith(prisonNumber, systemToken)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
    })

    it('should rethrow error given Education and Work Plan API returns an unexpected error', async () => {
      // Given
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
      const actual = await inductionService.inductionExists(prisonNumber, username).catch(error => {
        return error
      })

      // Then
      expect(actual).toEqual(eductionAndWorkPlanApiError)
      expect(educationAndWorkPlanClient.getInduction).toHaveBeenCalledWith(prisonNumber, systemToken)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
    })
  })

  describe('getInduction', () => {
    it('should get Induction given Education and Work Plan API returns an Induction', async () => {
      // Given
      const inductionResponse = aValidInductionResponse()
      educationAndWorkPlanClient.getInduction.mockResolvedValue(inductionResponse)
      const expectedInductionDto = aValidInductionDto()
      mockedInductionDtoMapper.mockReturnValue(expectedInductionDto)

      // When
      const actual = await inductionService.getInduction(prisonNumber, username)

      // Then
      expect(actual).toEqual(expectedInductionDto)
      expect(educationAndWorkPlanClient.getInduction).toHaveBeenCalledWith(prisonNumber, systemToken)
      expect(mockedInductionDtoMapper).toHaveBeenCalledWith(inductionResponse)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
    })

    it('should rethrow error given Education and Work Plan API returns Not Found', async () => {
      // Given
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
      const actual = await inductionService.getInduction(prisonNumber, username).catch(error => {
        return error
      })

      // Then
      expect(actual).toEqual(eductionAndWorkPlanApiError)
      expect(educationAndWorkPlanClient.getInduction).toHaveBeenCalledWith(prisonNumber, systemToken)
      expect(mockedInductionDtoMapper).not.toHaveBeenCalled()
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
    })

    it('should rethrow error given Education and Work Plan API returns an unexpected error', async () => {
      // Given
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
      const actual = await inductionService.getInduction(prisonNumber, username).catch(error => {
        return error
      })

      // Then
      expect(actual).toEqual(eductionAndWorkPlanApiError)
      expect(educationAndWorkPlanClient.getInduction).toHaveBeenCalledWith(prisonNumber, systemToken)
      expect(mockedInductionDtoMapper).not.toHaveBeenCalled()
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
    })
  })

  describe('updateInduction', () => {
    it('should update Induction', async () => {
      // Given
      const updateInductionDto = aValidCreateOrUpdateInductionDto()
      const updateInductionRequest = aValidUpdateInductionRequest()
      educationAndWorkPlanClient.updateInduction.mockResolvedValue(updateInductionRequest)
      mockedUpdateInductionMapper.mockReturnValue(updateInductionRequest)

      // When
      await inductionService.updateInduction(prisonNumber, updateInductionDto, username)

      // Then
      expect(educationAndWorkPlanClient.updateInduction).toHaveBeenCalledWith(
        prisonNumber,
        updateInductionRequest,
        systemToken,
      )
      expect(mockedUpdateInductionMapper).toHaveBeenCalledWith(updateInductionDto)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
    })

    it('should not update Induction given Education and Work Plan API returns an error', async () => {
      // Given
      const updateInductionDto = aValidCreateOrUpdateInductionDto()
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
        .updateInduction(prisonNumber, updateInductionDto, username)
        .catch(error => error)

      // Then
      expect(actual).toEqual(eductionAndWorkPlanApiError)
      expect(educationAndWorkPlanClient.updateInduction).toHaveBeenCalledWith(
        prisonNumber,
        updateInductionRequest,
        systemToken,
      )
      expect(mockedUpdateInductionMapper).toHaveBeenCalledWith(updateInductionDto)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
    })
  })

  describe('createInduction', () => {
    it('should create Induction', async () => {
      // Given
      const createInductionDto = aValidCreateOrUpdateInductionDto()
      const createInductionRequest = aValidCreateInductionRequest()
      mockedCreateInductionMapper.mockReturnValue(createInductionRequest)

      // When
      await inductionService.createInduction(prisonNumber, createInductionDto, username)

      // Then
      expect(educationAndWorkPlanClient.createInduction).toHaveBeenCalledWith(
        prisonNumber,
        createInductionRequest,
        systemToken,
      )
      expect(mockedCreateInductionMapper).toHaveBeenCalledWith(createInductionDto)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
    })

    it('should not create Induction given Education and Work Plan API returns an error', async () => {
      // Given
      const createInductionDto = aValidCreateOrUpdateInductionDto()
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
        .createInduction(prisonNumber, createInductionDto, username)
        .catch(error => error)

      // Then
      expect(actual).toEqual(eductionAndWorkPlanApiError)
      expect(educationAndWorkPlanClient.createInduction).toHaveBeenCalledWith(
        prisonNumber,
        createInductionRequest,
        systemToken,
      )
      expect(mockedCreateInductionMapper).toHaveBeenCalledWith(createInductionDto)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
    })
  })
})
