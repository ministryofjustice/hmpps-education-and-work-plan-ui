import type { QualificationLevelForm } from 'forms'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import validateQualificationLevelForm from './qualificationLevelFormValidator'

describe('qualificationLevelFormValidator', () => {
  const prisonerSummary = aValidPrisonerSummary()

  describe('happy path - validation passes', () => {
    Array.of<QualificationLevelForm>({ qualificationLevel: 'ENTRY_LEVEL' }, { qualificationLevel: 'LEVEL_3' }).forEach(
      spec => {
        it(`form data: ${JSON.stringify(spec)}`, () => {
          // Given
          const expected: Array<Record<string, string>> = []

          // When
          const actual = validateQualificationLevelForm(spec, prisonerSummary)

          // Then
          expect(actual).toEqual(expected)
        })
      },
    )
  })

  describe('sad path - qualificationLevel field not provided', () => {
    Array.of<QualificationLevelForm>(
      { qualificationLevel: '' },
      { qualificationLevel: undefined },
      { qualificationLevel: null },
    ).forEach(spec => {
      it(`form data: ${JSON.stringify(spec)}`, () => {
        // Given
        const expected: Array<Record<string, string>> = [
          { href: '#qualificationLevel', text: 'Select the level of qualification Ifereeca Peigh wants to add' },
        ]

        // When
        const actual = validateQualificationLevelForm(spec, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      })
    })
  })
})
