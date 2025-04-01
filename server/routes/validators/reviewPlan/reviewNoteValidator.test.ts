import type { ReviewNoteForm } from 'reviewPlanForms'
import validateReviewNote from './reviewNoteValidator'

describe('reviewNoteValidator', () => {
  it('should validate given a valid review note', () => {
    // Given
    const reviewNote: ReviewNoteForm = { notes: 'Prisoner is progressing well.' }

    // When
    const errors = validateReviewNote(reviewNote)

    // Then
    expect(errors).toStrictEqual([])
  })

  it.each([
    null,
    undefined,
    '',
    '     ',
    `
`,
    `


`,
    `


`,
  ])('should validate given a missing review note', value => {
    // Given
    const reviewNote: ReviewNoteForm = { notes: value }

    // When
    const errors = validateReviewNote(reviewNote)

    // Then
    expect(errors).toEqual([{ href: '#notes', text: 'You must add a note to this review' }])
  })

  it('should validate given review note exceeds maximum length', () => {
    // Given
    const reviewNote: ReviewNoteForm = { notes: 'a'.repeat(513) }

    // When
    const errors = validateReviewNote(reviewNote)

    expect(errors).toEqual([{ href: '#notes', text: 'Review note must be 512 characters or less' }])
  })
})
