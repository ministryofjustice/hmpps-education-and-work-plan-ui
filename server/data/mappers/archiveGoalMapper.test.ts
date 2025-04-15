import type { ArchiveGoalDto } from 'dto'
import type { ArchiveGoalRequest } from 'educationAndWorkPlanApiClient'
import ReasonToArchiveGoalValue from '../../enums/ReasonToArchiveGoalValue'
import toArchiveGoalRequest from './archiveGoalMapper'

describe('archiveGoalMapper', () => {
  it('should map from DTO to request object including notes', () => {
    // Given
    const prisonNumber = 'A1234BC'
    const goalReference = '95b18362-fe56-4234-9ad2-11ef98b974a3'
    const reason = ReasonToArchiveGoalValue.OTHER
    const reasonOther = 'Archive it'
    const notes = 'Unable to allocate Chris to the activity as there were no vacancies'
    const prisonId = 'BXI'

    const dto: ArchiveGoalDto = { prisonNumber, goalReference, reason, reasonOther, notes, prisonId }
    const expected: ArchiveGoalRequest = { goalReference, reason, reasonOther, note: notes, prisonId }

    // When
    const request = toArchiveGoalRequest(dto)

    // Then
    expect(request).toStrictEqual(expected)
  })

  it('should map from DTO to request object with no other reason, and no notes', () => {
    // Given
    const prisonNumber = 'A1234BC'
    const goalReference = '95b18362-fe56-4234-9ad2-11ef98b974a3'
    const reason = ReasonToArchiveGoalValue.PRISONER_NO_LONGER_WANTS_TO_WORK_TOWARDS_GOAL
    const prisonId = 'BXI'

    const dto: ArchiveGoalDto = { prisonNumber, goalReference, reason, prisonId }
    const expected: ArchiveGoalRequest = { goalReference, reason, reasonOther: undefined, note: undefined, prisonId }

    // When
    const request = toArchiveGoalRequest(dto)

    // Then
    expect(request).toStrictEqual(expected)
  })
})
