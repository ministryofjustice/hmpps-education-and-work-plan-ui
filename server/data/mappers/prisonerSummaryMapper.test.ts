import { parseISO, startOfDay } from 'date-fns'
import type { Prisoner } from 'prisonerSearchApiClient'
import type { PrisonerSummary } from 'viewModels'
import aValidPrisoner from '../../testsupport/prisonerTestDataBuilder'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import toPrisonerSummary from './prisonerSummaryMapper'

describe('prisonerSummaryMapper', () => {
  it('should map to Prisoner Summary', () => {
    // Given
    const prisoner = aValidPrisoner()
    const expected = aValidPrisonerSummary()

    // When
    const actual = toPrisonerSummary(prisoner)

    // Then
    expect(actual).toEqual(expected)
  })

  it('should map to Prisoner Summary given prisoner has no release date, reception date, or DOB', () => {
    // Given
    const prisoner: Prisoner = {
      prisonerNumber: 'A1234BC',
      prisonId: 'BXI',
      releaseDate: '',
      firstName: 'IFEREECA',
      lastName: 'PEIGH',
      receptionDate: '',
      dateOfBirth: '',
      cellLocation: 'A-1-102',
      restrictedPatient: false,
      supportingPrisonId: undefined,
    }

    const expected: PrisonerSummary = {
      prisonNumber: 'A1234BC',
      prisonId: 'BXI',
      releaseDate: null,
      firstName: 'Ifereeca',
      lastName: 'Peigh',
      receptionDate: null,
      dateOfBirth: null,
      location: 'A-1-102',
      restrictedPatient: false,
      supportingPrisonId: undefined,
    }

    // When
    const actual = toPrisonerSummary(prisoner)

    // Then
    expect(actual).toEqual(expected)
  })

  it('should map to Prisoner Summary given prisoner mixed case and spaces in names', () => {
    // Given
    const prisoner: Prisoner = {
      prisonerNumber: 'A1234BC',
      prisonId: 'BXI',
      releaseDate: '2025-12-31',
      firstName: 'Ifereeca  ',
      lastName: 'PEigH ',
      receptionDate: '1999-08-29',
      dateOfBirth: '1969-02-12',
      cellLocation: 'A-1-102',
      restrictedPatient: true,
      supportingPrisonId: 'LEI',
    }

    const expected: PrisonerSummary = {
      prisonNumber: 'A1234BC',
      prisonId: 'BXI',
      releaseDate: startOfDay(parseISO('2025-12-31')),
      firstName: 'Ifereeca',
      lastName: 'Peigh',
      receptionDate: startOfDay(parseISO('1999-08-29')),
      dateOfBirth: startOfDay(parseISO('1969-02-12')),
      location: 'A-1-102',
      restrictedPatient: true,
      supportingPrisonId: 'LEI',
    }

    // When
    const actual = toPrisonerSummary(prisoner)

    // Then
    expect(actual).toEqual(expected)
  })
})
