import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import YesNoValue from '../../../enums/yesNoValue'
import wantToAddQualificationsFormValidator from './wantToAddQualificationsFormValidator'

describe('wantToAddQualificationsFormValidator', () => {
  const prisonerSummary = aValidPrisonerSummary()

  describe('happy path - validation passes', () => {
    it(`want to add qualifications is selected`, () => {
      // Given
      const expected: Array<Record<string, string>> = []

      // When
      const actual = wantToAddQualificationsFormValidator({ wantToAddQualifications: YesNoValue.YES }, prisonerSummary)

      // Then
      expect(actual).toEqual(expected)
    })
  })

  describe('unhappy path - validation does not pass', () => {
    it(`want to add qualifications is not selected`, () => {
      // Given
      const expected: Array<Record<string, string>> = [
        {
          href: '#wantToAddQualifications',
          text: 'Select whether Ifereeca Peigh wants to record any other educational qualifications',
        },
      ]

      // When
      const actual = wantToAddQualificationsFormValidator({ wantToAddQualifications: undefined }, prisonerSummary)

      // Then
      expect(actual).toEqual(expected)
    })
  })
})
