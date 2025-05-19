import type { InPrisonWorkForm } from 'inductionForms'
import validateInPrisonWorkForm from './inPrisonWorkFormValidator'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'

describe('inPrisonWorkFormValidator', () => {
  const prisonerSummary = aValidPrisonerSummary()

  describe('happy path - validation passes', () => {
    Array.of<InPrisonWorkForm>(
      { inPrisonWork: ['OTHER'], inPrisonWorkOther: 'Gardener' },
      { inPrisonWork: ['PRISON_LAUNDRY'], inPrisonWorkOther: '' },
      { inPrisonWork: ['PRISON_LAUNDRY'], inPrisonWorkOther: undefined },
      { inPrisonWork: ['PRISON_LAUNDRY', 'OTHER'], inPrisonWorkOther: 'Gardener' },
    ).forEach(spec => {
      it(`form data: ${JSON.stringify(spec)}`, () => {
        // Given
        const expected: Array<Record<string, string>> = []

        // When
        const actual = validateInPrisonWorkForm(spec, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      })
    })
  })

  describe('sad path - validation of inPrisonWork field does not pass', () => {
    Array.of<InPrisonWorkForm>(
      { inPrisonWork: [], inPrisonWorkOther: 'Gardener' },
      { inPrisonWork: [], inPrisonWorkOther: '' },
      { inPrisonWork: [], inPrisonWorkOther: undefined },
      { inPrisonWork: ['a-non-supported-value'], inPrisonWorkOther: undefined },
      { inPrisonWork: ['PRISON_L'], inPrisonWorkOther: undefined },
      { inPrisonWork: ['PRISON_LAUNDRY', 'a-non-supported-value'], inPrisonWorkOther: undefined },
    ).forEach(spec => {
      it(`form data: ${JSON.stringify(spec)}`, () => {
        // Given
        const expected: Array<Record<string, string>> = [
          { href: '#inPrisonWork', text: 'Select the type of work Ifereeca Peigh would like to do in prison' },
        ]

        // When
        const actual = validateInPrisonWorkForm(spec, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      })
    })
  })

  describe('sad path - inPrisonWorkOther field does not exist given inPrisonWork includes OTHER', () => {
    Array.of<InPrisonWorkForm>(
      { inPrisonWork: ['OTHER'], inPrisonWorkOther: '' },
      { inPrisonWork: ['OTHER'], inPrisonWorkOther: undefined },
      { inPrisonWork: ['PRISON_LAUNDRY', 'OTHER'], inPrisonWorkOther: '' },
      { inPrisonWork: ['PRISON_LAUNDRY', 'OTHER'], inPrisonWorkOther: undefined },
    ).forEach(spec => {
      it(`form data: ${JSON.stringify(spec)}`, () => {
        // Given
        const expected: Array<Record<string, string>> = [
          { href: '#inPrisonWorkOther', text: 'Enter the type of work Ifereeca Peigh would like to do in prison' },
        ]

        // When
        const actual = validateInPrisonWorkForm(spec, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      })
    })
  })

  it(`sad path - inPrisonWorkOther exceeds length`, () => {
    // Given
    const form: InPrisonWorkForm = { inPrisonWorkOther: 'a'.repeat(256), inPrisonWork: ['OTHER'] }

    const expected: Array<Record<string, string>> = [
      { href: '#inPrisonWorkOther', text: 'The type of work must be 255 characters or less' },
    ]

    // When
    const actual = validateInPrisonWorkForm(form, prisonerSummary)

    // Then
    expect(actual).toEqual(expected)
  })
})
