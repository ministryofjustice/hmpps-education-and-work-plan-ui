import type { InPrisonTrainingForm } from 'inductionForms'
import validateInPrisonTrainingForm from './inPrisonTrainingFormValidator'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'

describe('inPrisonTrainingFormValidator', () => {
  const prisonerSummary = aValidPrisonerSummary()

  describe('happy path - validation passes', () => {
    Array.of<InPrisonTrainingForm>(
      { inPrisonTraining: ['OTHER'], inPrisonTrainingOther: 'Electrical work' },
      { inPrisonTraining: ['COMMUNICATION_SKILLS'], inPrisonTrainingOther: '' },
      { inPrisonTraining: ['COMMUNICATION_SKILLS'], inPrisonTrainingOther: undefined },
      { inPrisonTraining: ['COMMUNICATION_SKILLS', 'OTHER'], inPrisonTrainingOther: 'Electrical work' },
    ).forEach(spec => {
      it(`form data: ${JSON.stringify(spec)}`, () => {
        // Given
        const expected: Array<Record<string, string>> = []

        // When
        const actual = validateInPrisonTrainingForm(spec, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      })
    })
  })

  describe('sad path - validation of inPrisonTraining field does not pass', () => {
    Array.of<InPrisonTrainingForm>(
      { inPrisonTraining: [], inPrisonTrainingOther: 'Electrical work' },
      { inPrisonTraining: [], inPrisonTrainingOther: '' },
      { inPrisonTraining: [], inPrisonTrainingOther: undefined },
      { inPrisonTraining: ['a-non-supported-value'], inPrisonTrainingOther: undefined },
      { inPrisonTraining: ['COMMUNICATION'], inPrisonTrainingOther: undefined },
      { inPrisonTraining: ['COMMUNICATION_SKILLS', 'a-non-supported-value'], inPrisonTrainingOther: undefined },
    ).forEach(spec => {
      it(`form data: ${JSON.stringify(spec)}`, () => {
        // Given
        const expected: Array<Record<string, string>> = [
          {
            href: '#inPrisonTraining',
            text: `Select the type of training Jimmy Lightfingers would like to do in prison`,
          },
        ]

        // When
        const actual = validateInPrisonTrainingForm(spec, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      })
    })
  })

  describe('sad path - validation of inPrisonTrainingOther field does not pass', () => {
    Array.of<InPrisonTrainingForm>(
      { inPrisonTraining: ['OTHER'], inPrisonTrainingOther: '' },
      { inPrisonTraining: ['OTHER'], inPrisonTrainingOther: undefined },
      { inPrisonTraining: ['COMMUNICATION_SKILLS', 'OTHER'], inPrisonTrainingOther: '' },
      { inPrisonTraining: ['COMMUNICATION_SKILLS', 'OTHER'], inPrisonTrainingOther: undefined },
    ).forEach(spec => {
      it(`form data: ${JSON.stringify(spec)}`, () => {
        // Given
        const expected: Array<Record<string, string>> = [
          {
            href: '#inPrisonTrainingOther',
            text: `Enter the type of type of training Jimmy Lightfingers would like to do in prison`,
          },
        ]

        // When
        const actual = validateInPrisonTrainingForm(spec, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      })
    })
  })
})
