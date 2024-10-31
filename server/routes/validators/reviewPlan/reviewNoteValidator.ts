import type { ReviewNoteForm } from 'reviewPlanForms'
import formatErrors from '../../errorFormatter'

const MAX_REVIEW_NOTE_LENGTH = 512

export default function validateReviewNote(reviewNoteForm: ReviewNoteForm): Array<Record<string, string>> {
  const errors: Array<Record<string, string>> = []

  if (!reviewNoteForm.notes) {
    errors.push(...formatErrors('notes', ['You must add a note to this review']))
  } else if (reviewNoteForm.notes.length > MAX_REVIEW_NOTE_LENGTH) {
    errors.push(...formatErrors('notes', [`Review note must be ${MAX_REVIEW_NOTE_LENGTH} characters or less`]))
  }

  return errors
}