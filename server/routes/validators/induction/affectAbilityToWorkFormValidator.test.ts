import type { AffectAbilityToWorkForm } from 'inductionForms'
import validateAffectAbilityToWorkForm from './affectAbilityToWorkFormValidator'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'

describe('affectAbilityToWorkFormValidator', () => {
  const prisonerSummary = aValidPrisonerSummary()

  describe('happy path - validation passes', () => {
    Array.of<AffectAbilityToWorkForm>(
      { affectAbilityToWork: ['OTHER'], affectAbilityToWorkOther: 'Mental health' },
      { affectAbilityToWork: ['NO_RIGHT_TO_WORK'], affectAbilityToWorkOther: '' },
      { affectAbilityToWork: ['NO_RIGHT_TO_WORK'], affectAbilityToWorkOther: undefined },
      { affectAbilityToWork: ['NO_RIGHT_TO_WORK', 'OTHER'], affectAbilityToWorkOther: 'Mental health' },
      { affectAbilityToWork: ['NONE'], affectAbilityToWorkOther: '' },
    ).forEach(spec => {
      it(`form data: ${JSON.stringify(spec)}`, () => {
        // Given
        const expected: Array<Record<string, string>> = []

        // When
        const actual = validateAffectAbilityToWorkForm(spec, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      })
    })
  })

  describe('sad path - validation of affectAbilityToWork field does not pass', () => {
    Array.of<AffectAbilityToWorkForm>(
      { affectAbilityToWork: [], affectAbilityToWorkOther: 'Mental health' },
      { affectAbilityToWork: [], affectAbilityToWorkOther: '' },
      { affectAbilityToWork: [], affectAbilityToWorkOther: undefined },
      { affectAbilityToWork: ['a-non-supported-value'], affectAbilityToWorkOther: undefined },
      { affectAbilityToWork: ['NO_RIGHT'], affectAbilityToWorkOther: undefined },
      { affectAbilityToWork: ['NO_RIGHT_TO_WORK', 'a-non-supported-value'], affectAbilityToWorkOther: undefined },
      { affectAbilityToWork: ['NO_RIGHT_TO_WORK', 'NONE'], affectAbilityToWorkOther: undefined },
    ).forEach(spec => {
      it(`form data: ${JSON.stringify(spec)}`, () => {
        // Given
        const expected: Array<Record<string, string>> = [
          {
            href: '#affectAbilityToWork',
            text: `Select factors affecting Ifereeca Peigh's ability to work or select 'None of these'`,
          },
        ]

        // When
        const actual = validateAffectAbilityToWorkForm(spec, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      })
    })
  })

  describe('sad path - affectAbilityToWorkOther field does not exist given affectAbilityToWork includes OTHER', () => {
    Array.of<AffectAbilityToWorkForm>(
      { affectAbilityToWork: ['OTHER'], affectAbilityToWorkOther: '' },
      { affectAbilityToWork: ['OTHER'], affectAbilityToWorkOther: undefined },
      { affectAbilityToWork: ['NO_RIGHT_TO_WORK', 'OTHER'], affectAbilityToWorkOther: '' },
      { affectAbilityToWork: ['NO_RIGHT_TO_WORK', 'OTHER'], affectAbilityToWorkOther: undefined },
    ).forEach(spec => {
      it(`form data: ${JSON.stringify(spec)}`, () => {
        // Given
        const expected: Array<Record<string, string>> = [
          { href: '#affectAbilityToWorkOther', text: `Enter factors affecting Ifereeca Peigh's ability to work` },
        ]

        // When
        const actual = validateAffectAbilityToWorkForm(spec, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      })
    })
  })

  it(`sad path - affectAbilityToWorkOther exceeds length`, () => {
    // Given
    const form: AffectAbilityToWorkForm = { affectAbilityToWorkOther: 'a'.repeat(513), affectAbilityToWork: ['OTHER'] }

    const expected: Array<Record<string, string>> = [
      {
        href: '#affectAbilityToWorkOther',
        text: 'The factors affecting ability to work must be 512 characters or less',
      },
    ]

    // When
    const actual = validateAffectAbilityToWorkForm(form, prisonerSummary)

    // Then
    expect(actual).toEqual(expected)
  })
})
