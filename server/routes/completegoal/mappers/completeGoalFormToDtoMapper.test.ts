import type { CompleteGoalDto } from 'dto'
import type { CompleteGoalForm } from 'forms'
import toCompleteGoalDto from './completeGoalFormToDtoMapper'

describe('completeGoalFormToDtoMapper', () => {
  it('should map from form to DTO object', () => {
    const prisonNumber = 'A1234BC'
    const goalReference = '95b18362-fe56-4234-9ad2-11ef98b974a3'
    const note = 'A complete goal note'
    const form: CompleteGoalForm = { title: 'A goal', reference: goalReference, note }
    const expected: CompleteGoalDto = { prisonNumber, goalReference, note }

    const dto = toCompleteGoalDto(prisonNumber, form)

    expect(dto).toStrictEqual(expected)
  })
})
