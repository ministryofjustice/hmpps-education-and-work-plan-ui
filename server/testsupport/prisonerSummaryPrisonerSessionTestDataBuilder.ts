import type { PrisonerSummaryPrisonerSession } from 'viewModels'
import { startOfDay } from 'date-fns'
import SessionTypeValue from '../enums/sessionTypeValue'
import InductionExemptionReasonValue from '../enums/inductionExemptionReasonValue'
import ReviewPlanExemptionReasonValue from '../enums/reviewPlanExemptionReasonValue'

export default function aValidPrisonerSummaryPrisonerSession(options?: {
  prisonNumber?: string
  prisonId?: string
  releaseDate?: Date
  firstName?: string
  lastName?: string
  receptionDate?: Date
  dateOfBirth?: Date
  location?: string
  restrictedPatient?: boolean
  supportingPrisonId?: string
  reference?: string
  sessionType?: SessionTypeValue
  deadlineDate?: Date
  exemption?: {
    exemptionReason: InductionExemptionReasonValue | ReviewPlanExemptionReasonValue
    exemptionDate: Date
  }
}): PrisonerSummaryPrisonerSession {
  return {
    prisonNumber: options?.prisonNumber || 'A1234BC',
    prisonId: options?.prisonId || 'BXI',
    releaseDate: options?.releaseDate !== null ? options?.releaseDate || startOfDay('2025-12-31') : null,
    firstName: options?.firstName || 'Jimmy',
    lastName: options?.lastName || 'Lightfingers',
    receptionDate: options?.receptionDate !== null ? options?.receptionDate || startOfDay('1999-08-29') : null,
    dateOfBirth: options?.dateOfBirth !== null ? options?.dateOfBirth || startOfDay('1969-02-12') : null,
    location: options?.location || 'A-1-102',
    restrictedPatient:
      !options || options.restrictedPatient === null || options.restrictedPatient === undefined
        ? false
        : options.restrictedPatient,
    supportingPrisonId: options?.supportingPrisonId,
    reference: options?.reference || 'c88a6c48-97e2-4c04-93b5-98619966447b',
    sessionType: options?.sessionType || SessionTypeValue.REVIEW,
    deadlineDate: options?.deadlineDate || startOfDay('2025-02-10'),
    exemption: options?.exemption,
  }
}
