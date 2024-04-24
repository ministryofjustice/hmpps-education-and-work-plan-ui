import type { PreviousWorkExperienceDetailForm } from 'inductionForms'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import validatePreviousWorkExperienceDetailForm from './previousWorkExperienceDetailFormValidator'

describe('previousWorkExperienceDetailFormValidator', () => {
  const prisonerSummary = aValidPrisonerSummary()

  describe('happy path - validation passes', () => {
    Array.of<PreviousWorkExperienceDetailForm>(
      { jobRole: 'Gardner', jobDetails: 'Tending the roses' },
      { jobRole: 'Shop assistant', jobDetails: 'Serving customers and stacking shelves' },
    ).forEach(spec => {
      it(`form data: ${JSON.stringify(spec)}`, () => {
        // Given
        const expected: Array<Record<string, string>> = []

        // When
        const actual = validatePreviousWorkExperienceDetailForm(spec, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      })
    })
  })

  describe('sad path - jobRole field does not exist', () => {
    Array.of<PreviousWorkExperienceDetailForm>(
      { jobRole: '', jobDetails: 'Tending the roses' },
      { jobRole: undefined, jobDetails: 'Tending the roses' },
      { jobRole: null, jobDetails: 'Tending the roses' },
    ).forEach(spec => {
      it(`form data: ${JSON.stringify(spec)}`, () => {
        // Given
        const expected: Array<Record<string, string>> = [
          { href: '#jobRole', text: 'Enter the job role Jimmy Lightfingers wants to add' },
        ]

        // When
        const actual = validatePreviousWorkExperienceDetailForm(spec, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      })
    })
  })

  describe('sad path - jobRole exceeds length', () => {
    Array.of<PreviousWorkExperienceDetailForm>({ jobRole: 'a'.repeat(201), jobDetails: 'Tending the roses' }).forEach(
      spec => {
        it(`form data: ${JSON.stringify(spec)}`, () => {
          // Given
          const expected: Array<Record<string, string>> = [
            { href: '#jobRole', text: 'Job role must be 200 characters or less' },
          ]

          // When
          const actual = validatePreviousWorkExperienceDetailForm(spec, prisonerSummary)

          // Then
          expect(actual).toEqual(expected)
        })
      },
    )
  })

  describe('sad path - jobDetails field does not exist', () => {
    Array.of<PreviousWorkExperienceDetailForm>(
      { jobRole: 'Gardener', jobDetails: '' },
      { jobRole: 'Gardener', jobDetails: undefined },
      { jobRole: 'Gardener', jobDetails: null },
    ).forEach(spec => {
      it(`form data: ${JSON.stringify(spec)}`, () => {
        // Given
        const expected: Array<Record<string, string>> = [
          { href: '#jobDetails', text: 'Enter details of what Jimmy Lightfingers did in their job' },
        ]

        // When
        const actual = validatePreviousWorkExperienceDetailForm(spec, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      })
    })
  })

  describe('sad path - jobDetails exceeds length', () => {
    Array.of<PreviousWorkExperienceDetailForm>({ jobRole: 'Gardener', jobDetails: 'a'.repeat(4001) }).forEach(spec => {
      it(`form data: ${JSON.stringify(spec)}`, () => {
        // Given
        const expected: Array<Record<string, string>> = [
          { href: '#jobDetails', text: 'Main tasks and responsibilities must be 4000 characters or less' },
        ]

        // When
        const actual = validatePreviousWorkExperienceDetailForm(spec, prisonerSummary)

        // Then
        expect(actual).toEqual(expected)
      })
    })
  })
})
