import type { ArchiveGoalDto } from 'dto'
import type { ArchiveGoalForm } from 'forms'
import ReasonToArchiveGoalValue from '../../../enums/ReasonToArchiveGoalValue'
import toArchiveGoalDto from './archiveGoalFormToDtoMapper'

describe('archiveGoalFormToDtoMapper', () => {
  it('should map from form to DTO object including notes', () => {
    // Given
    const prisonNumber = 'A1234BC'
    const goalReference = '95b18362-fe56-4234-9ad2-11ef98b974a3'
    const reason = ReasonToArchiveGoalValue.OTHER
    const reasonOther = 'Archive it'
    const notes = 'Unable to allocate Chris to the activity as there were no vacancies'
    const prisonId = 'BXI'

    const form: ArchiveGoalForm = { title: 'A goal', reference: goalReference, reason, reasonOther, notes }
    const expected: ArchiveGoalDto = { prisonNumber, goalReference, reason, reasonOther, notes, prisonId }

    // When
    const dto = toArchiveGoalDto(prisonNumber, prisonId, form)

    // Then
    expect(dto).toStrictEqual(expected)
  })

  it('should map from DTO to request object with no other reason, and no notes', () => {
    // Given
    const prisonNumber = 'A1234BC'
    const goalReference = '95b18362-fe56-4234-9ad2-11ef98b974a3'
    const reason = ReasonToArchiveGoalValue.PRISONER_NO_LONGER_WANTS_TO_WORK_TOWARDS_GOAL
    const prisonId = 'BXI'

    const form: ArchiveGoalForm = { title: 'A goal', reference: goalReference, reason }
    const expected: ArchiveGoalDto = {
      prisonNumber,
      goalReference,
      reason,
      reasonOther: undefined,
      notes: null,
      prisonId,
    }

    // When
    const dto = toArchiveGoalDto(prisonNumber, prisonId, form)

    // Then
    expect(dto).toStrictEqual(expected)
  })
})
