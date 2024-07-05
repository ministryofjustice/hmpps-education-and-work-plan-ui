import type { UnarchiveGoalDto } from 'dto'
import type { UnarchiveGoalForm } from 'forms'
import toUnarchiveGoalDto from './unarchiveGoalFormToDtoMapper'

describe('unarchiveGoalFormToDtoMapper', () => {
  it('should map from form to DTO object', () => {
    const prisonNumber = 'A1234BC'
    const goalReference = '95b18362-fe56-4234-9ad2-11ef98b974a3'
    const form: UnarchiveGoalForm = { title: 'A goal', reference: goalReference }
    const expected: UnarchiveGoalDto = { prisonNumber, goalReference }

    const dto = toUnarchiveGoalDto(prisonNumber, form)

    expect(dto).toStrictEqual(expected)
  })
})
