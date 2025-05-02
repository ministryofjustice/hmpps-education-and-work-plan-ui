import { addDays, format, startOfToday, subDays } from 'date-fns'
import type { WhoCompletedReviewForm } from 'reviewPlanForms'
import validateWhoCompletedReviewForm from './whoCompletedReviewFormValidator'
import SessionCompletedByValue from '../../../enums/sessionCompletedByValue'

describe('whoCompletedReviewFormValidator', () => {
  const today = startOfToday()
  const yesterday = subDays(today, 1)
  const tomorrow = addDays(today, 1)

  describe('happy path - validation passes', () => {
    it(`review performed by myself with a valid date`, () => {
      // Given
      const form: WhoCompletedReviewForm = {
        completedBy: SessionCompletedByValue.MYSELF,
        reviewDate: format(yesterday, 'dd/MM/yyyy'),
      }

      const expected: Array<Record<string, string>> = []

      // When
      const actual = validateWhoCompletedReviewForm(form)

      // Then
      expect(actual).toEqual(expected)
    })

    it(`review performed by somebody else with a valid date`, () => {
      // Given
      const form: WhoCompletedReviewForm = {
        completedBy: SessionCompletedByValue.SOMEBODY_ELSE,
        completedByOtherFullName: 'Buck Rogers',
        completedByOtherJobRole: 'CIAG',
        reviewDate: format(yesterday, 'dd/MM/yyyy'),
      }

      const expected: Array<Record<string, string>> = []

      // When
      const actual = validateWhoCompletedReviewForm(form)

      // Then
      expect(actual).toEqual(expected)
    })
  })

  describe('sad path - validation fails', () => {
    it(`missing completedBy field`, () => {
      // Given
      const form: WhoCompletedReviewForm = {
        completedBy: undefined,
        reviewDate: format(yesterday, 'dd/MM/yyyy'),
      }

      const expected: Array<Record<string, string>> = [
        { href: '#completedBy', text: 'Select who completed the review' },
      ]

      // When
      const actual = validateWhoCompletedReviewForm(form)

      // Then
      expect(actual).toEqual(expected)
    })

    it(`missing completedByOtherFullName field`, () => {
      // Given
      const form: WhoCompletedReviewForm = {
        completedBy: SessionCompletedByValue.SOMEBODY_ELSE,
        completedByOtherFullName: undefined,
        completedByOtherJobRole: 'CIAG',
        reviewDate: format(yesterday, 'dd/MM/yyyy'),
      }

      const expected: Array<Record<string, string>> = [
        { href: '#completedByOtherFullName', text: 'Enter the full name of the person who completed the review' },
      ]

      // When
      const actual = validateWhoCompletedReviewForm(form)

      // Then
      expect(actual).toEqual(expected)
    })

    it(`missing completedByOtherJobRole field`, () => {
      // Given
      const form: WhoCompletedReviewForm = {
        completedBy: SessionCompletedByValue.SOMEBODY_ELSE,
        completedByOtherFullName: 'Joey Beltram',
        completedByOtherJobRole: undefined,
        reviewDate: format(yesterday, 'dd/MM/yyyy'),
      }

      const expected: Array<Record<string, string>> = [
        { href: '#completedByOtherJobRole', text: 'Enter the job title of the person who completed the review' },
      ]

      // When
      const actual = validateWhoCompletedReviewForm(form)

      // Then
      expect(actual).toEqual(expected)
    })

    it(`missing completedByOtherFullName and completedByOtherJobRole fields`, () => {
      // Given
      const form: WhoCompletedReviewForm = {
        completedBy: SessionCompletedByValue.SOMEBODY_ELSE,
        completedByOtherFullName: undefined,
        completedByOtherJobRole: undefined,
        reviewDate: format(yesterday, 'dd/MM/yyyy'),
      }

      const expected: Array<Record<string, string>> = [
        { href: '#completedByOtherFullName', text: 'Enter the full name of the person who completed the review' },
        { href: '#completedByOtherJobRole', text: 'Enter the job title of the person who completed the review' },
      ]

      // When
      const actual = validateWhoCompletedReviewForm(form)

      // Then
      expect(actual).toEqual(expected)
    })

    it.each([
      { day: '', month: '', year: '' },
      { day: undefined, month: undefined, year: undefined },
      { day: null, month: null, year: null },
      { day: '', month: '1', year: '2024' },
      { day: '20', month: '', year: '2024' },
      { day: '20', month: '1', year: '' },
      { day: 'ABC', month: '1', year: '2024' },
      { day: '20', month: 'DEF', year: '2024' },
      { day: '20', month: '1', year: 'HIJ' },
      { day: '020', month: '1', year: '2024' },
      { day: '20', month: '001', year: '2024' },
      { day: '20', month: '1', year: '24' },
    ])('invalid review date fields: %s', spec => {
      // Given
      const form: WhoCompletedReviewForm = {
        completedBy: SessionCompletedByValue.MYSELF,
        reviewDate: `${spec.day}/${spec.month}/${spec.year}`,
      }

      const expected: Array<Record<string, string>> = [{ href: '#reviewDate', text: 'Enter a valid date' }]

      // When
      const actual = validateWhoCompletedReviewForm(form)

      // Then
      expect(actual).toEqual(expected)
    })

    it(`review date in the future`, () => {
      // Given
      const form: WhoCompletedReviewForm = {
        completedBy: SessionCompletedByValue.MYSELF,
        reviewDate: format(tomorrow, 'dd/MM/yyyy'),
      }

      const expected: Array<Record<string, string>> = [
        { href: '#reviewDate', text: 'Enter a valid date. Date cannot be in the future' },
      ]

      // When
      const actual = validateWhoCompletedReviewForm(form)

      // Then
      expect(actual).toEqual(expected)
    })

    it(`completed by other full name too long`, () => {
      // Given
      const form: WhoCompletedReviewForm = {
        completedBy: SessionCompletedByValue.SOMEBODY_ELSE,
        completedByOtherFullName: 'a'.repeat(201),
        completedByOtherJobRole: 'CIAG',
        reviewDate: format(yesterday, 'dd/MM/yyyy'),
      }

      const expected: Array<Record<string, string>> = [
        { href: '#completedByOtherFullName', text: 'Full name must be 200 characters or less' },
      ]

      // When
      const actual = validateWhoCompletedReviewForm(form)

      // Then
      expect(actual).toEqual(expected)
    })
  })

  it(`completed by other job role too long`, () => {
    // Given
    const form: WhoCompletedReviewForm = {
      completedBy: SessionCompletedByValue.SOMEBODY_ELSE,
      completedByOtherFullName: 'Joey Beltram',
      completedByOtherJobRole: 'a'.repeat(201),
      reviewDate: format(yesterday, 'dd/MM/yyyy'),
    }

    const expected: Array<Record<string, string>> = [
      { href: '#completedByOtherJobRole', text: 'Job role must be 200 characters or less' },
    ]

    // When
    const actual = validateWhoCompletedReviewForm(form)

    // Then
    expect(actual).toEqual(expected)
  })
})
