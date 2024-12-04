import { parseISO } from 'date-fns'
import type { Note } from 'viewModels'
import NoteTypeValue from '../enums/noteTypeValue'

const aValidNote = (options?: {
  reference?: string
  content?: string
  type?: NoteTypeValue
  createdBy?: string
  createdByDisplayName?: string
  createdAt?: Date
  createdAtPrisonName?: string
  updatedBy?: string
  updatedByDisplayName?: string
  updatedAt?: Date
  updatedAtPrisonName?: string
}): Note => ({
  reference: options?.reference || '8092b80e-4d60-418f-983a-da457ff8df40',
  content: options?.content || 'Review went well and goals on target for completion',
  type: options?.type || NoteTypeValue.REVIEW,
  createdAt: options?.createdAt || parseISO('2023-01-16T09:34:12.453Z'),
  createdBy: options?.createdBy || 'asmith_gen',
  createdByDisplayName: options?.createdByDisplayName || 'Alex Smith',
  createdAtPrisonName: options?.createdAtPrisonName || 'Brixton (HMP)',
  updatedAt: options?.updatedAt || parseISO('2023-09-23T13:42:01.401Z'),
  updatedBy: options?.updatedBy || 'asmith_gen',
  updatedByDisplayName: options?.updatedByDisplayName || 'Alex Smith',
  updatedAtPrisonName: options?.updatedAtPrisonName || 'Brixton (HMP)',
})

export default aValidNote
