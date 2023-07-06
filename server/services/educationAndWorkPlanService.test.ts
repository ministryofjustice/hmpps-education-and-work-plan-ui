import type { AddStepDto, CreateGoalDto } from 'dto'
import moment from 'moment'
import { EducationAndWorkPlanClient } from '../data'
import EducationAndWorkPlanService from './educationAndWorkPlanService'

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
      const prisonNumber = 'A1234BC'
      const userToken = 'a-user-token'
      const addStepDto: AddStepDto = {
        title: 'Book French course',
        targetDate: moment('2123-01-31', 'YYYY-MM-DD').toDate(),
      }
      const createGoalDto: CreateGoalDto = {
        prisonNumber,
        title: 'Learn French',
        reviewDate: moment('2123-04-31', 'YYYY-MM-DD').toDate(),
        steps: [addStepDto],
        note: 'The Prisoner struggles with languages',
      }
      educationAndWorkPlanClient.createGoal.mockImplementation(() => Promise.resolve(createGoalDto))

      // When
      await educationAndWorkPlanService.createGoal(createGoalDto, userToken)

      // Then
      expect(educationAndWorkPlanClient.createGoal).toHaveBeenCalledWith(createGoalDto, userToken)
    })

    it('should not create goal given educationAndWorkPlanClient returns an error', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const userToken = 'a-user-token'
      const addStepDto: AddStepDto = {
        title: 'Book French course',
        targetDate: moment('2123-01-31', 'YYYY-MM-DD').toDate(),
      }
      const createGoalDto: CreateGoalDto = {
        prisonNumber,
        title: 'Learn French',
        reviewDate: moment('2123-04-31', 'YYYY-MM-DD').toDate(),
        steps: [addStepDto],
        note: 'The Prisoner struggles with languages',
      }

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
