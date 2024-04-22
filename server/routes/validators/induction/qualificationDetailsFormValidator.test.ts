import type { QualificationDetailsForm } from 'inductionForms'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import validateQualificationDetailsForm from './qualificationDetailsFormValidator'
import QualificationLevelValue from '../../../enums/qualificationLevelValue'

describe('qualificationDetailsFormValidator', () => {
  const prisonerSummary = aValidPrisonerSummary()
  const qualificationLevel = QualificationLevelValue.LEVEL_3

  describe('happy path - validation passes', () => {
    Array.of<QualificationDetailsForm>(
      { qualificationSubject: 'Maths', qualificationGrade: 'A' },
      { qualificationSubject: 'English', qualificationGrade: 'A' },
    ).forEach(spec => {
      it(`form data: ${JSON.stringify(spec)}`, () => {
        // Given
        const expected: Array<Record<string, string>> = []

        // When
        const actual = validateQualificationDetailsForm(spec, qualificationLevel, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      })
    })
  })

  describe('sad path - qualificationSubject field not provided', () => {
    Array.of<QualificationDetailsForm>(
      { qualificationSubject: '', qualificationGrade: 'A' },
      { qualificationSubject: undefined, qualificationGrade: 'A' },
      { qualificationSubject: null, qualificationGrade: 'A' },
    ).forEach(spec => {
      it(`form data: ${JSON.stringify(spec)}`, () => {
        // Given
        const expected: Array<Record<string, string>> = [
          { href: '#qualificationSubject', text: "Enter the subject of Jimmy Lightfingers's level 3 qualification" },
        ]

        // When
        const actual = validateQualificationDetailsForm(spec, qualificationLevel, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      })
    })
  })

  describe('sad path - qualificationSubject exceeds length', () => {
    Array.of<QualificationDetailsForm>({ qualificationSubject: 'a'.repeat(101), qualificationGrade: 'A' }).forEach(
      spec => {
        it(`form data: ${JSON.stringify(spec)}`, () => {
          // Given
          const expected: Array<Record<string, string>> = [
            { href: '#qualificationSubject', text: 'Subject must be 100 characters or less' },
          ]

          // When
          const actual = validateQualificationDetailsForm(spec, qualificationLevel, prisonerSummary)

          // Then
          expect(actual).toEqual(expected)
        })
      },
    )
  })

  describe('sad path - qualificationGrade field not provided', () => {
    Array.of<QualificationDetailsForm>(
      { qualificationSubject: 'English', qualificationGrade: '' },
      { qualificationSubject: 'English', qualificationGrade: undefined },
      { qualificationSubject: 'English', qualificationGrade: null },
    ).forEach(spec => {
      it(`form data: ${JSON.stringify(spec)}`, () => {
        // Given
        const expected: Array<Record<string, string>> = [
          { href: '#qualificationGrade', text: "Enter the grade of Jimmy Lightfingers's level 3 qualification" },
        ]

        // When
        const actual = validateQualificationDetailsForm(spec, qualificationLevel, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      })
    })
  })

  describe('sad path - qualificationGrade exceeds length', () => {
    Array.of<QualificationDetailsForm>({
      qualificationSubject: 'English',
      qualificationGrade: 'a'.repeat(51),
    }).forEach(spec => {
      it(`form data: ${JSON.stringify(spec)}`, () => {
        // Given
        const expected: Array<Record<string, string>> = [
          { href: '#qualificationGrade', text: 'Grade must be 50 characters or less' },
        ]

        // When
        const actual = validateQualificationDetailsForm(spec, qualificationLevel, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      })
    })
  })
})
