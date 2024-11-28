import { startOfDay } from 'date-fns'
import type { PrisonerSummary } from 'viewModels'

export default function aValidPrisonerSummary(prisonNumber = 'A1234BC', prisonId = 'BXI'): PrisonerSummary {
  return {
    prisonNumber,
    prisonId,
    releaseDate: startOfDay('2025-12-31'),
    firstName: 'Jimmy',
    lastName: 'Lightfingers',
    receptionDate: startOfDay('1999-08-29'),
    dateOfBirth: startOfDay('1969-02-12'),
    location: 'A-1-102',
    restrictedPatient: false,
    supportingPrisonId: undefined,
  }
}
