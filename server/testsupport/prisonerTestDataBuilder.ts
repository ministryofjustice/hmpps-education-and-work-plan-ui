import type { Prisoner } from 'prisonRegisterApiClient'

export default function aValidPrisoner(prisonNumber = 'A1234BC', prisonId = 'BXI'): Prisoner {
  return {
    prisonerNumber: prisonNumber,
    prisonId,
    releaseDate: '2025-12-31',
    firstName: 'JIMMY',
    lastName: 'LIGHTFINGERS',
    receptionDate: '1999-08-29',
    dateOfBirth: '1969-02-12',
  }
}
