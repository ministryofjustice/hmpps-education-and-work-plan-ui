import { addDays, startOfToday, subDays } from 'date-fns'
import type { WhoCompletedInductionForm } from 'inductionForms'
import validateWhoCompletedInductionForm from './whoCompletedInductionFormValidator'
import SessionCompletedByValue from '../../../enums/sessionCompletedByValue'

describe('whoCompletedInductionFormValidator', () => {
  const today = startOfToday()
  const yesterday = subDays(today, 1)
  const tomorrow = addDays(today, 1)

  describe('happy path - validation passes', () => {
    it(`induction performed by myself with a valid date`, () => {
      // Given
      const form: WhoCompletedInductionForm = {
        completedBy: SessionCompletedByValue.MYSELF,
        'inductionDate-day': yesterday.getDate().toString(),
        'inductionDate-month': (yesterday.getMonth() + 1).toString(),
        'inductionDate-year': yesterday.getFullYear().toString(),
      }

      const expected: Array<Record<string, string>> = []

      // When
      const actual = validateWhoCompletedInductionForm(form)

      // Then
      expect(actual).toEqual(expected)
    })

    it(`induction performed by somebody else with a valid date`, () => {
      // Given
      const form: WhoCompletedInductionForm = {
        completedBy: SessionCompletedByValue.SOMEBODY_ELSE,
        completedByOtherFullName: 'Buck Rogers',
        completedByOtherJobRole: 'CIAG',
        'inductionDate-day': yesterday.getDate().toString(),
        'inductionDate-month': (yesterday.getMonth() + 1).toString(),
        'inductionDate-year': yesterday.getFullYear().toString(),
      }

      const expected: Array<Record<string, string>> = []

      // When
      const actual = validateWhoCompletedInductionForm(form)

      // Then
      expect(actual).toEqual(expected)
    })
  })

  describe('sad path - validation fails', () => {
    it(`missing completedBy field`, () => {
      // Given
      const form: WhoCompletedInductionForm = {
        completedBy: undefined,
        'inductionDate-day': yesterday.getDate().toString(),
        'inductionDate-month': (yesterday.getMonth() + 1).toString(),
        'inductionDate-year': yesterday.getFullYear().toString(),
      }

      const expected: Array<Record<string, string>> = [
        { href: '#completedBy', text: 'Select who completed the induction' },
      ]

      // When
      const actual = validateWhoCompletedInductionForm(form)

      // Then
      expect(actual).toEqual(expected)
    })

    it(`missing completedByOtherFullName field`, () => {
      // Given
      const form: WhoCompletedInductionForm = {
        completedBy: SessionCompletedByValue.SOMEBODY_ELSE,
        completedByOtherFullName: undefined,
        completedByOtherJobRole: 'CIAG',
        'inductionDate-day': yesterday.getDate().toString(),
        'inductionDate-month': (yesterday.getMonth() + 1).toString(),
        'inductionDate-year': yesterday.getFullYear().toString(),
      }

      const expected: Array<Record<string, string>> = [
        { href: '#completedByOtherFullName', text: 'Enter the full name of the person who completed the induction' },
      ]

      // When
      const actual = validateWhoCompletedInductionForm(form)

      // Then
      expect(actual).toEqual(expected)
    })

    it(`missing completedByOtherJobRole field`, () => {
      // Given
      const form: WhoCompletedInductionForm = {
        completedBy: SessionCompletedByValue.SOMEBODY_ELSE,
        completedByOtherFullName: 'Joey Beltram',
        completedByOtherJobRole: undefined,
        'inductionDate-day': yesterday.getDate().toString(),
        'inductionDate-month': (yesterday.getMonth() + 1).toString(),
        'inductionDate-year': yesterday.getFullYear().toString(),
      }

      const expected: Array<Record<string, string>> = [
        { href: '#completedByOtherJobRole', text: 'Enter the job title of the person who completed the induction' },
      ]

      // When
      const actual = validateWhoCompletedInductionForm(form)

      // Then
      expect(actual).toEqual(expected)
    })

    it(`missing completedByOtherFullName and completedByOtherJobRole fields`, () => {
      // Given
      const form: WhoCompletedInductionForm = {
        completedBy: SessionCompletedByValue.SOMEBODY_ELSE,
        completedByOtherFullName: undefined,
        completedByOtherJobRole: undefined,
        'inductionDate-day': yesterday.getDate().toString(),
        'inductionDate-month': (yesterday.getMonth() + 1).toString(),
        'inductionDate-year': yesterday.getFullYear().toString(),
      }

      const expected: Array<Record<string, string>> = [
        { href: '#completedByOtherFullName', text: 'Enter the full name of the person who completed the induction' },
        { href: '#completedByOtherJobRole', text: 'Enter the job title of the person who completed the induction' },
      ]

      // When
      const actual = validateWhoCompletedInductionForm(form)

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
    ])('invalid induction date fields: %s', spec => {
      // Given
      const form: WhoCompletedInductionForm = {
        completedBy: SessionCompletedByValue.MYSELF,
        'inductionDate-day': spec.day,
        'inductionDate-month': spec.month,
        'inductionDate-year': spec.year,
      }

      const expected: Array<Record<string, string>> = [{ href: '#induction-date', text: 'Enter a valid date' }]

      // When
      const actual = validateWhoCompletedInductionForm(form)

      // Then
      expect(actual).toEqual(expected)
    })

    it(`induction date in the future`, () => {
      // Given
      const form: WhoCompletedInductionForm = {
        completedBy: SessionCompletedByValue.MYSELF,
        'inductionDate-day': tomorrow.getDate().toString(),
        'inductionDate-month': (tomorrow.getMonth() + 1).toString(),
        'inductionDate-year': tomorrow.getFullYear().toString(),
      }

      const expected: Array<Record<string, string>> = [
        { href: '#induction-date', text: 'Enter a valid date. Date cannot be in the future' },
      ]

      // When
      const actual = validateWhoCompletedInductionForm(form)

      // Then
      expect(actual).toEqual(expected)
    })

    it(`completed by other full name too long`, () => {
      // Given
      const form: WhoCompletedInductionForm = {
        completedBy: SessionCompletedByValue.SOMEBODY_ELSE,
        completedByOtherFullName: 'a'.repeat(201),
        completedByOtherJobRole: 'CIAG',
        'inductionDate-day': yesterday.getDate().toString(),
        'inductionDate-month': (yesterday.getMonth() + 1).toString(),
        'inductionDate-year': yesterday.getFullYear().toString(),
      }

      const expected: Array<Record<string, string>> = [
        { href: '#completedByOtherFullName', text: 'Full name must be 200 characters or less' },
      ]

      // When
      const actual = validateWhoCompletedInductionForm(form)

      // Then
      expect(actual).toEqual(expected)
    })
  })

  it(`completed by other job role too long`, () => {
    // Given
    const form: WhoCompletedInductionForm = {
      completedBy: SessionCompletedByValue.SOMEBODY_ELSE,
      completedByOtherFullName: 'Joey Beltram',
      completedByOtherJobRole: 'a'.repeat(201),
      'inductionDate-day': yesterday.getDate().toString(),
      'inductionDate-month': (yesterday.getMonth() + 1).toString(),
      'inductionDate-year': yesterday.getFullYear().toString(),
    }

    const expected: Array<Record<string, string>> = [
      { href: '#completedByOtherJobRole', text: 'Job role must be 200 characters or less' },
    ]

    // When
    const actual = validateWhoCompletedInductionForm(form)

    // Then
    expect(actual).toEqual(expected)
  })
})
