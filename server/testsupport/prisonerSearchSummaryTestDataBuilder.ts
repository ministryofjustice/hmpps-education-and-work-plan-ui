import type { PrisonerSearchSummary } from 'viewModels'
import { startOfDay } from 'date-fns'

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
  hasCiagInduction?: boolean
  hasActionPlan?: boolean
}): PrisonerSearchSummary {
  return {
    prisonNumber: options?.prisonNumber || 'A1234BC',
    prisonId: options?.prisonId || 'BXI',
    releaseDate: options?.releaseDate === null ? null : options?.releaseDate || startOfDay('2025-12-31'),
    firstName: options?.firstName || 'Jimmy',
    lastName: options?.lastName || 'Lightfingers',
    receptionDate: options?.receptionDate === null ? null : options?.receptionDate || startOfDay('1999-08-29'),
    dateOfBirth: options?.dateOfBirth === null ? null : options?.dateOfBirth || startOfDay('1969-02-12'),
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
