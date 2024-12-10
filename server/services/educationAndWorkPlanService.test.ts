import type { ArchiveGoalDto, UnarchiveGoalDto } from 'dto'
import type { ArchiveGoalRequest, UnarchiveGoalRequest } from 'educationAndWorkPlanApiClient'
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
import HmppsAuthClient from '../data/hmppsAuthClient'
import aValidUpdateEducationRequest from '../testsupport/updateEducationRequestTestDataBuilder'
import aValidUpdateEducationDto from '../testsupport/updateEducationDtoTestDataBuilder'
import aValidCreateActionPlanDto from '../testsupport/createActionPlanDtoTestDataBuilder'
import aValidCreateActionPlanRequest from '../testsupport/createActionPlanRequestTestDataBuilder'

jest.mock('../data/mappers/educationMapper')
jest.mock('../data/educationAndWorkPlanClient')
jest.mock('./prisonService')
jest.mock('../data/hmppsAuthClient')

describe('educationAndWorkPlanService', () => {
  const educationAndWorkPlanClient =
    new EducationAndWorkPlanClient() as unknown as jest.Mocked<EducationAndWorkPlanClient>
  const prisonService = new PrisonService(null, null, null) as unknown as jest.Mocked<PrisonService>

  const mockedEducationMapper = toEducationDto as jest.MockedFunction<typeof toEducationDto>
  const systemToken = 'a-system-token'
  const username = 'a-dps-user'
  const prisonNumber = 'A1234BC'
  const prisonNamesById = new Map([['BXI', 'Brixton (HMP)']])

  beforeEach(() => {
    jest.resetAllMocks()
    hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)
    prisonService.getAllPrisonNamesById.mockResolvedValue(prisonNamesById)
  })

  const hmppsAuthClient = new HmppsAuthClient(null) as jest.Mocked<HmppsAuthClient>
  const educationAndWorkPlanService = new EducationAndWorkPlanService(
    educationAndWorkPlanClient,
    prisonService,
    hmppsAuthClient,
  )

  describe('createGoals', () => {
    it('should create Goals', async () => {
      // Given
      const userToken = 'a-user-token'
      const createGoalDto = aValidCreateGoalDtoWithOneStep()
      const createGoalsRequest = aValidCreateGoalsRequestWithOneGoal()

      // When
      await educationAndWorkPlanService.createGoals(prisonNumber, [createGoalDto], userToken)

      // Then
      expect(educationAndWorkPlanClient.createGoals).toHaveBeenCalledWith(prisonNumber, createGoalsRequest, userToken)
    })

    it('should not create Goal given educationAndWorkPlanClient returns an error', async () => {
      // Given
      const userToken = 'a-user-token'
      const createGoalDto = aValidCreateGoalDtoWithOneStep()

      educationAndWorkPlanClient.createGoals.mockRejectedValue(Error('Service Unavailable'))

      // When
      const actual = await educationAndWorkPlanService
        .createGoals(prisonNumber, [createGoalDto], userToken)
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
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(prisonService.getAllPrisonNamesById).toHaveBeenCalledWith(systemToken)
      expect(educationAndWorkPlanClient.getActionPlan).toHaveBeenCalledWith(prisonNumber, systemToken)
      expect(actual).toEqual(expectedActionPlan)
    })

    it('should get Action Plan anyway given prisonService returns an error getting prison names', async () => {
      // Given
      const actionPlanResponse = aValidActionPlanResponseWithOneGoal()
      educationAndWorkPlanClient.getActionPlan.mockResolvedValue(actionPlanResponse)
      prisonService.getAllPrisonNamesById.mockRejectedValue(Error('Service Unavailable'))
      const expectedActionPlan = aValidActionPlanWithOneGoal({
        goal: aValidGoal({ createdAtPrisonName: 'BXI', updatedAtPrisonName: 'BXI' }),
      })

      // When
      const actual = await educationAndWorkPlanService.getActionPlan(prisonNumber, username)

      // Then
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(prisonService.getAllPrisonNamesById).toHaveBeenCalledWith(systemToken)
      expect(educationAndWorkPlanClient.getActionPlan).toHaveBeenCalledWith(prisonNumber, systemToken)
      expect(actual).toEqual(expectedActionPlan)
    })

    it('should return Action Plan with no goals given educationAndWorkPlanClient returns response with 404 status', async () => {
      // Given
      educationAndWorkPlanClient.getActionPlan.mockRejectedValue(createError(404, 'Not Found'))

      const expectedResponse: ActionPlan = {
        prisonNumber,
        goals: [],
        problemRetrievingData: false,
      }

      // When
      const actual = await educationAndWorkPlanService.getActionPlan(prisonNumber, username)

      // Then
      expect(actual).toEqual(expectedResponse)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(educationAndWorkPlanClient.getActionPlan).toHaveBeenCalledWith(prisonNumber, systemToken)
    })

    it('should not get Action Plan given educationAndWorkPlanClient returns response with a non-404 error response', async () => {
      // Given
      educationAndWorkPlanClient.getActionPlan.mockRejectedValue(createError(500, 'Service unavailable'))

      // When
      const actual = await educationAndWorkPlanService.getActionPlan(prisonNumber, username)

      // Then
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(educationAndWorkPlanClient.getActionPlan).toHaveBeenCalledWith(prisonNumber, systemToken)
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
      expect(educationAndWorkPlanClient.getGoalsByStatus).toHaveBeenCalledWith(prisonNumber, status, systemToken)
      expect(actual).toEqual(expectedResponse)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
    })

    it('should return a problem loading the data if the status is not 404', async () => {
      // Given
      const status = GoalStatusValue.ACTIVE

      educationAndWorkPlanClient.getGoalsByStatus.mockRejectedValue(createError(500, 'Service unavailable'))
      const expectedResponse: Goals = { goals: [], problemRetrievingData: true }

      // When
      const actual = await educationAndWorkPlanService.getGoalsByStatus(prisonNumber, status, username)

      // Then
      expect(educationAndWorkPlanClient.getGoalsByStatus).toHaveBeenCalledWith(prisonNumber, status, systemToken)
      expect(actual).toEqual(expectedResponse)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
    })

    it('should return goals even if an error is returned loading the prison names', async () => {
      // Given
      const status = GoalStatusValue.ACTIVE

      educationAndWorkPlanClient.getGoalsByStatus.mockResolvedValue({ goals: [aValidGoalResponse()] })
      prisonService.getAllPrisonNamesById.mockRejectedValue(createError(404, 'Not Found'))
      const expectedResponse: Goals = {
        goals: [aValidGoal({ createdAtPrisonName: 'BXI', updatedAtPrisonName: 'BXI' })],
        problemRetrievingData: false,
      }

      // When
      const actual = await educationAndWorkPlanService.getGoalsByStatus(prisonNumber, status, username)

      // Then
      expect(educationAndWorkPlanClient.getGoalsByStatus).toHaveBeenCalledWith(prisonNumber, status, systemToken)
      expect(actual).toEqual(expectedResponse)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
    })

    it('should return no problem loading the data and undefined goals if the status is 404', async () => {
      // Given
      const status = GoalStatusValue.ACTIVE

      educationAndWorkPlanClient.getGoalsByStatus.mockRejectedValue(createError(404, 'Service unavailable'))
      const expectedResponse: Goals = { goals: [], problemRetrievingData: false }

      // When
      const actual = await educationAndWorkPlanService.getGoalsByStatus(prisonNumber, status, username)

      // Then
      expect(educationAndWorkPlanClient.getGoalsByStatus).toHaveBeenCalledWith(prisonNumber, status, systemToken)
      expect(actual).toEqual(expectedResponse)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
    })
  })

  describe('updateGoal', () => {
    it('should update Goal', async () => {
      // Given
      const userToken = 'a-user-token'
      const updateGoalDto = aValidUpdateGoalDtoWithOneStep()
      const updateGoalRequest = aValidUpdateGoalRequestWithOneUpdatedStep()

      // When
      await educationAndWorkPlanService.updateGoal(prisonNumber, updateGoalDto, userToken)

      // Then
      expect(educationAndWorkPlanClient.updateGoal).toHaveBeenCalledWith(prisonNumber, updateGoalRequest, userToken)
    })

    it('should not update Goal given educationAndWorkPlanClient returns an error', async () => {
      // Given
      const userToken = 'a-user-token'
      const updateGoalDto = aValidUpdateGoalDtoWithOneStep()

      educationAndWorkPlanClient.updateGoal.mockRejectedValue(Error('Service Unavailable'))

      // When
      const actual = await educationAndWorkPlanService
        .updateGoal(prisonNumber, updateGoalDto, userToken)
        .catch(error => {
          return error
        })

      // Then
      expect(actual).toEqual(Error('Service Unavailable'))
    })
  })

  describe('archiveGoal', () => {
    const userToken = 'a-user-token'
    const goalReference = '95b18362-fe56-4234-9ad2-11ef98b974a3'
    const reason = ReasonToArchiveGoalValue.PRISONER_NO_LONGER_WANTS_TO_WORK_TOWARDS_GOAL
    const archiveGoalDto: ArchiveGoalDto = {
      prisonNumber,
      goalReference,
      reason,
    }
    const archiveGoalRequest: ArchiveGoalRequest = {
      goalReference,
      reason,
    }

    it('should archive Goal', async () => {
      // Given

      // When
      await educationAndWorkPlanService.archiveGoal(archiveGoalDto, userToken)

      // Then
      expect(educationAndWorkPlanClient.archiveGoal).toHaveBeenCalledWith(prisonNumber, archiveGoalRequest, userToken)
    })

    it('should not archive Goal given educationAndWorkPlanClient returns an error', async () => {
      // Given
      educationAndWorkPlanClient.archiveGoal.mockRejectedValue(Error('Service Unavailable'))

      // When
      const actual = await educationAndWorkPlanService.archiveGoal(archiveGoalDto, userToken).catch(error => {
        return error
      })

      // Then
      expect(actual).toEqual(Error('Service Unavailable'))
    })
  })

  describe('unarchiveGoal', () => {
    const userToken = 'a-user-token'
    const goalReference = '95b18362-fe56-4234-9ad2-11ef98b974a3'
    const unarchiveGoalDto: UnarchiveGoalDto = { prisonNumber, goalReference }
    const unarchiveGoalRequest: UnarchiveGoalRequest = { goalReference }

    it('should unarchive Goal', async () => {
      // Given

      // When
      await educationAndWorkPlanService.unarchiveGoal(unarchiveGoalDto, userToken)

      // Then
      expect(educationAndWorkPlanClient.unarchiveGoal).toHaveBeenCalledWith(
        prisonNumber,
        unarchiveGoalRequest,
        userToken,
      )
    })

    it('should not unarchive Goal given educationAndWorkPlanClient returns an error', async () => {
      // Given
      educationAndWorkPlanClient.unarchiveGoal.mockRejectedValue(Error('Service Unavailable'))

      // When
      const actual = await educationAndWorkPlanService.unarchiveGoal(unarchiveGoalDto, userToken).catch(error => {
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
      const actual = await educationAndWorkPlanService.getEducation(prisonNumber, systemToken)

      // Then
      expect(actual).toEqual(expectedEducationDto)
      expect(educationAndWorkPlanClient.getEducation).toHaveBeenCalledWith(prisonNumber, systemToken)
      expect(mockedEducationMapper).toHaveBeenCalledWith(educationResponse, prisonNumber)
    })

    it('should not get prisoner education given educationAndWorkPlanClient returns a 404 error', async () => {
      // Given
      const eductionAndWorkPlanApiError = {
        status: 404,
        data: {
          status: 404,
          userMessage: `Education not found for prisoner [${prisonNumber}]`,
          developerMessage: `Education not found for prisoner [${prisonNumber}]`,
        },
      }
      educationAndWorkPlanClient.getEducation.mockRejectedValue(eductionAndWorkPlanApiError)

      // When
      const actual = await educationAndWorkPlanService.getEducation(prisonNumber, systemToken)

      // Then
      expect(actual).toBeUndefined()
      expect(educationAndWorkPlanClient.getEducation).toHaveBeenCalledWith(prisonNumber, systemToken)
      expect(mockedEducationMapper).not.toHaveBeenCalled()
    })

    it('should not get prisoner education given educationAndWorkPlanClient returns a non 404 error', async () => {
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
      const actual = await educationAndWorkPlanService.getEducation(prisonNumber, systemToken).catch(error => {
        return error
      })

      // Then
      expect(actual).toEqual(eductionAndWorkPlanApiError)
      expect(educationAndWorkPlanClient.getEducation).toHaveBeenCalledWith(prisonNumber, systemToken)
      expect(mockedEducationMapper).not.toHaveBeenCalled()
    })
  })

  describe('createEducation', () => {
    it('should create Education', async () => {
      // Given
      const userToken = 'a-user-token'
      const createEducationDto = aValidCreateEducationDto()
      const createEducationRequest = aValidCreateEducationRequest()

      // When
      await educationAndWorkPlanService.createEducation(prisonNumber, createEducationDto, userToken)

      // Then
      expect(educationAndWorkPlanClient.createEducation).toHaveBeenCalledWith(
        prisonNumber,
        createEducationRequest,
        userToken,
      )
    })

    it('should not create Education given educationAndWorkPlanClient returns an error', async () => {
      // Given
      const userToken = 'a-user-token'
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
        .createEducation(prisonNumber, createEducationDto, userToken)
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
      const userToken = 'a-user-token'
      const updateEducationDto = aValidUpdateEducationDto()
      const updateEducationRequest = aValidUpdateEducationRequest()

      // When
      await educationAndWorkPlanService.updateEducation(prisonNumber, updateEducationDto, userToken)

      // Then
      expect(educationAndWorkPlanClient.updateEducation).toHaveBeenCalledWith(
        prisonNumber,
        updateEducationRequest,
        userToken,
      )
    })

    it('should not update Education given educationAndWorkPlanClient returns an error', async () => {
      // Given
      const userToken = 'a-user-token'
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
        .updateEducation(prisonNumber, updateEducationDto, userToken)
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
      const result = await educationAndWorkPlanService.getAllGoalsForPrisoner(prisonNumber, systemToken)

      // Then
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(systemToken)
      expect(educationAndWorkPlanClient.getActionPlan).toHaveBeenCalledWith(prisonNumber, systemToken)

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
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(educationAndWorkPlanClient.getActionPlan).toHaveBeenCalledWith(prisonNumber, systemToken)
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
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(educationAndWorkPlanClient.createActionPlan).toHaveBeenCalledWith(
        prisonNumber,
        createActionPlanRequest,
        systemToken,
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
