import type { AdditionalTrainingForm } from 'inductionForms'
import validateAdditionalTrainingForm from './additionalTrainingFormValidator'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'

describe('additionalTrainingFormValidator', () => {
  const prisonerSummary = aValidPrisonerSummary()

  describe('happy path - validation passes', () => {
    Array.of<AdditionalTrainingForm>(
      { additionalTraining: ['OTHER'], additionalTrainingOther: 'Fire Safety Course' },
      { additionalTraining: ['CSCS_CARD'], additionalTrainingOther: '' },
      { additionalTraining: ['CSCS_CARD'], additionalTrainingOther: undefined },
      { additionalTraining: ['CSCS_CARD', 'OTHER'], additionalTrainingOther: 'Fire Safety Course' },
      { additionalTraining: ['NONE'], additionalTrainingOther: '' },
    ).forEach(spec => {
      it(`form data: ${JSON.stringify(spec)}`, () => {
        // Given
        const expected: Array<Record<string, string>> = []

        // When
        const actual = validateAdditionalTrainingForm(spec, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      })
    })
  })

  describe('sad path - validation of additionalTraining field does not pass', () => {
    Array.of<AdditionalTrainingForm>(
      { additionalTraining: [], additionalTrainingOther: 'Fire Safety Course' },
      { additionalTraining: [], additionalTrainingOther: '' },
      { additionalTraining: [], additionalTrainingOther: undefined },
      { additionalTraining: ['a-non-supported-value'], additionalTrainingOther: undefined },
      { additionalTraining: ['CSCS'], additionalTrainingOther: undefined },
      { additionalTraining: ['CSCS_CARD', 'a-non-supported-value'], additionalTrainingOther: undefined },
      { additionalTraining: ['CSCS_CARD', 'NONE'], additionalTrainingOther: undefined },
    ).forEach(spec => {
      it(`form data: ${JSON.stringify(spec)}`, () => {
        // Given
        const expected: Array<Record<string, string>> = [
          {
            href: '#additionalTraining',
            text: `Select the type of training or vocational qualification Jimmy Lightfingers has`,
          },
        ]

        // When
        const actual = validateAdditionalTrainingForm(spec, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      })
    })
  })

  describe('sad path - validation of additionalTrainingOther field does not pass', () => {
    Array.of<AdditionalTrainingForm>(
      { additionalTraining: ['OTHER'], additionalTrainingOther: '' },
      { additionalTraining: ['OTHER'], additionalTrainingOther: undefined },
      { additionalTraining: ['CSCS_CARD', 'OTHER'], additionalTrainingOther: '' },
      { additionalTraining: ['CSCS_CARD', 'OTHER'], additionalTrainingOther: undefined },
    ).forEach(spec => {
      it(`form data: ${JSON.stringify(spec)}`, () => {
        // Given
        const expected: Array<Record<string, string>> = [
          {
            href: '#additionalTrainingOther',
            text: `Enter the type of training or vocational qualification Jimmy Lightfingers has`,
          },
        ]

        // When
        const actual = validateAdditionalTrainingForm(spec, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      })
    })
  })
})
