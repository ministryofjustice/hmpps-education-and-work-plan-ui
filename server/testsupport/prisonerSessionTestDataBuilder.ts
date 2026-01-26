import { startOfDay } from 'date-fns'
import type { PrisonerSession, Sessions } from 'viewModels'
import SessionTypeValue from '../enums/sessionTypeValue'
import InductionExemptionReasonValue from '../enums/inductionExemptionReasonValue'
import ReviewPlanExemptionReasonValue from '../enums/reviewPlanExemptionReasonValue'

const aValidSessions = (options?: {
  sessions?: Array<PrisonerSession>
  problemRetrievingData?: boolean
}): Sessions => ({
  sessions: options?.sessions || [aValidPrisonerSession()],
  problemRetrievingData: !options || options.problemRetrievingData == null ? false : options.problemRetrievingData,
})

const aValidPrisonerSession = (options?: {
  prisonNumber?: string
  reference?: string
  releaseDate?: Date
  firstName?: string
  lastName?: string
  location?: string
  sessionType?: SessionTypeValue
  deadlineDate?: Date
  exemption?: {
    exemptionReason: InductionExemptionReasonValue | ReviewPlanExemptionReasonValue
    exemptionDate: Date
  }
}): PrisonerSession => ({
  prisonNumber: options?.prisonNumber || 'A1234BC',
  reference: options?.reference === null ? null : options?.reference || 'c88a6c48-97e2-4c04-93b5-98619966447b',
  releaseDate: options?.releaseDate === null ? null : options?.releaseDate || startOfDay('2025-12-31'),
  firstName: options?.firstName === null ? null : options?.firstName || 'Ifereeca',
  lastName: options?.lastName === null ? null : options?.lastName || 'Peigh',
  location: options?.location === null ? null : options?.location || 'A-1-102',
  sessionType: options?.sessionType || SessionTypeValue.REVIEW,
  deadlineDate: options?.deadlineDate || startOfDay('2025-02-10'),
  exemption: options?.exemption,
})

export { aValidSessions, aValidPrisonerSession }
