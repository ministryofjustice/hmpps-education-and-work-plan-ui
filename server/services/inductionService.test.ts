import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import InductionService from './inductionService'
import aValidInductionResponse from '../testsupport/inductionResponseTestDataBuilder'
import { aValidInductionDto } from '../testsupport/inductionDtoTestDataBuilder'
import aValidUpdateInductionRequest from '../testsupport/updateInductionRequestTestDataBuilder'
import toInductionDto from '../data/mappers/inductionDtoMapper'
import toInductionSchedule from '../data/mappers/inductionScheduleMapper'
import toCreateInductionRequest from '../data/mappers/createInductionMapper'
import toUpdateInductionRequest from '../data/mappers/updateInductionMapper'
import aValidCreateInductionDto from '../testsupport/createInductionDtoTestDataBuilder'
import aValidUpdateInductionDto from '../testsupport/updateInductionDtoTestDataBuilder'
import aValidCreateInductionRequest from '../testsupport/createInductionRequestTestDataBuilder'
import HmppsAuthClient from '../data/hmppsAuthClient'
import aValidInductionScheduleResponse from '../testsupport/inductionScheduleResponseTestDataBuilder'
import aValidInductionSchedule from '../testsupport/inductionScheduleTestDataBuilder'

jest.mock('../data/educationAndWorkPlanClient')
jest.mock('../data/mappers/inductionDtoMapper')
jest.mock('../data/mappers/inductionScheduleMapper')
jest.mock('../data/mappers/updateInductionMapper')
jest.mock('../data/mappers/createInductionMapper')
jest.mock('../data/hmppsAuthClient')

describe('inductionService', () => {
  const mockedInductionDtoMapper = toInductionDto as jest.MockedFunction<typeof toInductionDto>
  const mockedInductionScheduleMapper = toInductionSchedule as jest.MockedFunction<typeof toInductionSchedule>
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
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(mockedInductionDtoMapper).toHaveBeenCalledWith(inductionResponse)
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
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(mockedInductionDtoMapper).not.toHaveBeenCalled()
    })
  })

  describe('updateInduction', () => {
    it('should update Induction', async () => {
      // Given
      const updateInductionDto = aValidUpdateInductionDto()
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
      const createInductionDto = aValidCreateInductionDto()
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

  describe('getInductionSchedule', () => {
    it('should get Induction Schedule given Education and Work Plan API returns an Induction Schedule', async () => {
      // Given
      const inductionScheduleResponse = aValidInductionScheduleResponse()
      educationAndWorkPlanClient.getInductionSchedule.mockResolvedValue(inductionScheduleResponse)
      const expectedInductionScheduleDto = aValidInductionSchedule()
      mockedInductionScheduleMapper.mockReturnValue(expectedInductionScheduleDto)

      // When
      const actual = await inductionService.getInductionSchedule(prisonNumber, username)

      // Then
      expect(actual).toEqual(expectedInductionScheduleDto)
      expect(educationAndWorkPlanClient.getInductionSchedule).toHaveBeenCalledWith(prisonNumber, systemToken)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(mockedInductionScheduleMapper).toHaveBeenCalledWith(inductionScheduleResponse)
    })

    it('should rethrow error given Education and Work Plan API returns Not Found', async () => {
      // Given
      const eductionAndWorkPlanApiError = {
        status: 404,
        data: {
          status: 404,
          userMessage: `Induction Schedule not found for prisoner [${prisonNumber}]`,
          developerMessage: `Induction Schedule not found for prisoner [${prisonNumber}]`,
        },
      }
      educationAndWorkPlanClient.getInductionSchedule.mockRejectedValue(eductionAndWorkPlanApiError)

      // When
      const actual = await inductionService.getInductionSchedule(prisonNumber, username).catch(error => {
        return error
      })

      // Then
      expect(actual).toEqual(eductionAndWorkPlanApiError)
      expect(educationAndWorkPlanClient.getInductionSchedule).toHaveBeenCalledWith(prisonNumber, systemToken)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(mockedInductionScheduleMapper).not.toHaveBeenCalled()
    })

    it('should return problemRetrievingData given Education and Work Plan API returns an unexpected error', async () => {
      // Given
      const eductionAndWorkPlanApiError = {
        status: 500,
        data: {
          status: 500,
          userMessage: 'An unexpected error occurred',
          developerMessage: 'An unexpected error occurred',
        },
      }
      educationAndWorkPlanClient.getInductionSchedule.mockRejectedValue(eductionAndWorkPlanApiError)

      // When
      const actual = await inductionService.getInductionSchedule(prisonNumber, username).catch(error => {
        return error
      })

      // Then
      expect(actual).toEqual(eductionAndWorkPlanApiError)
      expect(educationAndWorkPlanClient.getInductionSchedule).toHaveBeenCalledWith(prisonNumber, systemToken)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(mockedInductionScheduleMapper).not.toHaveBeenCalled()
    })
  })
})
