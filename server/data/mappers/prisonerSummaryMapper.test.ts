import moment from 'moment'
import type { Prisoner } from 'prisonRegisterApiClient'
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
      firstName: 'JIMMY',
      lastName: 'LIGHTFINGERS',
      receptionDate: '',
      dateOfBirth: '',
    }

    const expected: PrisonerSummary = {
      prisonNumber: 'A1234BC',
      prisonId: 'BXI',
      releaseDate: null,
      firstName: 'Jimmy',
      lastName: 'Lightfingers',
      receptionDate: null,
      dateOfBirth: null,
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
      firstName: ' Jimmy  ',
      lastName: '  LIGHTFinGerS ',
      receptionDate: '1999-08-29',
      dateOfBirth: '1969-02-12',
    }

    const expected: PrisonerSummary = {
      prisonNumber: 'A1234BC',
      prisonId: 'BXI',
      releaseDate: moment('2025-12-31').toDate(),
      firstName: 'Jimmy',
      lastName: 'Lightfingers',
      receptionDate: moment('1999-08-29').toDate(),
      dateOfBirth: moment('1969-02-12').toDate(),
    }

    // When
    const actual = toPrisonerSummary(prisoner)

    // Then
    expect(actual).toEqual(expected)
  })
})
