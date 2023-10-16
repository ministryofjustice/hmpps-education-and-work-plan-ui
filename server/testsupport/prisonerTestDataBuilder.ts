import type { Prisoner } from 'prisonRegisterApiClient'

export default function aValidPrisoner(options?: {
  prisonNumber?: string
  prisonId?: string
  releaseDate?: string
  firstName?: string
  lastName?: string
  receptionDate?: string
  dateOfBirth?: string
  cellLocation?: string
}): Prisoner {
  return {
    prisonerNumber: options?.prisonNumber || 'A1234BC',
    prisonId: options?.prisonId || 'BXI',
    releaseDate: options?.releaseDate || '2025-12-31',
    firstName: options?.firstName || 'JIMMY',
    lastName: options?.lastName || 'LIGHTFINGERS',
    receptionDate: options?.receptionDate || '1999-08-29',
    dateOfBirth: options?.dateOfBirth || '1969-02-12',
    cellLocation: options?.cellLocation || 'A-1-102',
  }
}
