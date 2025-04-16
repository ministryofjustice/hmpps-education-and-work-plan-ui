import type { CompleteGoalDto } from 'dto'
import type { CompleteGoalForm } from 'forms'
import toCompleteGoalDto from './completeGoalFormToDtoMapper'

describe('completeGoalFormToDtoMapper', () => {
  it('should map from form to DTO object', () => {
    // Given
    const prisonNumber = 'A1234BC'
    const goalReference = '95b18362-fe56-4234-9ad2-11ef98b974a3'
    const notes = 'A complete goal note'
    const prisonId = 'BXI'

    const form: CompleteGoalForm = { title: 'A goal', reference: goalReference, notes }
    const expected: CompleteGoalDto = { prisonNumber, goalReference, note: notes, prisonId }

    // When
    const dto = toCompleteGoalDto(prisonNumber, prisonId, form)

    // Then
    expect(dto).toStrictEqual(expected)
  })
})
