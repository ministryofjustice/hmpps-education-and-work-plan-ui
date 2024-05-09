import moment from 'moment'
import type { PrisonerSummary } from 'viewModels'

export default function aValidPrisonerSummary(prisonNumber = 'A1234BC', prisonId = 'BXI'): PrisonerSummary {
  return {
    prisonNumber,
    prisonId,
    releaseDate: moment('2025-12-31').toDate(),
    firstName: 'Jimmy',
    lastName: 'Lightfingers',
    receptionDate: moment('1999-08-29').toDate(),
    dateOfBirth: moment('1969-02-12').toDate(),
    location: 'A-1-102',
    restrictedPatient: false,
    supportingPrisonId: undefined,
  }
}
