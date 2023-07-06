import type { AddStepDto, CreateGoalDto } from 'dto'
import type { CreateGoalRequest, CreateStepRequest } from 'educationAndWorkPlanApiClient'
import moment from 'moment'
import EducationAndWorkPlanApiMapper from './educationAndWorkPlanApiMapper'

describe('educationAndWorkPlanApiMapper', () => {
  it('should map to CreateGoalDto given valid form data', () => {
    // Given
    const educationAndWorkPlanApiMapper = new EducationAndWorkPlanApiMapper()
    const prisonNumber = 'A1234BC'
    const addStepDto: AddStepDto = {
      title: 'Book Spanish course',
      targetDate: moment('2123-01-31', 'YYYY-MM-DD').toDate(),
    }
    const createGoalDto: CreateGoalDto = {
      prisonNumber,
      title: 'Learn Spanish',
      reviewDate: moment('2123-06-30', 'YYYY-MM-DD').toDate(),
      steps: [addStepDto],
      note: 'Prisoner is not good at listening',
    }

    const expectedAddStepRequest: CreateStepRequest = {
      title: 'Book Spanish course',
      targetDate: moment('2123-01-31', 'YYYY-MM-DD').toDate(),
      sequenceNumber: 1,
    }
    const expectedCreateGoalRequest: CreateGoalRequest = {
      prisonNumber,
      title: 'Learn Spanish',
      category: 'WORK',
      reviewDate: moment('2123-06-30', 'YYYY-MM-DD').toDate(),
      steps: [expectedAddStepRequest],
      note: createGoalDto.note,
    }

    // When
    const createGoalRequest = educationAndWorkPlanApiMapper.toCreateGoalRequest(createGoalDto)

    // Then
    expect(createGoalRequest).toEqual(expectedCreateGoalRequest)
  })
})
