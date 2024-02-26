import type { TypeOfWorkExperienceForm } from 'inductionForms'
import validateTypeOfWorkExperienceForm from './typeOfWorkExperienceFormValidator'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'

describe('typeOfWorkExperienceFormValidator', () => {
  const prisonerSummary = aValidPrisonerSummary()

  describe('happy path - validation passes', () => {
    Array.of<TypeOfWorkExperienceForm>(
      { typeOfWorkExperience: ['OTHER'], typeOfWorkExperienceOther: 'Gardener' },
      { typeOfWorkExperience: ['RETAIL'], typeOfWorkExperienceOther: '' },
      { typeOfWorkExperience: ['RETAIL'], typeOfWorkExperienceOther: undefined },
      { typeOfWorkExperience: ['RETAIL', 'OTHER'], typeOfWorkExperienceOther: 'Gardener' },
    ).forEach(spec => {
      it(`form data: ${JSON.stringify(spec)}`, () => {
        // Given
        const expected: Array<Record<string, string>> = []

        // When
        const actual = validateTypeOfWorkExperienceForm(spec, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      })
    })
  })

  describe('sad path - validation of typeOfWorkExperience field does not pass', () => {
    Array.of<TypeOfWorkExperienceForm>(
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
        const actual = validateTypeOfWorkExperienceForm(spec, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      })
    })
  })

  describe('sad path - validation of typeOfWorkExperienceOther field does not pass', () => {
    Array.of<TypeOfWorkExperienceForm>(
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
        const actual = validateTypeOfWorkExperienceForm(spec, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      })
    })
  })
})
