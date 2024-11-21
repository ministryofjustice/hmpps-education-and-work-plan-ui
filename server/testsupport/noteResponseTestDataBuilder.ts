import type { NoteResponse } from 'educationAndWorkPlanApiClient'
import NoteTypeValue from '../enums/noteTypeValue'

const aValidNoteResponse = (
  options?: CoreBuilderOptions & {
    content?: string
    type?: NoteTypeValue
  },
): NoteResponse => ({
  ...baseNoteResponseTemplate(options),
  content: options?.content || 'Prisoner is not good at listening',
  type: options?.type || NoteTypeValue.GOAL,
})

type CoreBuilderOptions = {
  prisonNumber?: string
  createdBy?: string
  createdByDisplayName?: string
  createdAt?: string
  createdAtPrison?: string
  updatedBy?: string
  updatedByDisplayName?: string
  updatedAt?: string
  updatedAtPrison?: string
}

const baseNoteResponseTemplate = (options?: CoreBuilderOptions): NoteResponse => ({
  reference: '8092b80e-4d60-418f-983a-da457ff8df40',
  ...auditFields(options),
  content: undefined,
  type: undefined,
})

const auditFields = (
  options?: CoreBuilderOptions,
): {
  createdBy: string
  createdByDisplayName: string
  createdAt: string
  createdAtPrison: string
  updatedBy: string
  updatedByDisplayName: string
  updatedAt: string
  updatedAtPrison: string
} => ({
  createdBy: options?.createdBy || 'asmith_gen',
  createdByDisplayName: options?.createdByDisplayName || 'Alex Smith',
  createdAt: options?.createdAt || '2023-01-16T09:34:12.453Z',
  createdAtPrison: options?.createdAtPrison || 'BXI',
  updatedBy: options?.updatedBy || 'asmith_gen',
  updatedByDisplayName: options?.updatedByDisplayName || 'Alex Smith',
  updatedAt: options?.updatedAt || '2023-09-23T13:42:01.401Z',
  updatedAtPrison: options?.updatedAtPrison || 'BXI',
})

export default aValidNoteResponse
