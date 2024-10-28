import type { ReviewNoteForm } from 'reviewPlanForms'
import formatErrors from '../../errorFormatter'

export default function validateReviewNote(reviewNoteForm: ReviewNoteForm): Array<Record<string, string>> {
  const errors: Array<Record<string, string>> = []

  if (!reviewNoteForm.notes) {
    errors.push(...formatErrors('notes', ['You must add a note to this review']))
  }

  return errors
}
