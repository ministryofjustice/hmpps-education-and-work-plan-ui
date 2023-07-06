import { EducationAndWorkPlanClient } from '../data'
import EducationAndWorkPlanService from './educationAndWorkPlanService'
import { aValidCreateGoalDtoWithOneStep } from '../testsupport/createGoalDtoTestDataBuilder'

describe('educationAndWorkPlanService', () => {
  const educationAndWorkPlanClient = {
    createGoal: jest.fn(),
  }

  const educationAndWorkPlanService = new EducationAndWorkPlanService(
    educationAndWorkPlanClient as unknown as EducationAndWorkPlanClient,
  )

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('createGoal', () => {
    it('should create valid goal', async () => {
      // Given
      const userToken = 'a-user-token'
      const createGoalDto = aValidCreateGoalDtoWithOneStep()
      educationAndWorkPlanClient.createGoal.mockImplementation(() => Promise.resolve(createGoalDto))

      // When
      await educationAndWorkPlanService.createGoal(createGoalDto, userToken)

      // Then
      expect(educationAndWorkPlanClient.createGoal).toHaveBeenCalledWith(createGoalDto, userToken)
    })

    it('should not create goal given educationAndWorkPlanClient returns an error', async () => {
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
})
