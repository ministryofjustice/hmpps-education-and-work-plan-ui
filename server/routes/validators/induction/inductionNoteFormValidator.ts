import type { InductionNoteForm } from 'inductionForms'
import formatErrors from '../../errorFormatter'

const MAX_INDUCTION_NOTE_LENGTH = 512

export default function validateInductionNote(reviewNoteForm: InductionNoteForm): Array<Record<string, string>> {
  const errors: Array<Record<string, string>> = []

  if (reviewNoteForm.notes?.length > MAX_INDUCTION_NOTE_LENGTH) {
    errors.push(...formatErrors('notes', [`Induction note must be ${MAX_INDUCTION_NOTE_LENGTH} characters or less`]))
  }

  return errors
}
