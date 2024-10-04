import { addDays, startOfToday, subDays } from 'date-fns'
import type { WhoCompletedReviewForm } from 'reviewPlanForms'
import validateWhoCompletedReviewForm from './whoCompletedReviewFormValidator'
import ReviewPlanCompletedByValue from '../../../enums/reviewPlanCompletedByValue'

describe('whoCompletedReviewFormValidator', () => {
  const today = startOfToday()
  const yesterday = subDays(today, 1)
  const tomorrow = addDays(today, 1)

  describe('happy path - validation passes', () => {
    it(`review performed by myself with a valid date`, () => {
      // Given
      const form: WhoCompletedReviewForm = {
        completedBy: ReviewPlanCompletedByValue.MYSELF,
        'reviewDate-day': yesterday.getDate().toString(),
        'reviewDate-month': (yesterday.getMonth() + 1).toString(),
        'reviewDate-year': yesterday.getFullYear().toString(),
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
        completedBy: ReviewPlanCompletedByValue.SOMEBODY_ELSE,
        completedByOther: 'Buck Rogers',
        'reviewDate-day': yesterday.getDate().toString(),
        'reviewDate-month': (yesterday.getMonth() + 1).toString(),
        'reviewDate-year': yesterday.getFullYear().toString(),
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
        'reviewDate-day': yesterday.getDate().toString(),
        'reviewDate-month': (yesterday.getMonth() + 1).toString(),
        'reviewDate-year': yesterday.getFullYear().toString(),
      }

      const expected: Array<Record<string, string>> = [
        { href: '#completedBy', text: 'Select who completed the review' },
      ]

      // When
      const actual = validateWhoCompletedReviewForm(form)

      // Then
      expect(actual).toEqual(expected)
    })

    it(`missing completedByOther field`, () => {
      // Given
      const form: WhoCompletedReviewForm = {
        completedBy: ReviewPlanCompletedByValue.SOMEBODY_ELSE,
        completedByOther: undefined,
        'reviewDate-day': yesterday.getDate().toString(),
        'reviewDate-month': (yesterday.getMonth() + 1).toString(),
        'reviewDate-year': yesterday.getFullYear().toString(),
      }

      const expected: Array<Record<string, string>> = [
        { href: '#completedByOther', text: 'Enter the name of the person who completed the review' },
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
        completedBy: ReviewPlanCompletedByValue.MYSELF,
        'reviewDate-day': spec.day,
        'reviewDate-month': spec.month,
        'reviewDate-year': spec.year,
      }

      const expected: Array<Record<string, string>> = [
        { href: '#review-date', text: 'Enter a valid date that the review was completed on' },
      ]

      // When
      const actual = validateWhoCompletedReviewForm(form)

      // Then
      expect(actual).toEqual(expected)
    })

    it(`review date in the future`, () => {
      // Given
      const form: WhoCompletedReviewForm = {
        completedBy: ReviewPlanCompletedByValue.MYSELF,
        'reviewDate-day': tomorrow.getDate().toString(),
        'reviewDate-month': (tomorrow.getMonth() + 1).toString(),
        'reviewDate-year': tomorrow.getFullYear().toString(),
      }

      const expected: Array<Record<string, string>> = [
        { href: '#review-date', text: 'Enter a valid date. Date cannot be in the future' },
      ]

      // When
      const actual = validateWhoCompletedReviewForm(form)

      // Then
      expect(actual).toEqual(expected)
    })

    it(`completed by other name too long`, () => {
      // Given
      const form: WhoCompletedReviewForm = {
        completedBy: ReviewPlanCompletedByValue.SOMEBODY_ELSE,
        completedByOther: 'a'.repeat(201),
        'reviewDate-day': yesterday.getDate().toString(),
        'reviewDate-month': (yesterday.getMonth() + 1).toString(),
        'reviewDate-year': yesterday.getFullYear().toString(),
      }

      const expected: Array<Record<string, string>> = [
        { href: '#completedByOther', text: 'The person who completed the review must be 200 characters or less' },
      ]

      // When
      const actual = validateWhoCompletedReviewForm(form)

      // Then
      expect(actual).toEqual(expected)
    })
  })
})
