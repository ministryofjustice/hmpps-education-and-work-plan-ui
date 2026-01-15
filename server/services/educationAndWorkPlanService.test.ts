import type { ArchiveGoalDto, CompleteGoalDto, UnarchiveGoalDto } from 'dto'
import type { ArchiveGoalRequest, CompleteGoalRequest, UnarchiveGoalRequest } from 'educationAndWorkPlanApiClient'
import type { ActionPlan, Goals } from 'viewModels'
import createError from 'http-errors'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import EducationAndWorkPlanService from './educationAndWorkPlanService'
import { aValidCreateGoalDtoWithOneStep } from '../testsupport/createGoalDtoTestDataBuilder'
import { aValidActionPlanWithOneGoal, aValidGoal } from '../testsupport/actionPlanTestDataBuilder'
import {
  aValidActionPlanResponseWithOneGoal,
  aValidGoalResponse,
} from '../testsupport/actionPlanResponseTestDataBuilder'
import { aValidUpdateGoalDtoWithOneStep } from '../testsupport/updateGoalDtoTestDataBuilder'
import { aValidUpdateGoalRequestWithOneUpdatedStep } from '../testsupport/updateGoalRequestTestDataBuilder'
import { aValidCreateGoalsRequestWithOneGoal } from '../testsupport/createGoalsRequestTestDataBuilder'
import ReasonToArchiveGoalValue from '../enums/ReasonToArchiveGoalValue'
import GoalStatusValue from '../enums/goalStatusValue'
import PrisonService from './prisonService'
import aValidEducationResponse from '../testsupport/educationResponseTestDataBuilder'
import toEducationDto from '../data/mappers/educationMapper'
import aValidEducationDto from '../testsupport/educationDtoTestDataBuilder'
import aValidCreateEducationDto from '../testsupport/createEducationDtoTestDataBuilder'
import aValidCreateEducationRequest from '../testsupport/createEducationRequestTestDataBuilder'
import aValidUpdateEducationRequest from '../testsupport/updateEducationRequestTestDataBuilder'
import aValidUpdateEducationDto from '../testsupport/updateEducationDtoTestDataBuilder'
import aValidCreateActionPlanDto from '../testsupport/createActionPlanDtoTestDataBuilder'
import aValidCreateActionPlanRequest from '../testsupport/createActionPlanRequestTestDataBuilder'

jest.mock('../data/mappers/educationMapper')
jest.mock('../data/educationAndWorkPlanClient')
jest.mock('./prisonService')

