import type { PrisonerSearchSummary } from 'viewModels'
import { startOfDay } from 'date-fns'
import SearchPlanStatus from '../enums/searchPlanStatus'

export default function aValidPrisonerSearchSummary(options?: {
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
  /**
   * @deprecated field
   */
  hasCiagInduction?: boolean
  /**
   * @deprecated field
   */
  hasActionPlan?: boolean
  planStatus?: SearchPlanStatus
}): PrisonerSearchSummary {
  return {
    prisonNumber: options?.prisonNumber || 'A1234BC',
    prisonId: options?.prisonId || 'BXI',
    releaseDate: options?.releaseDate === null ? null : options?.releaseDate || startOfDay('2025-12-31'),
    firstName: options?.firstName || 'Ifereeca',
    lastName: options?.lastName || 'Peigh',
    receptionDate: options?.receptionDate === null ? null : options?.receptionDate || startOfDay('1999-08-29'),
    dateOfBirth: options?.dateOfBirth === null ? null : options?.dateOfBirth || startOfDay('1969-02-12'),
    location: options?.location || 'A-1-102',
    restrictedPatient: options?.restrictedPatient === null ? null : options?.restrictedPatient === true,
    supportingPrisonId: options?.supportingPrisonId === null ? null : options?.supportingPrisonId,
    planStatus: options?.planStatus || SearchPlanStatus.ACTIVE_PLAN,
    hasCiagInduction: options?.hasCiagInduction === null ? null : options?.hasCiagInduction === true,
    hasActionPlan: options?.hasActionPlan === null ? null : options?.hasActionPlan === true,
  }
}
