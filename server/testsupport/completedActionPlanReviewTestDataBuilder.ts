import type { CompletedActionPlanReview, Note } from 'viewModels'
import { parseISO } from 'date-fns'
import aValidNote from './noteTestDataBuilder'

const aValidCompletedActionPlanReview = (options?: {
  reference?: string
  deadlineDate?: Date
  completedDate?: Date
  note?: Note
  conductedBy?: string
  conductedByRole?: string
  createdBy?: string
  createdByDisplayName?: string
  createdAt?: Date
  createdAtPrison?: string
}): CompletedActionPlanReview => ({
  reference: options?.reference || '814ade0a-a3b2-46a3-862f-79211ba13f7b',
  deadlineDate: options?.deadlineDate || parseISO('2024-10-15'),
  completedDate: options?.completedDate || parseISO('2024-10-01'),
  conductedBy: options?.conductedBy,
  conductedByRole: options?.conductedByRole,
  note: options?.note || aValidNote(),
  createdAt: options?.createdAt || parseISO('2023-06-19T09:39:44.000Z'),
  createdAtPrison: options?.createdAtPrison || 'Moorland (HMP & YOI)',
  createdBy: options?.createdBy || 'asmith_gen',
  createdByDisplayName: options?.createdByDisplayName || 'Alex Smith',
})

export default aValidCompletedActionPlanReview
