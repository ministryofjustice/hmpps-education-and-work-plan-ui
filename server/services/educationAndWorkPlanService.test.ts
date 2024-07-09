import type { ArchiveGoalDto, UnarchiveGoalDto } from 'dto'
import type { ArchiveGoalRequest, UnarchiveGoalRequest } from 'educationAndWorkPlanApiClient'
import type { Goals } from 'viewModels'
import createError from 'http-errors'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import EducationAndWorkPlanService from './educationAndWorkPlanService'
import HmppsAuthClient from '../data/hmppsAuthClient'
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

jest.mock('../data/educationAndWorkPlanClient')
jest.mock('../data/hmppsAuthClient')

describe('educationAndWorkPlanService', () => {
  const educationAndWorkPlanClient = new EducationAndWorkPlanClient() as jest.Mocked<EducationAndWorkPlanClient>
  const hmppsAuthClient = new HmppsAuthClient(null) as jest.Mocked<HmppsAuthClient>
  const educationAndWorkPlanService = new EducationAndWorkPlanService(educationAndWorkPlanClient, hmppsAuthClient)

  const prisonNumber = 'A1234BC'
  const goalReference = '95b18362-fe56-4234-9ad2-11ef98b974a3'

  const username = 'a-dps-user'
  const systemToken = 'a-system-token'

  beforeEach(() => {
    jest.resetAllMocks()
    hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)
  })

  describe('createGoals', () => {
    it('should create Goals', async () => {
      // Given
      const createGoalDto = aValidCreateGoalDtoWithOneStep()
      const createGoalsRequest = aValidCreateGoalsRequestWithOneGoal()

      // When
      await educationAndWorkPlanService.createGoals([createGoalDto], username)

      // Then
      expect(educationAndWorkPlanClient.createGoals).toHaveBeenCalledWith(createGoalsRequest, systemToken)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
    })

    it('should not create Goal given educationAndWorkPlanClient returns an error', async () => {
      // Given
      const createGoalDto = aValidCreateGoalDtoWithOneStep()

      educationAndWorkPlanClient.createGoals.mockRejectedValue(Error('Service Unavailable'))

      // When
      const actual = await educationAndWorkPlanService.createGoals([createGoalDto], username).catch(error => {
        return error
      })

      // Then
      expect(actual).toEqual(Error('Service Unavailable'))
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
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
      expect(educationAndWorkPlanClient.getActionPlan).toHaveBeenCalledWith(prisonNumber, systemToken)
      expect(actual).toEqual(expectedActionPlan)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
    })

    it('should not get Action Plan given educationAndWorkPlanClient returns an error', async () => {
      // Given
      educationAndWorkPlanClient.getActionPlan.mockRejectedValue(Error('Service Unavailable'))

      // When
      const actual = await educationAndWorkPlanService.getActionPlan(prisonNumber, username)

      // Then
      expect(educationAndWorkPlanClient.getActionPlan).toHaveBeenCalledWith(prisonNumber, systemToken)
      expect(actual.problemRetrievingData).toEqual(true)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
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
      const expectedResponse: Goals = { goals: undefined, problemRetrievingData: true }

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
      const expectedResponse: Goals = { goals: undefined, problemRetrievingData: false }

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
      const updateGoalDto = aValidUpdateGoalDtoWithOneStep()
      const updateGoalRequest = aValidUpdateGoalRequestWithOneUpdatedStep()

      // When
      await educationAndWorkPlanService.updateGoal(prisonNumber, updateGoalDto, username)

      // Then
      expect(educationAndWorkPlanClient.updateGoal).toHaveBeenCalledWith(prisonNumber, updateGoalRequest, systemToken)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
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
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
    })
  })

  describe('archiveGoal', () => {
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
      await educationAndWorkPlanService.archiveGoal(archiveGoalDto, username)

      // Then
      expect(educationAndWorkPlanClient.archiveGoal).toHaveBeenCalledWith(prisonNumber, archiveGoalRequest, systemToken)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
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
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
    })
  })

  describe('unarchiveGoal', () => {
    const unarchiveGoalDto: UnarchiveGoalDto = { prisonNumber, goalReference }
    const unarchiveGoalRequest: UnarchiveGoalRequest = { goalReference }

    it('should unarchive Goal', async () => {
      // Given

      // When
      await educationAndWorkPlanService.unarchiveGoal(unarchiveGoalDto, username)

      // Then
      expect(educationAndWorkPlanClient.unarchiveGoal).toHaveBeenCalledWith(
        prisonNumber,
        unarchiveGoalRequest,
        systemToken,
      )
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
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
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
    })
  })
})
