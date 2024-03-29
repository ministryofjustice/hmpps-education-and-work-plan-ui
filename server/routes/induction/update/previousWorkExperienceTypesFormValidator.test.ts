import type { PreviousWorkExperienceTypesForm } from 'inductionForms'
import validatePreviousWorkExperienceTypesForm from './previousWorkExperienceTypesFormValidator'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'

describe('previousWorkExperienceTypesFormValidator', () => {
  const prisonerSummary = aValidPrisonerSummary()

  describe('happy path - validation passes', () => {
    Array.of<PreviousWorkExperienceTypesForm>(
      { typeOfWorkExperience: ['OTHER'], typeOfWorkExperienceOther: 'Gardener' },
      { typeOfWorkExperience: ['RETAIL'], typeOfWorkExperienceOther: '' },
      { typeOfWorkExperience: ['RETAIL'], typeOfWorkExperienceOther: undefined },
      { typeOfWorkExperience: ['RETAIL', 'OTHER'], typeOfWorkExperienceOther: 'Gardener' },
    ).forEach(spec => {
      it(`form data: ${JSON.stringify(spec)}`, () => {
        // Given
        const expected: Array<Record<string, string>> = []

        // When
        const actual = validatePreviousWorkExperienceTypesForm(spec, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      })
    })
  })

  describe('sad path - validation of typeOfWorkExperience field does not pass', () => {
    Array.of<PreviousWorkExperienceTypesForm>(
      { typeOfWorkExperience: [], typeOfWorkExperienceOther: 'Gardener' },
      { typeOfWorkExperience: [], typeOfWorkExperienceOther: '' },
      { typeOfWorkExperience: [], typeOfWorkExperienceOther: undefined },
      { typeOfWorkExperience: ['a-non-supported-value'], typeOfWorkExperienceOther: undefined },
      { typeOfWorkExperience: ['RETA'], typeOfWorkExperienceOther: undefined },
      { typeOfWorkExperience: ['RETAIL', 'a-non-supported-value'], typeOfWorkExperienceOther: undefined },
    ).forEach(spec => {
      it(`form data: ${JSON.stringify(spec)}`, () => {
        // Given
        const expected: Array<Record<string, string>> = [
          { href: '#typeOfWorkExperience', text: 'Select the type of work Jimmy Lightfingers has done before' },
        ]

        // When
        const actual = validatePreviousWorkExperienceTypesForm(spec, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      })
    })
  })

  describe('sad path - validation of typeOfWorkExperienceOther field does not pass', () => {
    Array.of<PreviousWorkExperienceTypesForm>(
      { typeOfWorkExperience: ['OTHER'], typeOfWorkExperienceOther: '' },
      { typeOfWorkExperience: ['OTHER'], typeOfWorkExperienceOther: undefined },
      { typeOfWorkExperience: ['RETAIL', 'OTHER'], typeOfWorkExperienceOther: '' },
      { typeOfWorkExperience: ['RETAIL', 'OTHER'], typeOfWorkExperienceOther: undefined },
    ).forEach(spec => {
      it(`form data: ${JSON.stringify(spec)}`, () => {
        // Given
        const expected: Array<Record<string, string>> = [
          { href: '#typeOfWorkExperienceOther', text: 'Enter the type of work Jimmy Lightfingers has done before' },
        ]

        // When
        const actual = validatePreviousWorkExperienceTypesForm(spec, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      })
    })
  })
})
