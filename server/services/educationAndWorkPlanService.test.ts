import { EducationAndWorkPlanClient } from '../data'
import EducationAndWorkPlanService from './educationAndWorkPlanService'
import { aValidCreateGoalDtoWithOneStep } from '../testsupport/createGoalDtoTestDataBuilder'
import { aValidActionPlanWithOneGoal } from '../testsupport/actionPlanTestDataBuilder'
import { aValidActionPlanResponseWithOneGoal } from '../testsupport/actionPlanResponseTestDataBuilder'
import { aValidCreateGoalRequestWithOneStep } from '../testsupport/createGoalRequestTestDataBuilder'
import { aValidUpdateGoalDtoWithOneStep } from '../testsupport/updateGoalDtoTestDataBuilder'
import { aValidUpdateGoalRequestWithOneUpdatedStep } from '../testsupport/updateGoalRequestTestDataBuilder'

describe('educationAndWorkPlanService', () => {
  const educationAndWorkPlanClient = {
    createGoal: jest.fn(),
    updateGoal: jest.fn(),
    getActionPlan: jest.fn(),
  }

  const educationAndWorkPlanService = new EducationAndWorkPlanService(
    educationAndWorkPlanClient as unknown as EducationAndWorkPlanClient,
  )

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('createGoal', () => {
    it('should create Goal', async () => {
      // Given
      const userToken = 'a-user-token'
      const createGoalDto = aValidCreateGoalDtoWithOneStep()
      const createGoalRequest = aValidCreateGoalRequestWithOneStep()
      educationAndWorkPlanClient.createGoal.mockImplementation(() => Promise.resolve(createGoalDto))

      // When
      await educationAndWorkPlanService.createGoal(createGoalDto, userToken)

      // Then
      expect(educationAndWorkPlanClient.createGoal).toHaveBeenCalledWith(createGoalRequest, userToken)
    })

    it('should not create Goal given educationAndWorkPlanClient returns an error', async () => {
      // Given
      const userToken = 'a-user-token'
      const createGoalDto = aValidCreateGoalDtoWithOneStep()

      educationAndWorkPlanClient.createGoal.mockImplementation(() => Promise.reject(Error('Service Unavailable')))

      // When
      const actual = await educationAndWorkPlanService.createGoal(createGoalDto, userToken).catch(error => {
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
