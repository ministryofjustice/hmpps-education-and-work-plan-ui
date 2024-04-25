import type { PersonalInterestsForm } from 'inductionForms'
import validatePersonalInterestsForm from './personalInterestsFormValidator'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'

describe('personalInterestsFormValidator', () => {
  const prisonerSummary = aValidPrisonerSummary()

  describe('happy path - validation passes', () => {
    Array.of<PersonalInterestsForm>(
      { personalInterests: ['OTHER'], personalInterestsOther: 'Renewable energy' },
      { personalInterests: ['MUSICAL'], personalInterestsOther: '' },
      { personalInterests: ['MUSICAL'], personalInterestsOther: undefined },
      { personalInterests: ['MUSICAL', 'OTHER'], personalInterestsOther: 'Renewable energy' },
      { personalInterests: ['NONE'], personalInterestsOther: '' },
    ).forEach(spec => {
      it(`form data: ${JSON.stringify(spec)}`, () => {
        // Given
        const expected: Array<Record<string, string>> = []

        // When
        const actual = validatePersonalInterestsForm(spec, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      })
    })
  })

  describe('sad path - validation of personalInterests field does not pass', () => {
    Array.of<PersonalInterestsForm>(
      { personalInterests: [], personalInterestsOther: 'Renewable energy' },
      { personalInterests: [], personalInterestsOther: '' },
      { personalInterests: [], personalInterestsOther: undefined },
      { personalInterests: ['a-non-supported-value'], personalInterestsOther: undefined },
      { personalInterests: ['SOLO_AC'], personalInterestsOther: undefined },
      { personalInterests: ['MUSICAL', 'a-non-supported-value'], personalInterestsOther: undefined },
      { personalInterests: ['MUSICAL', 'NONE'], personalInterestsOther: undefined },
    ).forEach(spec => {
      it(`form data: ${JSON.stringify(spec)}`, () => {
        // Given
        const expected: Array<Record<string, string>> = [
          {
            href: '#personalInterests',
            text: `Select Jimmy Lightfingers's interests or select 'None of these'`,
          },
        ]

        // When
        const actual = validatePersonalInterestsForm(spec, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      })
    })
  })

  describe('sad path - validation of personalInterestsOther field does not pass', () => {
    Array.of<PersonalInterestsForm>(
      { personalInterests: ['OTHER'], personalInterestsOther: '' },
      { personalInterests: ['OTHER'], personalInterestsOther: undefined },
      { personalInterests: ['MUSICAL', 'OTHER'], personalInterestsOther: '' },
      { personalInterests: ['MUSICAL', 'OTHER'], personalInterestsOther: undefined },
    ).forEach(spec => {
      it(`form data: ${JSON.stringify(spec)}`, () => {
        // Given
        const expected: Array<Record<string, string>> = [
          { href: '#personalInterestsOther', text: `Enter Jimmy Lightfingers's interests` },
        ]

        // When
        const actual = validatePersonalInterestsForm(spec, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      })
    })
  })
})
