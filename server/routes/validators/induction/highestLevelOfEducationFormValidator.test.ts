import type { HighestLevelOfEducationForm } from 'forms'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import validateHighestLevelOfEducationForm from './highestLevelOfEducationFormValidator'

describe('highestLevelOfEducationFormValidator', () => {
  const prisonerSummary = aValidPrisonerSummary()

  describe('happy path - validation passes', () => {
    Array.of<HighestLevelOfEducationForm>(
      { educationLevel: 'PRIMARY_SCHOOL' },
      { educationLevel: 'SECONDARY_SCHOOL_LEFT_BEFORE_TAKING_EXAMS' },
      { educationLevel: 'SECONDARY_SCHOOL_TOOK_EXAMS' },
      { educationLevel: 'FURTHER_EDUCATION_COLLEGE' },
      { educationLevel: 'UNDERGRADUATE_DEGREE_AT_UNIVERSITY' },
      { educationLevel: 'POSTGRADUATE_DEGREE_AT_UNIVERSITY' },
      { educationLevel: 'NOT_SURE' },
    ).forEach(spec => {
      it(`form data: ${JSON.stringify(spec)}`, () => {
        // Given
        const expected: Array<Record<string, string>> = []

        // When
        const actual = validateHighestLevelOfEducationForm(spec, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      })
    })
  })

  describe('sad path - validation of affectAbilityToWork field does not pass', () => {
    Array.of<HighestLevelOfEducationForm>(
      { educationLevel: 'a-non-supported-value' },
      { educationLevel: 'PRIMARY' },
      { educationLevel: null },
      { educationLevel: undefined },
      { educationLevel: '' },
    ).forEach(spec => {
      it(`form data: ${JSON.stringify(spec)}`, () => {
        // Given
        const expected: Array<Record<string, string>> = [
          {
            href: '#educationLevel',
            text: `Select Ifereeca Peigh's highest level of education`,
          },
        ]

        // When
        const actual = validateHighestLevelOfEducationForm(spec, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      })
    })
  })
})
