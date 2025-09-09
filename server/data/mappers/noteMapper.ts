import { parseISO } from 'date-fns'
import type { NoteResponse } from 'educationAndWorkPlanApiClient'
import type { Note } from 'viewModels'
import NoteTypeValue from '../../enums/noteTypeValue'

const toNote = (noteResponse: NoteResponse, prisonNamesById: Record<string, string>): Note => ({
  reference: noteResponse.reference,
  content: noteResponse.content,
  type: noteResponse.type as NoteTypeValue,
  createdBy: noteResponse.createdBy,
  createdByDisplayName: noteResponse.createdByDisplayName,
  createdAt: parseISO(noteResponse.createdAt),
  createdAtPrisonName: prisonNamesById[noteResponse.createdAtPrison] || noteResponse.createdAtPrison,
  updatedBy: noteResponse.updatedBy,
  updatedByDisplayName: noteResponse.updatedByDisplayName,
  updatedAt: parseISO(noteResponse.updatedAt),
  updatedAtPrisonName: prisonNamesById[noteResponse.updatedAtPrison] || noteResponse.updatedAtPrison,
})

export default toNote
