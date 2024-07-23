import type { ArchiveGoalDto, UnarchiveGoalDto } from 'dto'
import type { ArchiveGoalRequest, UnarchiveGoalRequest } from 'educationAndWorkPlanApiClient'
import type { Goals } from 'viewModels'
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

jest.mock('../data/educationAndWorkPlanClient')
jest.mock('./prisonService')
describe('educationAndWorkPlanService', () => {
  const educationAndWorkPlanClient =
    new EducationAndWorkPlanClient() as unknown as jest.Mocked<EducationAndWorkPlanClient>
  const prisonService = new PrisonService(null, null, null) as unknown as jest.Mocked<PrisonService>
  const educationAndWorkPlanService = new EducationAndWorkPlanService(educationAndWorkPlanClient, prisonService)

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('createGoals', () => {
    it('should create Goals', async () => {
      // Given
      const prisonNumber = 'A1234BC'
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
      const prisonNumber = 'A1234BC'
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
      const prisonNumber = 'A1234BC'
      const userToken = 'a-user-token'
      const actionPlanResponse = aValidActionPlanResponseWithOneGoal()
      educationAndWorkPlanClient.getActionPlan.mockResolvedValue(actionPlanResponse)
      prisonService.getAllPrisonNamesById.mockResolvedValue(new Map())
      const expectedActionPlan = aValidActionPlanWithOneGoal()

      // When
      const actual = await educationAndWorkPlanService.getActionPlan(prisonNumber, userToken)

      // Then
      expect(educationAndWorkPlanClient.getActionPlan).toHaveBeenCalledWith(prisonNumber, userToken)
      expect(actual).toEqual(expectedActionPlan)
    })

    it('should get Action Plan anyway given prisonService returns an error getting prison names', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const userToken = 'a-user-token'
      const actionPlanResponse = aValidActionPlanResponseWithOneGoal()
      educationAndWorkPlanClient.getActionPlan.mockResolvedValue(actionPlanResponse)
      prisonService.getAllPrisonNamesById.mockRejectedValue(Error('Service Unavailable'))
      const expectedActionPlan = aValidActionPlanWithOneGoal()

      // When
      const actual = await educationAndWorkPlanService.getActionPlan(prisonNumber, userToken)

      // Then
      expect(educationAndWorkPlanClient.getActionPlan).toHaveBeenCalledWith(prisonNumber, userToken)
      expect(actual).toEqual(expectedActionPlan)
    })
    it('should not get Action Plan given educationAndWorkPlanClient returns an error', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const userToken = 'a-user-token'
      educationAndWorkPlanClient.getActionPlan.mockRejectedValue(Error('Service Unavailable'))
      prisonService.getAllPrisonNamesById.mockResolvedValue(new Map())

      // When
      const actual = await educationAndWorkPlanService.getActionPlan(prisonNumber, userToken)

      // Then
      expect(educationAndWorkPlanClient.getActionPlan).toHaveBeenCalledWith(prisonNumber, userToken)
      expect(actual.problemRetrievingData).toEqual(true)
    })
  })
  describe('getGoalsByStatus', () => {
    it('should get goals by status', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const status = GoalStatusValue.ACTIVE
      const userToken = 'a-user-token'
      educationAndWorkPlanClient.getGoalsByStatus.mockResolvedValue({ goals: [aValidGoalResponse()] })
      prisonService.getAllPrisonNamesById.mockResolvedValue(new Map())
      const expectedResponse: Goals = { goals: [aValidGoal()], problemRetrievingData: false }

      // When
      const actual = await educationAndWorkPlanService.getGoalsByStatus(prisonNumber, status, userToken)

      // Then
      expect(educationAndWorkPlanClient.getGoalsByStatus).toHaveBeenCalledWith(prisonNumber, status, userToken)
      expect(actual).toEqual(expectedResponse)
    })

    it('should return a problem loading the data if the status is not 404', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const status = GoalStatusValue.ACTIVE
      const userToken = 'a-user-token'

      educationAndWorkPlanClient.getGoalsByStatus.mockRejectedValue(createError(500, 'Service unavailable'))
      prisonService.getAllPrisonNamesById.mockResolvedValue(new Map())
      const expectedResponse: Goals = { goals: undefined, problemRetrievingData: true }

      // When
      const actual = await educationAndWorkPlanService.getGoalsByStatus(prisonNumber, status, userToken)

      // Then
      expect(educationAndWorkPlanClient.getGoalsByStatus).toHaveBeenCalledWith(prisonNumber, status, userToken)
      expect(actual).toEqual(expectedResponse)
    })
    it('should return goals even if an error is returned loading the prison names', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const status = GoalStatusValue.ACTIVE
      const userToken = 'a-user-token'

      educationAndWorkPlanClient.getGoalsByStatus.mockResolvedValue({ goals: [aValidGoalResponse()] })
      prisonService.getAllPrisonNamesById.mockRejectedValue(createError(404, 'Not Found'))
      const expectedResponse: Goals = { goals: [aValidGoal()], problemRetrievingData: false }

      // When
      const actual = await educationAndWorkPlanService.getGoalsByStatus(prisonNumber, status, userToken)

      // Then
      expect(educationAndWorkPlanClient.getGoalsByStatus).toHaveBeenCalledWith(prisonNumber, status, userToken)
      expect(actual).toEqual(expectedResponse)
    })
    it('should return no problem loading the data and undefined goals if the status is 404', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const status = GoalStatusValue.ACTIVE
      const userToken = 'a-user-token'

      educationAndWorkPlanClient.getGoalsByStatus.mockRejectedValue(createError(404, 'Service unavailable'))
      const expectedResponse: Goals = { goals: undefined, problemRetrievingData: false }

      // When
      const actual = await educationAndWorkPlanService.getGoalsByStatus(prisonNumber, status, userToken)

      // Then
      expect(educationAndWorkPlanClient.getGoalsByStatus).toHaveBeenCalledWith(prisonNumber, status, userToken)
      expect(actual).toEqual(expectedResponse)
    })
  })
  describe('updateGoal', () => {
    it('should update Goal', async () => {
      // Given
      const prisonNumber = 'A1234BC'
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
      const prisonNumber = 'A1234BC'
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
    const prisonNumber = 'A1234BC'
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
    const prisonNumber = 'A1234BC'
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
})
