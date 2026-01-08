import type { UpdateInductionScheduleStatusRequest } from 'educationAndWorkPlanApiClient'
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
import aValidInductionScheduleResponse from '../testsupport/inductionScheduleResponseTestDataBuilder'
import aValidInductionSchedule from '../testsupport/inductionScheduleTestDataBuilder'
import aValidInductionExemptionDto from '../testsupport/inductionExemptionDtoTestDataBuilder'
import InductionScheduleStatusValue from '../enums/inductionScheduleStatusValue'

jest.mock('../data/educationAndWorkPlanClient')
jest.mock('../data/mappers/inductionDtoMapper')
jest.mock('../data/mappers/inductionScheduleMapper')
jest.mock('../data/mappers/updateInductionMapper')
jest.mock('../data/mappers/createInductionMapper')

describe('inductionService', () => {
  const mockedInductionDtoMapper = toInductionDto as jest.MockedFunction<typeof toInductionDto>
  const mockedInductionScheduleMapper = toInductionSchedule as jest.MockedFunction<typeof toInductionSchedule>
  const mockedUpdateInductionMapper = toUpdateInductionRequest as jest.MockedFunction<typeof toUpdateInductionRequest>
  const mockedCreateInductionMapper = toCreateInductionRequest as jest.MockedFunction<typeof toCreateInductionRequest>

  const educationAndWorkPlanClient = new EducationAndWorkPlanClient(null) as jest.Mocked<EducationAndWorkPlanClient>
  const inductionService = new InductionService(educationAndWorkPlanClient)

  const prisonNumber = 'A1234BC'
  const username = 'a-dps-user'

  beforeEach(() => {
    jest.resetAllMocks()
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
      expect(educationAndWorkPlanClient.getInduction).toHaveBeenCalledWith(prisonNumber, username)
      expect(mockedInductionDtoMapper).toHaveBeenCalledWith(inductionResponse)
    })

    it('should not get Induction given Education and Work Plan API returns null indicating induction Not Found', async () => {
      // Given
      educationAndWorkPlanClient.getInduction.mockResolvedValue(null)

      // When
      const actual = await inductionService.getInduction(prisonNumber, username)

      // Then
      expect(actual).toBeNull()
      expect(educationAndWorkPlanClient.getInduction).toHaveBeenCalledWith(prisonNumber, username)
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
      expect(educationAndWorkPlanClient.getInduction).toHaveBeenCalledWith(prisonNumber, username)
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
        username,
      )
      expect(mockedUpdateInductionMapper).toHaveBeenCalledWith(updateInductionDto)
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
        username,
      )
      expect(mockedUpdateInductionMapper).toHaveBeenCalledWith(updateInductionDto)
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
        username,
      )
      expect(mockedCreateInductionMapper).toHaveBeenCalledWith(createInductionDto)
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
        username,
      )
      expect(mockedCreateInductionMapper).toHaveBeenCalledWith(createInductionDto)
    })
  })

  describe('getInductionSchedule', () => {
    it('should get Induction Schedule given Education and Work Plan API returns an Induction Schedule', async () => {
      // Given
      const inductionScheduleResponse = aValidInductionScheduleResponse()
      educationAndWorkPlanClient.getInductionSchedule.mockResolvedValue(inductionScheduleResponse)
      const expectedInductionSchedule = aValidInductionSchedule()
      mockedInductionScheduleMapper.mockReturnValue(expectedInductionSchedule)

      // When
      const actual = await inductionService.getInductionSchedule(prisonNumber, username)

      // Then
      expect(actual).toEqual(expectedInductionSchedule)
      expect(educationAndWorkPlanClient.getInductionSchedule).toHaveBeenCalledWith(prisonNumber, username)
      expect(mockedInductionScheduleMapper).toHaveBeenCalledWith(inductionScheduleResponse)
    })

    it('should return empty Induction Schedule given Education and Work Plan API returns null indicating Not Found', async () => {
      // Given
      educationAndWorkPlanClient.getInductionSchedule.mockResolvedValue(null)

      const expectedInductionSchedule = { problemRetrievingData: false }

      // When
      const actual = await inductionService.getInductionSchedule(prisonNumber, username)

      // Then
      expect(actual).toEqual(expectedInductionSchedule)
      expect(educationAndWorkPlanClient.getInductionSchedule).toHaveBeenCalledWith(prisonNumber, username)
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
      expect(educationAndWorkPlanClient.getInductionSchedule).toHaveBeenCalledWith(prisonNumber, username)
      expect(mockedInductionScheduleMapper).not.toHaveBeenCalled()
    })
  })

  describe('updateInductionScheduleStatus', () => {
    it('should update Induction Schedule status', async () => {
      // Given
      const inductionExemptionDto = aValidInductionExemptionDto({
        prisonId: 'WDI',
        exemptionReason: InductionScheduleStatusValue.EXEMPT_PRISON_OPERATION_OR_SECURITY_ISSUE,
        exemptionReasonDetails: undefined,
      })

      const expectedUpdateInductionScheduleStatusRequest: UpdateInductionScheduleStatusRequest = {
        prisonId: 'WDI',
        status: 'EXEMPT_PRISON_OPERATION_OR_SECURITY_ISSUE',
        exemptionReason: undefined,
      }
      educationAndWorkPlanClient.updateInductionScheduleStatus.mockResolvedValue(undefined)

      // When
      const actual = await inductionService.updateInductionScheduleStatus(inductionExemptionDto, username)

      // Then
      expect(actual).toBeUndefined()
      expect(educationAndWorkPlanClient.updateInductionScheduleStatus).toHaveBeenCalledWith(
        prisonNumber,
        expectedUpdateInductionScheduleStatusRequest,
        username,
      )
    })

    it('should not update Induction Schedule status given Education and Work Plan API returns an error', async () => {
      // Given
      const inductionExemptionDto = aValidInductionExemptionDto({
        prisonId: 'WDI',
        exemptionReason: InductionScheduleStatusValue.EXEMPT_PRISON_OPERATION_OR_SECURITY_ISSUE,
        exemptionReasonDetails: undefined,
      })

      const expectedUpdateInductionScheduleStatusRequest: UpdateInductionScheduleStatusRequest = {
        prisonId: 'WDI',
        status: 'EXEMPT_PRISON_OPERATION_OR_SECURITY_ISSUE',
        exemptionReason: undefined,
      }

      const eductionAndWorkPlanApiError = {
        status: 500,
        data: {
          status: 500,
          userMessage: `Error updating Induction Schedule Status for prisoner [${prisonNumber}]`,
          developerMessage: `Error updating Induction Schedule Status for prisoner [${prisonNumber}]`,
        },
      }
      educationAndWorkPlanClient.updateInductionScheduleStatus.mockRejectedValue(eductionAndWorkPlanApiError)

      // When
      const actual = await inductionService
        .updateInductionScheduleStatus(inductionExemptionDto, username)
        .catch(error => {
          return error
        })

      // Then
      expect(actual).toEqual(eductionAndWorkPlanApiError)
      expect(educationAndWorkPlanClient.updateInductionScheduleStatus).toHaveBeenCalledWith(
        prisonNumber,
        expectedUpdateInductionScheduleStatusRequest,
        username,
      )
    })
  })
})
