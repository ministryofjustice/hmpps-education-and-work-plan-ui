import type { PrisonerSummary } from 'viewModels'

export default function aValidPrisonerSummary(prisonNumber = 'A1234BC', prisonId = 'BXI'): PrisonerSummary {
  return {
    prisonNumber,
    prisonId,
    releaseDate: '2025-12-31',
    firstName: 'Jimmy',
    lastName: 'Lightfingers',
    receptionDate: '1999-08-29',
    dateOfBirth: '1969-02-12',
  }
}
