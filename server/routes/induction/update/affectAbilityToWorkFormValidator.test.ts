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

  //  //  LIMITED_BY_OFFENSE = 'LIMITED_BY_OFFENSE',
  //   //   CARING_RESPONSIBILITIES = 'CARING_RESPONSIBILITIES',
  //   //   HEALTH_ISSUES = 'HEALTH_ISSUES',
  //   //   NO_RIGHT_TO_WORK = 'NO_RIGHT_TO_WORK',
  //   //   OTHER = 'OTHER',
  //   //   NONE = 'NONE',
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
            text: `Select factors affecting Jimmy Lightfingers's ability to work or select 'None of these'`,
          },
        ]

        // When
        const actual = validateAffectAbilityToWorkForm(spec, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      })
    })
  })

  describe('sad path - validation of affectAbilityToWorkOther field does not pass', () => {
    Array.of<AffectAbilityToWorkForm>(
      { affectAbilityToWork: ['OTHER'], affectAbilityToWorkOther: '' },
      { affectAbilityToWork: ['OTHER'], affectAbilityToWorkOther: undefined },
      { affectAbilityToWork: ['NO_RIGHT_TO_WORK', 'OTHER'], affectAbilityToWorkOther: '' },
      { affectAbilityToWork: ['NO_RIGHT_TO_WORK', 'OTHER'], affectAbilityToWorkOther: undefined },
    ).forEach(spec => {
      it(`form data: ${JSON.stringify(spec)}`, () => {
        // Given
        const expected: Array<Record<string, string>> = [
          { href: '#affectAbilityToWorkOther', text: `Enter factors affecting Jimmy Lightfingers's ability to work` },
        ]

        // When
        const actual = validateAffectAbilityToWorkForm(spec, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      })
    })
  })
})
