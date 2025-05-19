import type { WorkedBeforeForm } from 'inductionForms'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import validateWorkedBeforeForm from './workedBeforeFormValidator'
import HasWorkedBeforeValue from '../../../enums/hasWorkedBeforeValue'

describe('workedBeforeFormValidator', () => {
  const prisonerSummary = aValidPrisonerSummary()

  describe('happy path - validation passes', () => {
    it.each([HasWorkedBeforeValue.YES, HasWorkedBeforeValue.NO])(
      `has worked before is selected as %s`,
      (hasWorkedBeforeValue: HasWorkedBeforeValue) => {
        // Given
        const form: WorkedBeforeForm = {
          hasWorkedBefore: hasWorkedBeforeValue,
        }

        const expected: Array<Record<string, string>> = []

        // When
        const actual = validateWorkedBeforeForm(form, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      },
    )
  })

  describe('unhappy path - validation does not pass', () => {
    it.each([undefined, null, ''])(
      `has worked before is submitted as %s`,
      (hasWorkedBeforeValue: HasWorkedBeforeValue) => {
        // Given
        const form: WorkedBeforeForm = {
          hasWorkedBefore: hasWorkedBeforeValue,
        }

        const expected: Array<Record<string, string>> = [
          { href: '#hasWorkedBefore', text: 'Select whether Ifereeca Peigh has worked before or not' },
        ]

        // When
        const actual = validateWorkedBeforeForm(form, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      },
    )

    it.each([undefined, null, ''])(
      `has worked before is NOT_RELEVANT but the reason is submitted as %s`,
      (reason?: string) => {
        // Given
        const form: WorkedBeforeForm = {
          hasWorkedBefore: HasWorkedBeforeValue.NOT_RELEVANT,
          hasWorkedBeforeNotRelevantReason: reason,
        }

        const expected: Array<Record<string, string>> = [
          { href: '#hasWorkedBeforeNotRelevantReason', text: 'Enter the reason why not relevant' },
        ]

        // When
        const actual = validateWorkedBeforeForm(form, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      },
    )

    it(`hasWorkedBeforeNotRelevantReason exceeds length`, () => {
      // Given
      const form: WorkedBeforeForm = {
        hasWorkedBeforeNotRelevantReason: 'a'.repeat(513),
        hasWorkedBefore: HasWorkedBeforeValue.NOT_RELEVANT,
      }

      const expected: Array<Record<string, string>> = [
        { href: '#hasWorkedBeforeNotRelevantReason', text: 'The reason must be 512 characters or less' },
      ]

      // When
      const actual = validateWorkedBeforeForm(form, prisonerSummary)

      // Then
      expect(actual).toEqual(expected)
    })
  })
})
