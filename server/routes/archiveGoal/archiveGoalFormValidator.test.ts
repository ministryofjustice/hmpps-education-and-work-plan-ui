import type { ArchiveGoalForm } from 'forms'
import aValidArchiveGoalForm from '../../testsupport/archiveGoalFormTestDataBuilder'
import validateArchiveGoalForm from './archiveGoalFormValidator'
import ReasonToArchiveGoalValue from '../../enums/ReasonToArchiveGoalValue'

describe('archiveGoalFormValidator', () => {
  it('should validate given no errors', () => {
    // Given
    const form: ArchiveGoalForm = aValidArchiveGoalForm()

    // When
    const errors = validateArchiveGoalForm(form)

    // Then
    expect(errors).toEqual([])
  })

  it('should require a reason to be selected', () => {
    // Given
    const form: ArchiveGoalForm = {
      reference: '95b18362-fe56-4234-9ad2-11ef98b974a3',
      title: 'Learn French',
    }

    // When
    const errors = validateArchiveGoalForm(form)

    // Then
    expect(errors).toEqual([{ href: '#reason', text: 'Select a reason to archive the goal' }])
  })

  it.each([undefined, ''])('should require details when selecting OTHER', anInvalidReasonOther => {
    // Given
    const form: ArchiveGoalForm = {
      reference: '95b18362-fe56-4234-9ad2-11ef98b974a3',
      title: 'Learn French',
      reason: ReasonToArchiveGoalValue.OTHER,
      reasonOther: anInvalidReasonOther,
    }

    // When
    const errors = validateArchiveGoalForm(form)

    // Then
    expect(errors).toEqual([{ href: '#reasonOther', text: 'Enter the reason you are archiving the goal' }])
  })

  it('other reason should be 200 chars or less', () => {
    // Given
    const anInvalidReasonOther = ''.padEnd(201, 'x')
    const form: ArchiveGoalForm = {
      reference: '95b18362-fe56-4234-9ad2-11ef98b974a3',
      title: 'Learn French',
      reason: ReasonToArchiveGoalValue.OTHER,
      reasonOther: anInvalidReasonOther,
    }

    // When
    const errors = validateArchiveGoalForm(form)

    // Then
    expect(errors).toEqual([{ href: '#reasonOther', text: 'The reason must be 200 characters or less' }])
  })

  it('other reason should be able to be 200 chars', () => {
    // Given
    const aValidReasonOther = ''.padEnd(200, 'x')
    const form: ArchiveGoalForm = {
      reference: '95b18362-fe56-4234-9ad2-11ef98b974a3',
      title: 'Learn French',
      reason: ReasonToArchiveGoalValue.OTHER,
      reasonOther: aValidReasonOther,
    }

    // When
    const errors = validateArchiveGoalForm(form)

    // Then
    expect(aValidReasonOther).toHaveLength(200)
    expect(errors).toEqual([])
  })
})
