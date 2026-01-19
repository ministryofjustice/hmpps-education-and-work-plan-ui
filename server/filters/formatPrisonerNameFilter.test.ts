import aValidPrisonerSummary from '../testsupport/prisonerSummaryTestDataBuilder'
import formatPrisonerNameFilter, { NameFormat } from './formatPrisonerNameFilter'

describe('formatPrisonerNameFilter', () => {
  const prisonSummary = aValidPrisonerSummary({
    firstName: ' Ifereeca  ',
    lastName: '  Peigh ',
  })

  it.each([
    { format: 'FIRST_NAME_ONLY', expected: 'IFEREECA' },
    { format: 'LAST_NAME_ONLY', expected: 'PEIGH' },
    { format: 'FIRST_NAME_LAST_NAME', expected: 'IFEREECA PEIGH' },
    { format: 'LAST_NAME_FIRST_NAME', expected: 'PEIGH IFEREECA' },
    { format: 'FIRST_NAME_COMMA_LAST_NAME', expected: 'IFEREECA, PEIGH' },
    { format: 'LAST_NAME_COMMA_FIRST_NAME', expected: 'PEIGH, IFEREECA' },
    { format: 'First_name_only', expected: 'Ifereeca' },
    { format: 'Last_name_only', expected: 'Peigh' },
    { format: 'First_name_Last_name', expected: 'Ifereeca Peigh' },
    { format: 'Last_name_First_name', expected: 'Peigh Ifereeca' },
    { format: 'First_name_comma_Last_name', expected: 'Ifereeca, Peigh' },
    { format: 'Last_name_comma_First_name', expected: 'Peigh, Ifereeca' },
    { format: 'unknown format', expected: undefined },
  ])(`it should format the name using format $format`, spec => {
    // Given

    // When
    const actual = formatPrisonerNameFilter(spec.format as NameFormat)(prisonSummary)

    // Then
    expect(actual).toEqual(spec.expected)
  })
})
