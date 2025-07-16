import { z } from 'zod'
import { createSchema } from '../../routerRequestHandlers/validationMiddleware'

const inductionNoteSchema = async () => {
  const MAX_NOTES_LENGTH = 512
  const notesMaxLengthMessage = `Induction note must be ${MAX_NOTES_LENGTH} characters or less`

  return createSchema({
    notes: z //
      .string()
      .max(MAX_NOTES_LENGTH, { message: notesMaxLengthMessage })
      .optional()
      .nullable(),
  })
}

export default inductionNoteSchema
