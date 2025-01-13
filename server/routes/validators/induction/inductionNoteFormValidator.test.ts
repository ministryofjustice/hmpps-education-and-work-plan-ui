import type { InductionNoteForm } from 'inductionForms'
import validateInductionNote from './inductionNoteFormValidator'

describe('inductionNoteValidator', () => {
  it('should validate given a valid induction note', () => {
    // Given
    const inductionNote: InductionNoteForm = { notes: 'Prisoner is progressing well.' }

    // When
    const errors = validateInductionNote(inductionNote)

    // Then
    expect(errors).toStrictEqual([])
  })

  it('should validate given no induction note', () => {
    // Given
    const inductionNote: InductionNoteForm = { notes: undefined }

    // When
    const errors = validateInductionNote(inductionNote)

    // Then
    expect(errors).toStrictEqual([])
  })

  it('should validate given induction note exceeds maximum length', () => {
    // Given
    const inductionNote: InductionNoteForm = { notes: 'a'.repeat(513) }

    // When
    const errors = validateInductionNote(inductionNote)

    expect(errors).toEqual([{ href: '#notes', text: 'Induction note must be 512 characters or less' }])
  })
})
