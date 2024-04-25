import type { WorkInterestTypesForm } from 'inductionForms'
import validateWorkInterestTypesForm from './workInterestTypesFormValidator'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'

describe('workInterestTypesFormValidator', () => {
  const prisonerSummary = aValidPrisonerSummary()

  describe('happy path - validation passes', () => {
    Array.of<WorkInterestTypesForm>(
      { workInterestTypes: ['OTHER'], workInterestTypesOther: 'Professional poker player' },
      { workInterestTypes: ['CLEANING_AND_MAINTENANCE'], workInterestTypesOther: '' },
      { workInterestTypes: ['CLEANING_AND_MAINTENANCE'], workInterestTypesOther: undefined },
      { workInterestTypes: ['DRIVING', 'OTHER'], workInterestTypesOther: 'Professional poker player' },
    ).forEach(spec => {
      it(`form data: ${JSON.stringify(spec)}`, () => {
        // Given
        const expected: Array<Record<string, string>> = []

        // When
        const actual = validateWorkInterestTypesForm(spec, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      })
    })
  })

  describe('sad path - validation of workInterestTypes field does not pass', () => {
    Array.of<WorkInterestTypesForm>(
      { workInterestTypes: [], workInterestTypesOther: 'Professional poker player' },
      { workInterestTypes: [], workInterestTypesOther: '' },
      { workInterestTypes: [], workInterestTypesOther: undefined },
      { workInterestTypes: ['a-non-supported-value'], workInterestTypesOther: undefined },
      { workInterestTypes: ['CLEANING'], workInterestTypesOther: undefined },
      { workInterestTypes: ['DRIVING', 'a-non-supported-value'], workInterestTypesOther: undefined },
    ).forEach(spec => {
      it(`form data: ${JSON.stringify(spec)}`, () => {
        // Given
        const expected: Array<Record<string, string>> = [
          {
            href: '#workInterestTypes',
            text: `Select the type of work Jimmy Lightfingers is interested in`,
          },
        ]

        // When
        const actual = validateWorkInterestTypesForm(spec, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      })
    })
  })

  describe('sad path - validation of workInterestTypesOther field does not pass', () => {
    Array.of<WorkInterestTypesForm>(
      { workInterestTypes: ['OTHER'], workInterestTypesOther: '' },
      { workInterestTypes: ['OTHER'], workInterestTypesOther: undefined },
      { workInterestTypes: ['DRIVING', 'OTHER'], workInterestTypesOther: '' },
      { workInterestTypes: ['DRIVING', 'OTHER'], workInterestTypesOther: undefined },
    ).forEach(spec => {
      it(`form data: ${JSON.stringify(spec)}`, () => {
        // Given
        const expected: Array<Record<string, string>> = [
          { href: '#workInterestTypesOther', text: `Enter the type of work Jimmy Lightfingers is interested in` },
        ]

        // When
        const actual = validateWorkInterestTypesForm(spec, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      })
    })
  })
})
