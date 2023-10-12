import type { Prisoner } from 'prisonRegisterApiClient'
import type { PrisonerSummary } from 'viewModels'
import moment from 'moment/moment'

export default function toPrisonerSummary(prisoner: Prisoner): PrisonerSummary {
  return {
    prisonNumber: prisoner.prisonerNumber,
    prisonId: prisoner.prisonId,
    releaseDate: prisoner.releaseDate ? moment(prisoner.releaseDate, 'YYYY-MM-DD').toDate() : null,
    firstName: capitalize(prisoner.firstName),
    lastName: capitalize(prisoner.lastName),
    receptionDate: prisoner.receptionDate ? moment(prisoner.receptionDate, 'YYYY-MM-DD').toDate() : null,
    dateOfBirth: prisoner.dateOfBirth ? moment(prisoner.dateOfBirth, 'YYYY-MM-DD').toDate() : null,
    location: prisoner.cellLocation,
  }
}

// Trim whitespace from a name string and capitalize the first letter and lowercase the rest of the string
const capitalize = (name: string): string => {
  const trimmedLowercaseName = name.trim().toLowerCase()
  return trimmedLowercaseName.charAt(0).toUpperCase() + trimmedLowercaseName.slice(1)
}
