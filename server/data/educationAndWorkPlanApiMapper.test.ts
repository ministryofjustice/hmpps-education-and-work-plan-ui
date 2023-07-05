import type { AddStepDto, CreateGoalDto } from 'dto'
import type { CreateGoalRequest, CreateStepRequest } from 'educationAndWorkPlanApiClient'
import moment from 'moment'
import EducationAndWorkPlanApiMapper from './educationAndWorkPlanApiMapper'

describe('educationAndWorkPlanApiMapper', () => {
  it.skip('should map to CreateGoalDto given valid form data', () => {
    // Given
    const educationAndWorkPlanApiMapper = new EducationAndWorkPlanApiMapper()
    const prisonNumber = 'A1234BC'
    const addStepDto = {
      title: 'Book Spanish course',
      targetDate: moment('2123-01-31', 'YYYY-MM-DD').toDate(),
    } as AddStepDto
    const createGoalDto = {
      prisonNumber,
      title: 'Learn Spanish',
      reviewDate: moment('2123-06-31', 'YYYY-MM-DD').toDate(),
      steps: [addStepDto],
      note: 'Prisoner is not good at listening',
    } as CreateGoalDto

    const expectedAddStepRequest = {
      title: 'Book Spanish course',
      targetDate: moment('2123-01-31', 'YYYY-MM-DD').toDate(),
      sequenceNumber: 1,
    } as CreateStepRequest
    const expectedCreateGoalRequest = {
      prisonNumber,
      title: 'Learn Spanish',
      category: 'WORK',
      reviewDate: moment('2123-06-31', 'YYYY-MM-DD').toDate(),
      steps: [expectedAddStepRequest],
      note: createGoalDto.note,
    } as CreateGoalRequest

    // When
    const createGoalRequest = educationAndWorkPlanApiMapper.createGoalDtoToCreateGoalRequest(createGoalDto)

    // Then
    expect(createGoalRequest).toEqual(expectedCreateGoalRequest)
  })
})
