import { parseISO, startOfDay } from 'date-fns'
import type { Prisoner } from 'prisonerSearchApiClient'
import type { PrisonerSummary } from 'viewModels'

export default function toPrisonerSummary(prisoner: Prisoner): PrisonerSummary {
  return {
    prisonNumber: prisoner.prisonerNumber,
    prisonId: prisoner.prisonId,
    releaseDate: prisoner.releaseDate ? startOfDay(parseISO(prisoner.releaseDate)) : null,
    firstName: capitalize(prisoner.firstName),
    lastName: capitalize(prisoner.lastName),
    receptionDate: prisoner.receptionDate ? startOfDay(parseISO(prisoner.receptionDate)) : null,
    dateOfBirth: prisoner.dateOfBirth ? startOfDay(parseISO(prisoner.dateOfBirth)) : null,
    location: prisoner.cellLocation,
    restrictedPatient: prisoner.restrictedPatient,
    supportingPrisonId: prisoner.supportingPrisonId,
  }
}

// Trim whitespace from a name string and capitalize the first letter and lowercase the rest of the string
const capitalize = (name: string): string => {
  const trimmedLowercaseName = name.trim().toLowerCase()
  return trimmedLowercaseName.charAt(0).toUpperCase() + trimmedLowercaseName.slice(1)
}
