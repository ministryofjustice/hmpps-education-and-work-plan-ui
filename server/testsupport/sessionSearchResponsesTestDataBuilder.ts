import type { SessionSearchResponse, SessionSearchResponses } from 'educationAndWorkPlanApiClient'
import SessionTypeValue from '../enums/sessionTypeValue'

const aSessionSearchResponses = (options?: {
  totalElements?: number
  totalPages?: number
  page?: number
  last?: boolean
  first?: boolean
  pageSize?: number
  sessions?: Array<SessionSearchResponse>
}): SessionSearchResponses => ({
  pagination: {
    totalElements: options?.totalElements === 0 ? 0 : options?.totalElements || 1,
    totalPages: options?.totalPages === 0 ? 0 : options?.totalPages || 1,
    page: options?.page === 0 ? 0 : options?.page || 1,
    last: options?.last !== false,
    first: options?.first !== false,
    pageSize: options?.pageSize || 50,
  },
  sessions: options?.sessions || [aSessionSearchResponse()],
})

const aSessionSearchResponse = (options?: {
  forename?: string
  surname?: string
  prisonNumber?: string
  dateOfBirth?: string
  cellLocation?: string
  sessionType?: SessionTypeValue
  releaseDate?: string
  exemptionReason?: string
  exemptionDate?: string
  deadlineDate?: string
}): SessionSearchResponse => ({
  forename: options?.forename || 'IFEREECA',
  surname: options?.surname || 'PEIGH',
  prisonNumber: options?.prisonNumber || 'A1234BC',
  dateOfBirth: options?.dateOfBirth || '1969-02-12',
  cellLocation: options?.cellLocation || 'A-1-102',
  releaseDate: options?.releaseDate === null ? null : options?.releaseDate || '2025-12-31',
  sessionType: options?.sessionType || SessionTypeValue.REVIEW,
  deadlineDate: options?.deadlineDate || '2025-02-10',
  exemptionReason: options?.exemptionReason,
  exemptionDate: options?.exemptionDate,
})

export { aSessionSearchResponses, aSessionSearchResponse }
