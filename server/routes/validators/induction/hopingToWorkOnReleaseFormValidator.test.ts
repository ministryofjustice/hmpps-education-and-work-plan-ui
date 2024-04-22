import type { HopingToWorkOnReleaseForm } from 'inductionForms'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import validateHopingToWorkOnReleaseForm from './hopingToWorkOnReleaseFormValidator'

describe('hopingToWorkOnReleaseFormValidator', () => {
  const prisonerSummary = aValidPrisonerSummary()

  describe('happy path - validation passes', () => {
    Array.of<HopingToWorkOnReleaseForm>(
      { hopingToGetWork: 'YES' },
      { hopingToGetWork: 'NO' },
      { hopingToGetWork: 'NOT_SURE' },
    ).forEach(spec => {
      it(`form data: ${JSON.stringify(spec)}`, () => {
        // Given
        const expected: Array<Record<string, string>> = []

        // When
        const actual = validateHopingToWorkOnReleaseForm(spec, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      })
    })
  })

  describe('sad path - validation of affectAbilityToWork field does not pass', () => {
    Array.of<HopingToWorkOnReleaseForm>(
      { hopingToGetWork: 'a-non-supported-value' },
      { hopingToGetWork: 'Y' },
      { hopingToGetWork: null },
      { hopingToGetWork: undefined },
      { hopingToGetWork: '' },
    ).forEach(spec => {
      it(`form data: ${JSON.stringify(spec)}`, () => {
        // Given
        const expected: Array<Record<string, string>> = [
          {
            href: '#hopingToGetWork',
            text: `Select whether Jimmy Lightfingers is hoping to get work`,
          },
        ]

        // When
        const actual = validateHopingToWorkOnReleaseForm(spec, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      })
    })
  })
})
