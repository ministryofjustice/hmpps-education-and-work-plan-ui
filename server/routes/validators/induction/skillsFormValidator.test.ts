import type { SkillsForm } from 'inductionForms'
import validateSkillsForm from './skillsFormValidator'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'

describe('skillsFormValidator', () => {
  const prisonerSummary = aValidPrisonerSummary()

  describe('happy path - validation passes', () => {
    Array.of<SkillsForm>(
      { skills: ['OTHER'], skillsOther: 'Circus skills' },
      { skills: ['POSITIVE_ATTITUDE'], skillsOther: '' },
      { skills: ['POSITIVE_ATTITUDE'], skillsOther: undefined },
      { skills: ['POSITIVE_ATTITUDE', 'OTHER'], skillsOther: 'Circus skills' },
      { skills: ['NONE'], skillsOther: '' },
    ).forEach(spec => {
      it(`form data: ${JSON.stringify(spec)}`, () => {
        // Given
        const expected: Array<Record<string, string>> = []

        // When
        const actual = validateSkillsForm(spec, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      })
    })
  })

  describe('sad path - validation of skills field does not pass', () => {
    Array.of<SkillsForm>(
      { skills: [], skillsOther: 'Circus skills' },
      { skills: [], skillsOther: '' },
      { skills: [], skillsOther: undefined },
      { skills: ['a-non-supported-value'], skillsOther: undefined },
      { skills: ['WILLINGNESS_TO_L'], skillsOther: undefined },
      { skills: ['POSITIVE_ATTITUDE', 'a-non-supported-value'], skillsOther: undefined },
      { skills: ['POSITIVE_ATTITUDE', 'NONE'], skillsOther: undefined },
    ).forEach(spec => {
      it(`form data: ${JSON.stringify(spec)}`, () => {
        // Given
        const expected: Array<Record<string, string>> = [
          {
            href: '#skills',
            text: `Select the skills that Jimmy Lightfingers feels they have or select 'None of these'`,
          },
        ]

        // When
        const actual = validateSkillsForm(spec, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      })
    })
  })

  describe('sad path - validation of skillsOther field does not pass', () => {
    Array.of<SkillsForm>(
      { skills: ['OTHER'], skillsOther: '' },
      { skills: ['OTHER'], skillsOther: undefined },
      { skills: ['POSITIVE_ATTITUDE', 'OTHER'], skillsOther: '' },
      { skills: ['POSITIVE_ATTITUDE', 'OTHER'], skillsOther: undefined },
    ).forEach(spec => {
      it(`form data: ${JSON.stringify(spec)}`, () => {
        // Given
        const expected: Array<Record<string, string>> = [
          { href: '#skillsOther', text: 'Enter the skill that Jimmy Lightfingers feels they have' },
        ]

        // When
        const actual = validateSkillsForm(spec, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      })
    })
  })
})
