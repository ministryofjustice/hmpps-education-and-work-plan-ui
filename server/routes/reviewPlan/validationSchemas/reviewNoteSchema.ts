import { z } from 'zod'
import { createSchema } from '../../routerRequestHandlers/validationMiddleware'
import { isEmpty } from '../../../validators/textValueValidator'

const reviewNoteSchema = async () => {
  const MAX_NOTES_LENGTH = 512

  const notesMandatoryMessage = 'You must add a note to this review'
  const notesMaxLengthMessage = `Review note must be ${MAX_NOTES_LENGTH} characters or less`

  return createSchema({
    notes: z //
      .string()
      .max(MAX_NOTES_LENGTH, { message: notesMaxLengthMessage })
      .nullable()
      .optional(),
  }).refine(
    ({ notes }) => {
      return !isEmpty(notes)
    },
    { path: ['notes'], message: notesMandatoryMessage },
  )
}

export default reviewNoteSchema
