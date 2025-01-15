import { format, startOfDay } from 'date-fns'
import type { CompletedActionPlanReviewResponse, NoteResponse } from 'educationAndWorkPlanApiClient'
import aValidNoteResponse from './noteResponseTestDataBuilder'
import NoteTypeValue from '../enums/noteTypeValue'

const aValidCompletedActionPlanReviewResponse = (
  options?: CoreBuilderOptions & {
    deadlineDate?: Date
    completedDate?: Date
    note?: NoteResponse
    conductedBy?: string
    conductedByRole?: string
    preRelease?: boolean
  },
): CompletedActionPlanReviewResponse => ({
  ...baseCompletedActionPlanReviewResponseTemplate(options),
  deadlineDate: options?.deadlineDate ? format(startOfDay(options.deadlineDate), 'yyyy-MM-dd') : '2024-10-15',
  completedDate: options?.completedDate ? format(startOfDay(options.completedDate), 'yyyy-MM-dd') : '2024-10-01',
  note:
    options?.note ||
    aValidNoteResponse({
      type: NoteTypeValue.REVIEW,
      content: 'Review went well and goals on target for completion',
    }),
  conductedBy: options?.conductedBy,
  conductedByRole: options?.conductedByRole,
  preRelease: !options || options.preRelease == null ? false : options.preRelease,
})

type CoreBuilderOptions = {
  createdBy?: string
  createdByDisplayName?: string
  createdAt?: string
  createdAtPrison?: string
}

const baseCompletedActionPlanReviewResponseTemplate = (
  options?: CoreBuilderOptions,
): CompletedActionPlanReviewResponse => ({
  reference: '814ade0a-a3b2-46a3-862f-79211ba13f7b',
  ...auditFields(options),
  deadlineDate: undefined,
  completedDate: undefined,
  note: undefined,
  conductedBy: undefined,
  conductedByRole: undefined,
})

const auditFields = (
  options?: CoreBuilderOptions,
): {
  createdBy: string
  createdByDisplayName: string
  createdAt: string
  createdAtPrison: string
} => ({
  createdBy: options?.createdBy || 'asmith_gen',
  createdByDisplayName: options?.createdByDisplayName || 'Alex Smith',
  createdAt: options?.createdAt || '2023-06-19T09:39:44Z',
  createdAtPrison: options?.createdAtPrison || 'MDI',
})

export default aValidCompletedActionPlanReviewResponse
