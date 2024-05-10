import moment from 'moment'
import type { PrisonerSearchSummary } from 'viewModels'

export default function aValidPrisonerSearchSummary(options?: {
  prisonNumber?: string
  prisonId?: string
  releaseDate?: string
  firstName?: string
  lastName?: string
  receptionDate?: string
  dateOfBirth?: string
  location?: string
  restrictedPatient?: boolean
  supportingPrisonId?: string
  hasCiagInduction?: boolean
  hasActionPlan?: boolean
}): PrisonerSearchSummary {
  return {
    prisonNumber: options?.prisonNumber || 'A1234BC',
    prisonId: options?.prisonId || 'BXI',
    releaseDate: options?.releaseDate === '' ? null : moment(options?.releaseDate || '2025-12-31').toDate(),
    firstName: options?.firstName || 'Jimmy',
    lastName: options?.lastName || 'Lightfingers',
    receptionDate: options?.receptionDate === '' ? null : moment(options?.receptionDate || '1999-08-29').toDate(),
    dateOfBirth: options?.dateOfBirth === '' ? null : moment(options?.dateOfBirth || '1969-02-12').toDate(),
    location: options?.location || 'A-1-102',
    restrictedPatient:
      !options || options.restrictedPatient === null || options.restrictedPatient === undefined
        ? false
        : options.restrictedPatient,
    supportingPrisonId: options?.supportingPrisonId,
    hasCiagInduction:
      !options || options.hasCiagInduction === null || options.hasCiagInduction === undefined
        ? true
        : options.hasCiagInduction,
    hasActionPlan:
      !options || options.hasActionPlan === null || options.hasActionPlan === undefined ? true : options.hasActionPlan,
  }
}
