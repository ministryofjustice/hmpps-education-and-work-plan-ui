import { startOfDay } from 'date-fns'
import type { PrisonerSummary } from 'viewModels'

export default function aValidPrisonerSummary(options?: {
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
}): PrisonerSummary {
  return {
    prisonNumber: options?.prisonNumber || 'A1234BC',
    prisonId: options?.prisonId || 'BXI',
    releaseDate: options?.releaseDate || startOfDay('2025-12-31'),
    firstName: options?.firstName || 'Jimmy',
    lastName: options?.lastName || 'Lightfingers',
    receptionDate: options?.receptionDate || startOfDay('1999-08-29'),
    dateOfBirth: options?.dateOfBirth || startOfDay('1969-02-12'),
    location: options?.location || 'A-1-102',
    restrictedPatient: !options || options.restrictedPatient == null ? false : options.restrictedPatient,
    supportingPrisonId: options?.supportingPrisonId,
  }
}
