import { EducationAndWorkPlanClient } from '../data'
import EducationAndWorkPlanService from './educationAndWorkPlanService'
import { aValidCreateGoalDtoWithOneStep } from '../testsupport/createGoalDtoTestDataBuilder'
import { aValidActionPlanWithOneGoal } from '../testsupport/actionPlanTestDataBuilder'
import { aValidActionPlanResponseWithOneGoal } from '../testsupport/actionPlanResponseTestDataBuilder'
import { aValidUpdateGoalDtoWithOneStep } from '../testsupport/updateGoalDtoTestDataBuilder'
import { aValidUpdateGoalRequestWithOneUpdatedStep } from '../testsupport/updateGoalRequestTestDataBuilder'
import { aValidCreateGoalsRequestWithOneGoal } from '../testsupport/createGoalsRequestTestDataBuilder'

describe('educationAndWorkPlanService', () => {
  const educationAndWorkPlanClient = {
    createGoals: jest.fn(),
    updateGoal: jest.fn(),
    getActionPlan: jest.fn(),
  }

  const educationAndWorkPlanService = new EducationAndWorkPlanService(
    educationAndWorkPlanClient as unknown as EducationAndWorkPlanClient,
  )

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('createGoals', () => {
    it('should create Goals', async () => {
      // Given
      const userToken = 'a-user-token'
      const createGoalDto = aValidCreateGoalDtoWithOneStep()
      const createGoalsRequest = aValidCreateGoalsRequestWithOneGoal()
      educationAndWorkPlanClient.createGoals.mockImplementation(() => Promise.resolve(createGoalDto))

      // When
      await educationAndWorkPlanService.createGoals([createGoalDto], userToken)

      // Then
      expect(educationAndWorkPlanClient.createGoals).toHaveBeenCalledWith(createGoalsRequest, userToken)
    })

    it('should not create Goal given educationAndWorkPlanClient returns an error', async () => {
      // Given
      const userToken = 'a-user-token'
      const createGoalDto = aValidCreateGoalDtoWithOneStep()

      educationAndWorkPlanClient.createGoals.mockImplementation(() => Promise.reject(Error('Service Unavailable')))

      // When
      const actual = await educationAndWorkPlanService.createGoals([createGoalDto], userToken).catch(error => {
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
      educationAndWorkPlanClient.getActionPlan.mockImplementation(() => Promise.resolve(actionPlanResponse))
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

      educationAndWorkPlanClient.getActionPlan.mockImplementation(() => Promise.reject(Error('Service Unavailable')))

      // When
      const actual = await educationAndWorkPlanService.getActionPlan(prisonNumber, userToken)

      // Then
      expect(educationAndWorkPlanClient.getActionPlan).toHaveBeenCalledWith(prisonNumber, userToken)
      expect(actual.problemRetrievingData).toEqual(true)
    })
  })

  describe('updateGoal', () => {
    it('should update Goal', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const userToken = 'a-user-token'
      const updateGoalDto = aValidUpdateGoalDtoWithOneStep()
      const updateGoalRequest = aValidUpdateGoalRequestWithOneUpdatedStep()
      educationAndWorkPlanClient.updateGoal.mockImplementation(() => Promise.resolve(updateGoalDto))

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

      educationAndWorkPlanClient.updateGoal.mockImplementation(() => Promise.reject(Error('Service Unavailable')))

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
})
