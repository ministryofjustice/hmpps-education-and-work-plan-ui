import type { ReasonsNotToGetWorkForm } from 'inductionForms'
import validateReasonsNotToGetWorkForm from './reasonsNotToGetWorkFormValidator'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'

describe('reasonsNotToGetWorkFormValidator', () => {
  const prisonerSummary = aValidPrisonerSummary()

  describe('happy path - validation passes', () => {
    Array.of<ReasonsNotToGetWorkForm>(
      { reasonsNotToGetWork: ['OTHER'], reasonsNotToGetWorkOther: 'Mental health' },
      { reasonsNotToGetWork: ['FULL_TIME_CARER'], reasonsNotToGetWorkOther: '' },
      { reasonsNotToGetWork: ['FULL_TIME_CARER'], reasonsNotToGetWorkOther: undefined },
      { reasonsNotToGetWork: ['FULL_TIME_CARER', 'OTHER'], reasonsNotToGetWorkOther: 'Mental health' },
      { reasonsNotToGetWork: ['NOT_SURE'], reasonsNotToGetWorkOther: '' },
    ).forEach(spec => {
      it(`form data: ${JSON.stringify(spec)}`, () => {
        // Given
        const expected: Array<Record<string, string>> = []

        // When
        const actual = validateReasonsNotToGetWorkForm(spec, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      })
    })
  })

  describe('sad path - validation of reasonsNotToGetWork field does not pass', () => {
    Array.of<ReasonsNotToGetWorkForm>(
      { reasonsNotToGetWork: [], reasonsNotToGetWorkOther: 'Mental health' },
      { reasonsNotToGetWork: [], reasonsNotToGetWorkOther: '' },
      { reasonsNotToGetWork: [], reasonsNotToGetWorkOther: undefined },
      { reasonsNotToGetWork: ['a-non-supported-value'], reasonsNotToGetWorkOther: undefined },
      { reasonsNotToGetWork: ['FULL_TIME'], reasonsNotToGetWorkOther: undefined },
      { reasonsNotToGetWork: ['FULL_TIME_CARER', 'a-non-supported-value'], reasonsNotToGetWorkOther: undefined },
      { reasonsNotToGetWork: ['FULL_TIME_CARER', 'NOT_SURE'], reasonsNotToGetWorkOther: undefined },
    ).forEach(spec => {
      it(`form data: ${JSON.stringify(spec)}`, () => {
        // Given
        const expected: Array<Record<string, string>> = [
          {
            href: '#reasonsNotToGetWork',
            text: `Select what could stop Jimmy Lightfingers getting work on release, or select 'Not sure'`,
          },
        ]

        // When
        const actual = validateReasonsNotToGetWorkForm(spec, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      })
    })
  })

  describe('sad path - validation of reasonsNotToGetWorkOther field does not pass', () => {
    Array.of<ReasonsNotToGetWorkForm>(
      { reasonsNotToGetWork: ['OTHER'], reasonsNotToGetWorkOther: '' },
      { reasonsNotToGetWork: ['OTHER'], reasonsNotToGetWorkOther: undefined },
      { reasonsNotToGetWork: ['FULL_TIME_CARER', 'OTHER'], reasonsNotToGetWorkOther: '' },
      { reasonsNotToGetWork: ['FULL_TIME_CARER', 'OTHER'], reasonsNotToGetWorkOther: undefined },
    ).forEach(spec => {
      it(`form data: ${JSON.stringify(spec)}`, () => {
        // Given
        const expected: Array<Record<string, string>> = [
          {
            href: '#reasonsNotToGetWorkOther',
            text: `Enter what could stop Jimmy Lightfingers getting work on release`,
          },
        ]

        // When
        const actual = validateReasonsNotToGetWorkForm(spec, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      })
    })
  })
})
