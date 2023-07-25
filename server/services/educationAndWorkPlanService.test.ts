import { EducationAndWorkPlanClient } from '../data'
import EducationAndWorkPlanService from './educationAndWorkPlanService'
import { aValidCreateGoalDtoWithOneStep } from '../testsupport/createGoalDtoTestDataBuilder'
import { aValidActionPlanDtoWithOneGoal } from '../testsupport/actionPlanDtoTestDataBuilder'

describe('educationAndWorkPlanService', () => {
  const educationAndWorkPlanClient = {
    createGoal: jest.fn(),
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
      educationAndWorkPlanClient.createGoal.mockImplementation(() => Promise.resolve(createGoalDto))

      // When
      await educationAndWorkPlanService.createGoal(createGoalDto, userToken)

      // Then
      expect(educationAndWorkPlanClient.createGoal).toHaveBeenCalledWith(createGoalDto, userToken)
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
      const actionPlan = aValidActionPlanDtoWithOneGoal()
      educationAndWorkPlanClient.getActionPlan.mockImplementation(() => Promise.resolve(actionPlan))

      // When
      await educationAndWorkPlanService.getActionPlan(prisonNumber, userToken)

      // Then
      expect(educationAndWorkPlanClient.getActionPlan).toHaveBeenCalledWith(prisonNumber, userToken)
    })

    it('should not get Action Plan given educationAndWorkPlanClient returns an error', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const userToken = 'a-user-token'

      educationAndWorkPlanClient.getActionPlan.mockImplementation(() => Promise.reject(Error('Service Unavailable')))

      // When
      const actual = await educationAndWorkPlanService.getActionPlan(prisonNumber, userToken).catch(error => {
        return error
      })

      // Then
      expect(actual).toEqual(Error('Service Unavailable'))
    })
  })
})
