import type { AddStepDto, CreateGoalDto } from 'dto'
import type { AddNoteForm, AddStepForm, CreateGoalForm } from 'forms'
import moment from 'moment'
import CreateGoalFormToCreateGoalDtoMapper from './createGoalFormToCreateGoalDtoMapper'

describe('createGoalFormToCreateGoalDtoMapper', () => {
  it('should map to CreateGoalDto given valid form data', () => {
    // Given
    const createGoalDtoMapper = new CreateGoalFormToCreateGoalDtoMapper()
    const prisonNumber = 'A1234BC'
    const createGoalForm: CreateGoalForm = {
      title: 'Learn Spanish',
      reviewDate: moment('2123-06-30', 'YYYY-MM-DD').toDate(),
      'reviewDate-day': '30',
      'reviewDate-month': '06',
      'reviewDate-year': '2123',
    }
    const addStepForm: AddStepForm = {
      title: 'Book Spanish course',
      targetDate: moment('2123-01-31', 'YYYY-MM-DD').toDate(),
      'targetDate-day': '31',
      'targetDate-month': '01',
      'targetDate-year': '2123',
    }
    const addNoteForm: AddNoteForm = {
      note: 'Prisoner is not good at listening',
    }

    const expectedAddStepDto: AddStepDto = {
      title: 'Book Spanish course',
      targetDate: moment('2123-01-31', 'YYYY-MM-DD').toDate(),
    }
    const expectedCreateGoalDto: CreateGoalDto = {
      prisonNumber,
      title: 'Learn Spanish',
      reviewDate: moment('2123-06-30', 'YYYY-MM-DD').toDate(),
      steps: [expectedAddStepDto],
      note: 'Prisoner is not good at listening',
    }

    // When
    const createGoalDto = createGoalDtoMapper.toCreateGoalDto(prisonNumber, createGoalForm, addStepForm, addNoteForm)

    // Then
    expect(createGoalDto).toEqual(expectedCreateGoalDto)
  })
})