describe('educationAndWorkPlanService', () => {
  const educationAndWorkPlanClient = new EducationAndWorkPlanClient(null) as jest.Mocked<EducationAndWorkPlanClient>
  const prisonService = new PrisonService(null, null) as jest.Mocked<PrisonService>

  const mockedEducationMapper = toEducationDto as jest.MockedFunction<typeof toEducationDto>
  const username = 'a-dps-user'
  const prisonNumber = 'A1234BC'
  const prisonId = 'BXI'
  const prisonNamesById = { BXI: 'Brixton (HMP)' }

  beforeEach(() => {
    jest.resetAllMocks()
    prisonService.getAllPrisonNamesById.mockResolvedValue(prisonNamesById)
  })

  const educationAndWorkPlanService = new EducationAndWorkPlanService(educationAndWorkPlanClient, prisonService)

  describe('createGoals', () => {
    it('should create Goals', async () => {
      // Given
      const createGoalDto = aValidCreateGoalDtoWithOneStep()
      const createGoalsRequest = aValidCreateGoalsRequestWithOneGoal()

      // When
      await educationAndWorkPlanService.createGoals(prisonNumber, [createGoalDto], username)

      // Then
      expect(educationAndWorkPlanClient.createGoals).toHaveBeenCalledWith(prisonNumber, createGoalsRequest, username)
    })

    it('should not create Goal given educationAndWorkPlanClient returns an error', async () => {
      // Given
      const createGoalDto = aValidCreateGoalDtoWithOneStep()

      educationAndWorkPlanClient.createGoals.mockRejectedValue(Error('Service Unavailable'))

      // When
      const actual = await educationAndWorkPlanService
        .createGoals(prisonNumber, [createGoalDto], username)
        .catch(error => {
          return error
        })

      // Then
      expect(actual).toEqual(Error('Service Unavailable'))
    })
  })

  describe('getActionPlan', () => {
    it('should get Action Plan', async () => {
      // Given
      const actionPlanResponse = aValidActionPlanResponseWithOneGoal()
      educationAndWorkPlanClient.getActionPlan.mockResolvedValue(actionPlanResponse)
      const expectedActionPlan = aValidActionPlanWithOneGoal()

      // When
      const actual = await educationAndWorkPlanService.getActionPlan(prisonNumber, username)

      // Then
      expect(prisonService.getAllPrisonNamesById).toHaveBeenCalledWith(username)
      expect(educationAndWorkPlanClient.getActionPlan).toHaveBeenCalledWith(prisonNumber, username)
      expect(actual).toEqual(expectedActionPlan)
    })

    it('should get Action Plan anyway given prisonService returns an error getting prison names', async () => {
      // Given
      const actionPlanResponse = aValidActionPlanResponseWithOneGoal()
      educationAndWorkPlanClient.getActionPlan.mockResolvedValue(actionPlanResponse)
      prisonService.getAllPrisonNamesById.mockResolvedValue({})
      const expectedActionPlan = aValidActionPlanWithOneGoal({
        goal: aValidGoal({ createdAtPrisonName: 'BXI', updatedAtPrisonName: 'BXI' }),
      })

      // When
      const actual = await educationAndWorkPlanService.getActionPlan(prisonNumber, username)

      // Then
      expect(prisonService.getAllPrisonNamesById).toHaveBeenCalledWith(username)
      expect(educationAndWorkPlanClient.getActionPlan).toHaveBeenCalledWith(prisonNumber, username)
      expect(actual).toEqual(expectedActionPlan)
    })

    it('should return Action Plan with no goals given the service returns null indicating the prisoner has no action plan', async () => {
      // Given
      educationAndWorkPlanClient.getActionPlan.mockResolvedValue(null)

      const expectedResponse: ActionPlan = {
        prisonNumber,
        goals: [],
        problemRetrievingData: false,
      }

      // When
      const actual = await educationAndWorkPlanService.getActionPlan(prisonNumber, username)

      // Then
      expect(actual).toEqual(expectedResponse)
      expect(educationAndWorkPlanClient.getActionPlan).toHaveBeenCalledWith(prisonNumber, username)
    })

    it('should not get Action Plan given educationAndWorkPlanClient returns response with a non-404 error response', async () => {
      // Given
      educationAndWorkPlanClient.getActionPlan.mockRejectedValue(createError(500, 'Service unavailable'))

      // When
      const actual = await educationAndWorkPlanService.getActionPlan(prisonNumber, username)

      // Then
      expect(educationAndWorkPlanClient.getActionPlan).toHaveBeenCalledWith(prisonNumber, username)
      expect(actual.problemRetrievingData).toEqual(true)
    })
  })

  describe('getGoalsByStatus', () => {
    it('should get goals by status', async () => {
      // Given
      const status = GoalStatusValue.ACTIVE
      educationAndWorkPlanClient.getGoalsByStatus.mockResolvedValue({ goals: [aValidGoalResponse()] })
      const expectedResponse: Goals = { goals: [aValidGoal()], problemRetrievingData: false }

      // When
      const actual = await educationAndWorkPlanService.getGoalsByStatus(prisonNumber, status, username)

      // Then
      expect(educationAndWorkPlanClient.getGoalsByStatus).toHaveBeenCalledWith(prisonNumber, status, username)
      expect(actual).toEqual(expectedResponse)
    })

    it('should return a problem loading the data if the API returns an error', async () => {
      // Given
      const status = GoalStatusValue.ACTIVE

      educationAndWorkPlanClient.getGoalsByStatus.mockRejectedValue(createError(500, 'Service unavailable'))
      const expectedResponse: Goals = { goals: [], problemRetrievingData: true }

      // When
      const actual = await educationAndWorkPlanService.getGoalsByStatus(prisonNumber, status, username)

      // Then
      expect(educationAndWorkPlanClient.getGoalsByStatus).toHaveBeenCalledWith(prisonNumber, status, username)
      expect(actual).toEqual(expectedResponse)
    })

    it('should return goals even if an error is returned loading the prison names', async () => {
      // Given
      const status = GoalStatusValue.ACTIVE

      educationAndWorkPlanClient.getGoalsByStatus.mockResolvedValue({ goals: [aValidGoalResponse()] })
      prisonService.getAllPrisonNamesById.mockResolvedValue({})
      const expectedResponse: Goals = {
        goals: [aValidGoal({ createdAtPrisonName: 'BXI', updatedAtPrisonName: 'BXI' })],
        problemRetrievingData: false,
      }

      // When
      const actual = await educationAndWorkPlanService.getGoalsByStatus(prisonNumber, status, username)

      // Then
      expect(educationAndWorkPlanClient.getGoalsByStatus).toHaveBeenCalledWith(prisonNumber, status, username)
      expect(actual).toEqual(expectedResponse)
    })

    it('should return no problem loading the data and undefined goals given the service returns null indicating the prisoner has no goals', async () => {
      // Given
      const status = GoalStatusValue.ACTIVE

      educationAndWorkPlanClient.getGoalsByStatus.mockResolvedValue(null)
      const expectedResponse: Goals = { goals: [], problemRetrievingData: false }

      // When
      const actual = await educationAndWorkPlanService.getGoalsByStatus(prisonNumber, status, username)

      // Then
      expect(educationAndWorkPlanClient.getGoalsByStatus).toHaveBeenCalledWith(prisonNumber, status, username)
      expect(actual).toEqual(expectedResponse)
    })
  })

  describe('getPrisonerGoalByReference', () => {
    const goalReference = 'c77cd2fb-40e0-4354-982a-5c8017e92b26'

    it('should get goals by reference', async () => {
      // Given
      educationAndWorkPlanClient.getGoal.mockResolvedValue({
        ...aValidGoalResponse(),
        createdAtPrison: 'BXI',
        updatedAtPrison: 'BXI',
      })
      const expectedResponse = aValidGoal({ createdAtPrisonName: 'BXI', updatedAtPrisonName: 'BXI' })

      // When
      const actual = await educationAndWorkPlanService.getPrisonerGoalByReference(prisonNumber, goalReference, username)

      // Then
      expect(educationAndWorkPlanClient.getGoal).toHaveBeenCalledWith(prisonNumber, goalReference, username)
      expect(actual).toEqual(expectedResponse)
    })

    it('should rethrow error given API returns an error', async () => {
      // Given
      const expectedError = new Error('Some error')
      educationAndWorkPlanClient.getGoal.mockRejectedValue(expectedError)

      // When
      const actual = await educationAndWorkPlanService
        .getPrisonerGoalByReference(prisonNumber, goalReference, username)
        .catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(educationAndWorkPlanClient.getGoal).toHaveBeenCalledWith(prisonNumber, goalReference, username)
    })

    it('should return null given the service returns null indicating the goal was not found', async () => {
      // Given
      educationAndWorkPlanClient.getGoal.mockResolvedValue(null)

      // When
      const actual = await educationAndWorkPlanService.getPrisonerGoalByReference(prisonNumber, goalReference, username)

      // Then
      expect(actual).toBeNull()
      expect(educationAndWorkPlanClient.getGoal).toHaveBeenCalledWith(prisonNumber, goalReference, username)
    })
  })

  describe('updateGoal', () => {
    it('should update Goal', async () => {
      // Given
      const updateGoalDto = aValidUpdateGoalDtoWithOneStep()
      const updateGoalRequest = aValidUpdateGoalRequestWithOneUpdatedStep()

      // When
      await educationAndWorkPlanService.updateGoal(prisonNumber, updateGoalDto, username)

      // Then
      expect(educationAndWorkPlanClient.updateGoal).toHaveBeenCalledWith(prisonNumber, updateGoalRequest, username)
    })

    it('should not update Goal given educationAndWorkPlanClient returns an error', async () => {
      // Given
      const updateGoalDto = aValidUpdateGoalDtoWithOneStep()

      educationAndWorkPlanClient.updateGoal.mockRejectedValue(Error('Service Unavailable'))

      // When
      const actual = await educationAndWorkPlanService
        .updateGoal(prisonNumber, updateGoalDto, username)
        .catch(error => {
          return error
        })

      // Then
      expect(actual).toEqual(Error('Service Unavailable'))
    })
  })

  describe('archiveGoal', () => {
    const goalReference = '95b18362-fe56-4234-9ad2-11ef98b974a3'
    const reason = ReasonToArchiveGoalValue.PRISONER_NO_LONGER_WANTS_TO_WORK_TOWARDS_GOAL
    const archiveGoalDto: ArchiveGoalDto = {
      prisonNumber,
      goalReference,
      reason,
      prisonId,
    }
    const archiveGoalRequest: ArchiveGoalRequest = {
      goalReference,
      reason,
      prisonId,
    }

    it('should archive Goal', async () => {
      // Given

      // When
      await educationAndWorkPlanService.archiveGoal(archiveGoalDto, username)

      // Then
      expect(educationAndWorkPlanClient.archiveGoal).toHaveBeenCalledWith(prisonNumber, archiveGoalRequest, username)
    })

    it('should not archive Goal given educationAndWorkPlanClient returns an error', async () => {
      // Given
      educationAndWorkPlanClient.archiveGoal.mockRejectedValue(Error('Service Unavailable'))

      // When
      const actual = await educationAndWorkPlanService.archiveGoal(archiveGoalDto, username).catch(error => {
        return error
      })

      // Then
      expect(actual).toEqual(Error('Service Unavailable'))
    })
  })

  describe('unarchiveGoal', () => {
    const goalReference = '95b18362-fe56-4234-9ad2-11ef98b974a3'
    const unarchiveGoalDto: UnarchiveGoalDto = { prisonNumber, goalReference, prisonId }
    const unarchiveGoalRequest: UnarchiveGoalRequest = { goalReference, prisonId }

    it('should unarchive Goal', async () => {
      // Given

      // When
      await educationAndWorkPlanService.unarchiveGoal(unarchiveGoalDto, username)

      // Then
      expect(educationAndWorkPlanClient.unarchiveGoal).toHaveBeenCalledWith(
        prisonNumber,
        unarchiveGoalRequest,
        username,
      )
    })

    it('should not unarchive Goal given educationAndWorkPlanClient returns an error', async () => {
      // Given
      educationAndWorkPlanClient.unarchiveGoal.mockRejectedValue(Error('Service Unavailable'))

      // When
      const actual = await educationAndWorkPlanService.unarchiveGoal(unarchiveGoalDto, username).catch(error => {
        return error
      })

      // Then
      expect(actual).toEqual(Error('Service Unavailable'))
    })
  })

  describe('completedGoal', () => {
    const goalReference = '95b18362-fe56-4234-9ad2-11ef98b974a3'
    const note = 'Goal completed on time'
    const completedGoalDto: CompleteGoalDto = { prisonNumber, goalReference, note, prisonId }
    const completeGoalRequest: CompleteGoalRequest = { goalReference, note, prisonId }

    it('should complete Goal', async () => {
      // Given

      // When
      await educationAndWorkPlanService.completeGoal(completedGoalDto, username)

      // Then
      expect(educationAndWorkPlanClient.completeGoal).toHaveBeenCalledWith(prisonNumber, completeGoalRequest, username)
    })

    it('should not complete Goal given educationAndWorkPlanClient returns an error', async () => {
      // Given
      educationAndWorkPlanClient.completeGoal.mockRejectedValue(Error('Service Unavailable'))

      // When
      const actual = await educationAndWorkPlanService.completeGoal(completedGoalDto, username).catch(error => {
        return error
      })

      // Then
      expect(actual).toEqual(Error('Service Unavailable'))
    })
  })

  describe('getEducation', () => {
    it('should get prisoner education', async () => {
      // Given
      const educationResponse = aValidEducationResponse()
      educationAndWorkPlanClient.getEducation.mockResolvedValue(educationResponse)

      const expectedEducationDto = aValidEducationDto({ prisonNumber })
      mockedEducationMapper.mockReturnValue(expectedEducationDto)

      // When
      const actual = await educationAndWorkPlanService.getEducation(prisonNumber, username)

      // Then
      expect(actual).toEqual(expectedEducationDto)
      expect(educationAndWorkPlanClient.getEducation).toHaveBeenCalledWith(prisonNumber, username)
      expect(mockedEducationMapper).toHaveBeenCalledWith(educationResponse, prisonNumber)
    })

    it('should handle retrieval of prisoner education given educationAndWorkPlanClient returns null indicating not found error for the prisoners education record', async () => {
      // Given
      educationAndWorkPlanClient.getEducation.mockResolvedValue(null)

      // When
      const actual = await educationAndWorkPlanService.getEducation(prisonNumber, username)

      // Then
      expect(actual).toEqual(null)
      expect(educationAndWorkPlanClient.getEducation).toHaveBeenCalledWith(prisonNumber, username)
      expect(mockedEducationMapper).not.toHaveBeenCalled()
    })

    it('should not get prisoner education given educationAndWorkPlanClient returns an error', async () => {
      // Given
      const eductionAndWorkPlanApiError = {
        status: 500,
        data: {
          status: 500,
          userMessage: 'An unexpected error occurred',
          developerMessage: 'An unexpected error occurred',
        },
      }
      educationAndWorkPlanClient.getEducation.mockRejectedValue(eductionAndWorkPlanApiError)

      // When
      const actual = await educationAndWorkPlanService.getEducation(prisonNumber, username).catch(error => {
        return error
      })

      // Then
      expect(actual).toEqual(eductionAndWorkPlanApiError)
      expect(educationAndWorkPlanClient.getEducation).toHaveBeenCalledWith(prisonNumber, username)
      expect(mockedEducationMapper).not.toHaveBeenCalled()
    })
  })

  describe('createEducation', () => {
    it('should create Education', async () => {
      // Given
      const createEducationDto = aValidCreateEducationDto()
      const createEducationRequest = aValidCreateEducationRequest()

      // When
      await educationAndWorkPlanService.createEducation(prisonNumber, createEducationDto, username)

      // Then
      expect(educationAndWorkPlanClient.createEducation).toHaveBeenCalledWith(
        prisonNumber,
        createEducationRequest,
        username,
      )
    })

    it('should not create Education given educationAndWorkPlanClient returns an error', async () => {
      // Given
      const createEducationDto = aValidCreateEducationDto()

      const eductionAndWorkPlanApiError = {
        status: 500,
        data: {
          status: 500,
          userMessage: 'An unexpected error occurred',
          developerMessage: 'An unexpected error occurred',
        },
      }
      educationAndWorkPlanClient.createEducation.mockRejectedValue(eductionAndWorkPlanApiError)

      // When
      const actual = await educationAndWorkPlanService
        .createEducation(prisonNumber, createEducationDto, username)
        .catch(error => {
          return error
        })

      // Then
      expect(actual).toEqual(eductionAndWorkPlanApiError)
    })
  })

  describe('updateEducation', () => {
    it('should update Education', async () => {
      // Given
      const updateEducationDto = aValidUpdateEducationDto()
      const updateEducationRequest = aValidUpdateEducationRequest()

      // When
      await educationAndWorkPlanService.updateEducation(prisonNumber, updateEducationDto, username)

      // Then
      expect(educationAndWorkPlanClient.updateEducation).toHaveBeenCalledWith(
        prisonNumber,
        updateEducationRequest,
        username,
      )
    })

    it('should not update Education given educationAndWorkPlanClient returns an error', async () => {
      // Given
      const updateEducationDto = aValidUpdateEducationDto()

      const eductionAndWorkPlanApiError = {
        status: 500,
        data: {
          status: 500,
          userMessage: 'An unexpected error occurred',
          developerMessage: 'An unexpected error occurred',
        },
      }
      educationAndWorkPlanClient.updateEducation.mockRejectedValue(eductionAndWorkPlanApiError)

      // When
      const actual = await educationAndWorkPlanService
        .updateEducation(prisonNumber, updateEducationDto, username)
        .catch(error => {
          return error
        })

      // Then
      expect(actual).toEqual(eductionAndWorkPlanApiError)
    })
  })

  describe('EducationAndWorkPlanService - getAllGoalsForPrisoner', () => {
    it('should retrieve and categorise goals based on status', async () => {
      // Given
      const actionPlanResponse = aValidActionPlanResponseWithOneGoal()
      educationAndWorkPlanClient.getActionPlan.mockResolvedValue(actionPlanResponse)
      const actionPlan = aValidActionPlanWithOneGoal()

      // When
      const result = await educationAndWorkPlanService.getAllGoalsForPrisoner(prisonNumber, username)

      // Then
      expect(educationAndWorkPlanClient.getActionPlan).toHaveBeenCalledWith(prisonNumber, username)

      expect(result).toEqual({
        prisonNumber,
        goals: {
          ACTIVE: actionPlan.goals.filter(goal => goal.status === GoalStatusValue.ACTIVE),
          ARCHIVED: actionPlan.goals.filter(goal => goal.status === GoalStatusValue.ARCHIVED),
          COMPLETED: actionPlan.goals.filter(goal => goal.status === GoalStatusValue.COMPLETED),
        },
        problemRetrievingData: actionPlan.problemRetrievingData,
      })
    })

    it('should handle errors and return problemRetrievingData: true', async () => {
      // Given
      educationAndWorkPlanClient.getActionPlan.mockRejectedValue(Error('Service Unavailable'))

      // When
      const actual = await educationAndWorkPlanService.getActionPlan(prisonNumber, username)

      // Then
      expect(educationAndWorkPlanClient.getActionPlan).toHaveBeenCalledWith(prisonNumber, username)
      expect(actual.problemRetrievingData).toEqual(true)
    })
  })

  describe('createActionPlan', () => {
    it('should create Action Plan', async () => {
      // Given
      const createActionPlanDto = aValidCreateActionPlanDto({ prisonNumber })
      const createActionPlanRequest = aValidCreateActionPlanRequest()

      // When
      await educationAndWorkPlanService.createActionPlan(createActionPlanDto, username)

      // Then
      expect(educationAndWorkPlanClient.createActionPlan).toHaveBeenCalledWith(
        prisonNumber,
        createActionPlanRequest,
        username,
      )
    })

    it('should not create Action Plan given educationAndWorkPlanClient returns an error', async () => {
      // Given
      const createActionPlanDto = aValidCreateActionPlanDto({ prisonNumber })

      educationAndWorkPlanClient.createActionPlan.mockRejectedValue(Error('Service Unavailable'))

      // When
      const actual = await educationAndWorkPlanService.createActionPlan(createActionPlanDto, username).catch(error => {
        return error
      })

      // Then
      expect(actual).toEqual(Error('Service Unavailable'))
    })
  })
})
