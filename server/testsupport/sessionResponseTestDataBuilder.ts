import type { SessionResponse, SessionResponses } from 'educationAndWorkPlanApiClient'
import SessionTypeValue from '../enums/sessionTypeValue'

const aValidSessionResponses = (options?: { sessions?: Array<SessionResponse> }): SessionResponses => ({
  sessions: options.sessions || [aValidSessionResponse()],
})

const aValidSessionResponse = (options?: {
  reference?: string
  prisonNumber?: string
  sessionType?: string
  deadlineDate?: string
  exemptionReason?: string
  exemptionDate?: string
}): SessionResponse => ({
  reference: options?.reference || 'c88a6c48-97e2-4c04-93b5-98619966447b',
  prisonNumber: options?.prisonNumber || 'A1234BC',
  sessionType: options?.sessionType || SessionTypeValue.REVIEW,
  deadlineDate: options?.deadlineDate || '2025-02-10',
  exemptionReason: options?.exemptionReason,
  exemptionDate: options?.exemptionDate,
})

export { aValidSessionResponses, aValidSessionResponse }
