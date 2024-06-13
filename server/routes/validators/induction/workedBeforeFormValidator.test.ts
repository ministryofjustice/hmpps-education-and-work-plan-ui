import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import validateWorkedBeforeForm from './workedBeforeFormValidator'
import HasWorkedBeforeValue from '../../../enums/hasWorkedBeforeValue'

describe('workedBeforeFormValidator', () => {
  const prisonerSummary = aValidPrisonerSummary()

  describe('happy path - validation passes', () => {
    it(`has worked before is selected`, () => {
      // Given
      const expected: Array<Record<string, string>> = []

      // When
      const actual = validateWorkedBeforeForm({ hasWorkedBefore: HasWorkedBeforeValue.YES }, prisonerSummary)

      // Then
      expect(actual).toEqual(expected)
    })
  })

  describe('unhappy path - validation does not pass', () => {
    it(`has worked before is not selected`, () => {
      // Given
      const expected: Array<Record<string, string>> = [
        { href: '#hasWorkedBefore', text: 'Select whether Jimmy Lightfingers has worked before or not' },
      ]

      // When
      const actual = validateWorkedBeforeForm({ hasWorkedBefore: undefined }, prisonerSummary)

      // Then
      expect(actual).toEqual(expected)
    })
  })
})
